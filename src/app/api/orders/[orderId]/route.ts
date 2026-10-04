import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchCashfreeOrder } from "@/lib/cashfree";
import { cancelOrder, ensureCouponUsage } from "@/lib/order-actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    if (!isAdmin && order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If order is still pending, try to verify with Cashfree
    // Cashfree GET /pg/orders/{order_id} expects the merchant order ID, not cf_order_id
    if (order.status === "pending") {
      try {
        const cfOrder = await fetchCashfreeOrder(orderId);
        const newStatus = cfOrder.order_status?.toLowerCase();

        if (newStatus === "paid") {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "paid" },
          });

          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { downloadCount: { increment: 1 } },
            });
          }

          await ensureCouponUsage(order);

          order.status = "paid";
        } else if (
          newStatus === "failed" ||
          newStatus === "terminated" ||
          newStatus === "termination_requested" ||
          newStatus === "expired" ||
          newStatus === "cancelled"
        ) {
          const result = await cancelOrder(orderId, { verifyCashfree: false });
          order.status = result.ok ? "cancelled" : order.status;
        }
      } catch (cfError) {
        console.error("[ORDER_STATUS_CHECK]", cfError);
      }
    }

    // Always clear cart when order is paid (handles both webhook and poll paths)
    if (order.status === "paid") {
      await prisma.cartItem.deleteMany({
        where: { userId: order.userId },
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const isAdmin = userRole === "admin" || userRole === "super_admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await params;
    const { status } = await req.json();

    const validStatuses = ["pending", "paid", "failed", "refunded", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

