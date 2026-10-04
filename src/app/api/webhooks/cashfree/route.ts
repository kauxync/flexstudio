import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/cashfree";
import { cancelOrder, ensureCouponUsage } from "@/lib/order-actions";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") || "";
    const timestamp = req.headers.get("x-webhook-timestamp") || "";

    // Verify webhook signature
    const isValid = verifyWebhookSignature(signature, timestamp, rawBody);
    if (!isValid) {
      console.error("[CASHFREE_WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventType = body.type;
    // Cashfree sends the event data under `data` (some versions use `payload`)
    const payload = body.data || body.payload;

    console.log("[CASHFREE_WEBHOOK] Event:", eventType);

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      const orderId = payload?.order?.order_id;
      const paymentId = payload?.payment?.cf_payment_id;

      if (!orderId) {
        return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status !== "paid") {
        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            cfPaymentId: paymentId,
          },
        });

        // Increment download counts
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { downloadCount: { increment: 1 } },
          });
        }

        // Clear user's cart
        await prisma.cartItem.deleteMany({
          where: { userId: order.userId },
        });

        // Restore coupon usage if it was released by an earlier cancellation
        await ensureCouponUsage(order);

        console.log("[CASHFREE_WEBHOOK] Order", orderId, "marked as paid");
      }
    } else if (eventType === "PAYMENT_FAILED_WEBHOOK") {
      // A payment attempt failed but the Cashfree order is still payable,
      // so keep the order active (and the coupon reserved) for a retry.
      const orderId = payload?.order?.order_id;

      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId, status: "pending" },
          data: { status: "failed" },
        });
        console.log("[CASHFREE_WEBHOOK] Order", orderId, "payment attempt failed");
      }
    } else if (
      eventType === "PAYMENT_USER_DROPPED_WEBHOOK" ||
      eventType === "PAYMENT_USER_STOPPED_WEBHOOK" ||
      eventType === "PAYMENT_TERMINATED_WEBHOOK" ||
      eventType === "ORDER_EXPIRED_WEBHOOK" ||
      eventType === "ORDER_TERMINATED_WEBHOOK"
    ) {
      // User abandoned/cancelled the payment — cancel the order and release the coupon
      const orderId = payload?.order?.order_id;

      if (orderId) {
        const result = await cancelOrder(orderId);
        console.log("[CASHFREE_WEBHOOK] Order", orderId, "cancel result:", result);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[CASHFREE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
