import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelOrder } from "@/lib/order-actions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ ok: false, status: "paid" });
    }
    if (order.status === "cancelled") {
      return NextResponse.json({ ok: true, status: "cancelled" });
    }

    const session = await auth();
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;
    const isAdmin = sessionUser?.role === "admin" || sessionUser?.role === "super_admin";
    const isOwner = !!sessionUser?.id && sessionUser.id === order.userId;

    // Guest checkout has no session — only an unpaid pending order can be
    // abandoned without authentication (cancelOrder still verifies with Cashfree).
    if (!isOwner && !isAdmin && order.status !== "pending") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await cancelOrder(orderId);
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (error) {
    console.error("[ORDER_CANCEL]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
