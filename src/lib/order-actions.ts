import { prisma } from "@/lib/prisma";
import { cancelCashfreeOrder, fetchCashfreeOrder } from "@/lib/cashfree";

export interface CancelOrderResult {
  ok: boolean;
  status: string;
  reason?: string;
  cashfreeCancelled?: boolean;
}

export async function cancelOrder(
  orderId: string,
  options: { verifyCashfree?: boolean } = {}
): Promise<CancelOrderResult> {
  const { verifyCashfree = true } = options;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { ok: false, status: "not_found", reason: "Order not found" };
  }
  if (order.status === "paid") {
    return { ok: false, status: "paid", reason: "Order already paid" };
  }
  if (order.status === "cancelled") {
    return { ok: true, status: "cancelled", reason: "Already cancelled" };
  }

  // Never cancel an order Cashfree already reports as paid
  if (verifyCashfree) {
    try {
      const cfOrder = await fetchCashfreeOrder(orderId);
      if ((cfOrder.order_status || "").toLowerCase() === "paid") {
        return { ok: false, status: "paid", reason: "Payment already succeeded" };
      }
    } catch {
      // Order missing or Cashfree unreachable — proceed; success webhook can override later
    }
  }

  const updated = await prisma.order.updateMany({
    where: { id: orderId, status: { notIn: ["paid", "cancelled"] } },
    data: { status: "cancelled" },
  });

  if (updated.count === 0) {
    const current = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    return current?.status === "paid"
      ? { ok: false, status: "paid", reason: "Payment already succeeded" }
      : { ok: true, status: current?.status || "cancelled", reason: "Already updated" };
  }

  // Release the coupon so the code can be used again
  const usage = await prisma.couponUsage.findFirst({ where: { orderId } });
  if (usage) {
    await prisma.couponUsage.delete({ where: { id: usage.id } });
    await prisma.coupon.update({
      where: { id: usage.couponId },
      data: { usedCount: { decrement: 1 } },
    });
  }

  const cashfreeCancelled = await cancelCashfreeOrder(orderId);

  console.log(
    "[ORDER_CANCELLED]",
    orderId,
    usage ? "coupon released" : "no coupon",
    cashfreeCancelled ? "cashfree cancelled" : "cashfree not cancelled"
  );

  return { ok: true, status: "cancelled", cashfreeCancelled };
}

export async function ensureCouponUsage(order: {
  id: string;
  userId: string;
  coupon: string | null;
}) {
  if (!order.coupon) return;

  try {
    const existing = await prisma.couponUsage.findFirst({ where: { orderId: order.id } });
    if (existing) return;

    const coupon = await prisma.coupon.findUnique({
      where: { code: order.coupon.toUpperCase() },
    });
    if (!coupon) return;

    await prisma.couponUsage.create({
      data: { couponId: coupon.id, userId: order.userId, orderId: order.id },
    });
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });
  } catch (error) {
    console.error("[COUPON_USAGE_RESTORE]", error);
  }
}
