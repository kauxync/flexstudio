import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: (session.user as any).id },
      include: { product: true },
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, license } = await req.json();

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: (session.user as any).id, productId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already in cart" }, { status: 409 });
    }

    const item = await prisma.cartItem.create({
      data: {
        userId: (session.user as any).id,
        productId,
        license: license || "personal",
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
