import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, getUserId } from "@/lib/auth";

const MAX_COMMENT_LENGTH = 1000;

async function recalcProductRating(productId: string) {
  const allReviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const avgRating =
    allReviews.length > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { rating: avgRating, reviewCount: allReviews.length },
  });
}

function parseReviewInput(body: { rating?: unknown; comment?: unknown }) {
  const rating = parseInt(String(body?.rating));
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }
  if (!comment) {
    return { error: "Comment is required" };
  }
  if (comment.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be under ${MAX_COMMENT_LENGTH} characters` };
  }

  return { rating, comment };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const mine = searchParams.get("mine");

    if (mine) {
      const session = await auth();
      const userId = getUserId(session);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const reviews = await prisma.review.findMany({
        where: { userId },
        select: {
          id: true,
          productId: true,
          rating: true,
          comment: true,
          verified: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ reviews });
    }

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

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const input = parseReviewInput(body);
    if ("error" in input) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    const userRole = (session?.user as { role?: string } | null)?.role;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    let hasPurchased = false;
    if (!isAdmin) {
      const purchasedOrder = await prisma.order.findFirst({
        where: { userId, status: "paid", items: { some: { productId } } },
        select: { id: true },
      });
      if (!purchasedOrder) {
        return NextResponse.json(
          { error: "You can only review products you have purchased" },
          { status: 403 }
        );
      }
      hasPurchased = true;
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: input.rating,
        comment: input.comment,
        verified: hasPurchased,
      },
    });

    await recalcProductRating(productId);

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const input = parseReviewInput(body);
    if ("error" in input) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { rating: input.rating, comment: input.comment },
    });

    await recalcProductRating(existing.productId);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("[REVIEWS_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
