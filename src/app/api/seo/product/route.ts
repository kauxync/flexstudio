import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const type = req.nextUrl.searchParams.get("type") || "template";

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        shortDesc: true,
        price: true,
        thumbnail: true,
        type: true,
        rating: true,
        reviewCount: true,
        slug: true,
        category: true,
        technologies: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
