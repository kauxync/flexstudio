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

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[CART_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = await getAuthUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to add items to cart." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const rawProductId = String(body.productId).trim();

    // Verify product exists by id or slug
    let product = await prisma.product.findUnique({
      where: { id: rawProductId },
      select: { id: true, title: true, price: true },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: rawProductId },
        select: { id: true, title: true, price: true },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const resolvedProductId = product.id;

    // Check if already in cart
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: resolvedProductId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already in cart", item: existing },
        { status: 409 }
      );
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: resolvedProductId,
        },
      },
      update: {},
      create: {
        userId,
        productId: resolvedProductId,
      },
      include: { product: true },
    });

    return NextResponse.json({ item, success: true }, { status: 201 });
  } catch (error: any) {
    console.error("[CART_POST_ERROR]", error);
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "User session is invalid. Please log out and sign in again.", code: "P2003" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add item to cart", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
