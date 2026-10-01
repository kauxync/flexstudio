import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/coupons - list all coupons
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { usages: true } } },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/coupons?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/coupons - toggle active
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id, active } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/coupons - create coupon
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { code, description, discountType, discountValue, minOrder, maxDiscount, usageLimit, perUserLimit, startDate, endDate } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrder: minOrder ? parseFloat(minOrder) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit) : 1,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
