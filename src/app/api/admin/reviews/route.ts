import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        product: { select: { id: true, title: true, slug: true, thumbnail: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.review.delete({
      where: { id },
      select: { productId: true },
    });

    // Recalculate product rating
    const remaining = await prisma.review.findMany({ where: { productId: review.productId } });
    const avgRating = remaining.length > 0
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: remaining.length },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, verified } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { verified },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
