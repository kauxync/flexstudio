import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, getUserId } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { quantity, license } = body;

    const dataToUpdate: any = {};
    if (quantity !== undefined) {
      dataToUpdate.quantity = parseInt(quantity);
    }
    if (license && ["personal", "commercial", "extended"].includes(license)) {
      dataToUpdate.license = license;
    }

    const item = await prisma.cartItem.update({
      where: { id, userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("[CART_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Support both cart item ID and product ID
    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, OR: [{ id }, { productId: id }] },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
