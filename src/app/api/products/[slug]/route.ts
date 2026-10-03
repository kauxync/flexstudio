import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { extractStorageCode, generateTemplateCode } from "@/lib/template-code";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const rawParams = await params;
    const slug = rawParams?.slug ? decodeURIComponent(rawParams.slug).trim() : "";

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Case-insensitive fallback lookup
    if (!product) {
      product = await prisma.product.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        include: {
          reviews: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure this product has an 8-char storageCode without blocking the GET response
    const derivedStorageCode =
      product.storageCode ||
      extractStorageCode(product.thumbnail) ||
      extractStorageCode(product.zipUrl) ||
      (Array.isArray(product.images) && product.images.length > 0
        ? extractStorageCode(product.images[0])
        : null) ||
      generateTemplateCode();

    if (!product.storageCode) {
      // Persist in background asynchronously so it never slows or fails the GET request
      prisma.product
        .update({
          where: { id: product.id },
          data: { storageCode: derivedStorageCode },
        })
        .catch((updateErr) => {
          console.warn("[BG_PRODUCT_STORAGE_CODE_UPDATE]", updateErr?.message || updateErr);
        });
    }

    return NextResponse.json({
      product: {
        ...product,
        storageCode: derivedStorageCode,
      },
    });
  } catch (error: any) {
    console.error("[GET_PRODUCT_BY_SLUG_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || String(error) },
      { status: 500 }
    );
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

    // STRICT CONSTRAINT: Template Storage Code is permanent and unchangeable
    delete data.storageCode;

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
