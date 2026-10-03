import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, getAuthUserId } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = await getAuthUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = await getAuthUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to use wishlist." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const rawProductId = String(body.productId).trim();

    let product = await prisma.product.findUnique({
      where: { id: rawProductId },
      select: { id: true },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: rawProductId },
        select: { id: true },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const resolvedProductId = product.id;

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: resolvedProductId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already in wishlist", item: existing }, { status: 409 });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userId,
        productId: resolvedProductId,
      },
      include: { product: true },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
