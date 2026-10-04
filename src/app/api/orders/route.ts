import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCashfreeOrder } from "@/lib/cashfree";
import { cancelOrder } from "@/lib/order-actions";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: (session.user as any).id },
      include: {
        items: {
          include: { product: true },
        },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, coupon, phone, customerName: guestName, customerEmail: guestEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    let userId: string;
    let customerName: string;
    let customerEmail: string;
    let customerPhone: string;

    if (session?.user) {
      userId = (session.user as any).id;
      customerName = session.user.name || "Customer";
      customerEmail = session.user.email || "";

      if (phone) {
        await prisma.user.update({
          where: { id: userId },
          data: { phone },
        });
      }

      const user = await prisma.user.findUnique({ where: { id: userId }, select: { phone: true } });
      customerPhone = user?.phone || phone || "9999999999";
    } else {
      // Guest Checkout
      if (!guestEmail || !guestEmail.includes("@")) {
        return NextResponse.json({ error: "Valid email is required for checkout" }, { status: 400 });
      }

      let existingUser = await prisma.user.findUnique({ where: { email: guestEmail.toLowerCase().trim() } });
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: guestEmail.toLowerCase().trim(),
            name: guestName || guestEmail.split("@")[0],
            phone: phone || null,
            role: "user",
            emailVerified: new Date(),
          },
        });
      } else if (phone && !existingUser.phone) {
        await prisma.user.update({ where: { id: existingUser.id }, data: { phone } });
      }

      userId = existingUser.id;
      customerName = existingUser.name || guestName || "Customer";
      customerEmail = existingUser.email!;
      customerPhone = existingUser.phone || phone || "9999999999";
    }

    // Cancel abandoned pending orders (older than 5 minutes): this also
    // releases any coupon usage and cancels the order on Cashfree
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const staleOrders = await prisma.order.findMany({
      where: { userId, status: "pending", createdAt: { lt: fiveMinutesAgo } },
      select: { id: true },
    });
    for (const stale of staleOrders) {
      await cancelOrder(stale.id, { verifyCashfree: false });
    }

    const total = items.reduce((sum: number, item: any) => sum + item.price, 0);

    // Validate coupon from DB
    let discount = 0;
    let couponRecord = null;
    if (coupon) {
      couponRecord = await prisma.coupon.findUnique({ where: { code: coupon.toUpperCase() } });
      if (!couponRecord || !couponRecord.active) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
      // Check date
      const now = new Date();
      if (couponRecord.startDate && now < couponRecord.startDate) {
        return NextResponse.json({ error: "Coupon is not active yet" }, { status: 400 });
      }
      if (couponRecord.endDate && now > couponRecord.endDate) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }
      // Check usage limit
      if (couponRecord.usageLimit && couponRecord.usedCount >= couponRecord.usageLimit) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      // Check per-user limit
      const userUsageCount = await prisma.couponUsage.count({
        where: { couponId: couponRecord.id, userId },
      });
      if (userUsageCount >= couponRecord.perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }
      // Check min order
      if (total < couponRecord.minOrder) {
        return NextResponse.json({ error: `Minimum order amount is ₹${couponRecord.minOrder}` }, { status: 400 });
      }
      // Calculate discount
      if (couponRecord.discountType === "percentage") {
        discount = Math.round(total * couponRecord.discountValue / 100);
        if (couponRecord.maxDiscount) {
          discount = Math.min(discount, couponRecord.maxDiscount);
        }
      } else {
        discount = Math.min(couponRecord.discountValue, total);
      }
    }

    const finalAmount = total - discount;

    // Create order in DB with pending status
    const order = await prisma.order.create({
      data: {
        userId,
        total: finalAmount,
        coupon: coupon || null,
        discount: discount || 0,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Track coupon usage
    if (couponRecord) {
      await prisma.couponUsage.create({
        data: {
          couponId: couponRecord.id,
          userId,
          orderId: order.id,
        },
      });
      await prisma.coupon.update({
        where: { id: couponRecord.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Create Cashfree order
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${appUrl}/payment-success?order_id=${order.id}`;

    const cfOrder = await createCashfreeOrder({
      orderId: order.id,
      orderAmount: finalAmount,
      orderCurrency: "INR",
      customerDetails: {
        customerId: userId,
        customerName,
        customerEmail,
        customerPhone,
      },
      returnUrl,
    });

    // Save Cashfree order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { cfOrderId: cfOrder.cf_order_id },
    });

    return NextResponse.json({
      orderId: order.id,
      paymentSessionId: cfOrder.payment_session_id,
      cfOrderId: cfOrder.cf_order_id,
    });
  } catch (error: any) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
