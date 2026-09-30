import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const type = searchParams.get("type");

    if (!q) {
      return NextResponse.json({ products: [], posts: [] });
    }

    const productFilter = {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { shortDesc: { contains: q, mode: "insensitive" as const } },
        { category: { contains: q, mode: "insensitive" as const } },
      ],
    };

    const products = await prisma.product.findMany({
      where: {
        ...productFilter,
        status: "active",
        ...(type && (type === "template" || type === "source-code") ? { type } : {}),
      },
      take: 20,
    });

    return NextResponse.json({ products, posts: [] });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
