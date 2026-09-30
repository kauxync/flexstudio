import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const tech = searchParams.get("tech");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const sort = searchParams.get("sort") || "popular";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    } else if (!status) {
      where.status = "active";
    }
    // If status=all, don't filter by status — show everything
    if (type) where.type = type;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { technologies: { hasSome: [search] } },
      ];
    }
    if (tech) where.technologies = { has: tech };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minRating) where.rating = { gte: parseFloat(minRating) };

    const orderBy: any = (() => {
      switch (sort) {
        case "newest": return { lastUpdated: "desc" };
        case "price-low": return { price: "asc" };
        case "price-high": return { price: "desc" };
        case "rating": return { rating: "desc" };
        default: return { downloadCount: "desc" };
      }
    })();

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new product (admin/super_admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "super_admin"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title || !data.slug || !data.price || !data.category) {
      return NextResponse.json({ error: "Title, slug, price, and category are required" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        shortDesc: data.shortDesc || data.title,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        type: data.type || "template",
        category: data.category,
        technologies: data.technologies || [],
        thumbnail: data.thumbnail || "",
        images: data.images || [],
        featured: data.featured || false,
        isNew: data.isNew || false,
        isBestseller: data.isBestseller || false,
        status: data.status || "active",
        zipUrl: data.zipUrl || null,
        demoUrl: data.demoUrl || null,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
