import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, getUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating),
        comment,
        verified: true,
      },
    });

    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
