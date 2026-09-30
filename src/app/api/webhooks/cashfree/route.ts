import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/cashfree";

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
    const payload = body.payload;

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

        console.log("[CASHFREE_WEBHOOK] Order", orderId, "marked as paid");
      }
    } else if (
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      eventType === "PAYMENT_TERMINATED_WEBHOOK"
    ) {
      const orderId = payload?.order?.order_id;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "failed" },
        });
        console.log("[CASHFREE_WEBHOOK] Order", orderId, "marked as failed");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[CASHFREE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
