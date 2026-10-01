import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { reviews: { include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: "desc" } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "super_admin"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const data = await req.json();

    const product = await prisma.product.update({
      where: { slug },
      data,
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "super_admin"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { orderItems: { select: { id: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.orderItems.length > 0) {
      // Archive product to preserve purchase history and prevent foreign key errors
      await prisma.product.update({
        where: { slug },
        data: { status: "archived" },
      });
      return NextResponse.json({
        success: true,
        archived: true,
        message: "Product has order history, so it was archived rather than deleted.",
      });
    }

    await prisma.product.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
