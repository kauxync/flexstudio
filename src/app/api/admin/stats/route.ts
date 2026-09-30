import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch stats in parallel
    const [
      orders,
      products,
      usersCount,
      superAdminCount,
      adminCount,
      reviews,
      subscribersCount,
      couponsCount,
      activeCouponsCount,
    ] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: { id: true, title: true, slug: true, thumbnail: true, type: true, category: true },
              },
            },
          },
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          category: true,
          status: true,
          price: true,
          downloadCount: true,
          rating: true,
          reviewCount: true,
          thumbnail: true,
          createdAt: true,
        },
        orderBy: { downloadCount: "desc" },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "super_admin" } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.review.findMany({
        select: { rating: true },
      }),
      prisma.newsletter.count(),
      prisma.coupon.count(),
      prisma.coupon.count({ where: { active: true } }),
    ]);

    // Financial calculations
    const paidOrders = orders.filter((o) => o.status === "paid");
    const pendingOrders = orders.filter((o) => o.status === "pending");
    const failedOrders = orders.filter((o) => o.status === "failed");
    const refundedOrders = orders.filter((o) => o.status === "refunded");

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = paidOrders.length > 0 ? Math.round((totalRevenue / paidOrders.length) * 100) / 100 : 0;

    // Monthly revenue trend (last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyRevenueMap: Record<string, { month: string; revenue: number; orders: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      monthlyRevenueMap[key] = { month: key, revenue: 0, orders: 0 };
    }

    paidOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      if (monthlyRevenueMap[key]) {
        monthlyRevenueMap[key].revenue += o.total || 0;
        monthlyRevenueMap[key].orders += 1;
      }
    });

    const monthlyRevenue = Object.values(monthlyRevenueMap);

    // Products breakdown
    const activeProducts = products.filter((p) => p.status === "active").length;
    const draftProducts = products.filter((p) => p.status === "draft").length;
    const templatesCount = products.filter((p) => p.type === "template").length;
    const sourceCodeCount = products.filter((p) => p.type === "source-code").length;

    // Reviews summary
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 5.0;

    // Top products
    const topProducts = products.slice(0, 5);

    // Recent orders (last 8)
    const recentOrders = orders.slice(0, 8).map((o) => ({
      id: o.id,
      total: o.total,
      status: o.status,
      coupon: o.coupon,
      discount: o.discount,
      createdAt: o.createdAt,
      user: o.user,
      itemsCount: o.items.length,
      items: o.items,
    }));

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        avgOrderValue,
        monthly: monthlyRevenue,
      },
      orders: {
        total: orders.length,
        paid: paidOrders.length,
        pending: pendingOrders.length,
        failed: failedOrders.length,
        refunded: refundedOrders.length,
        recent: recentOrders,
      },
      products: {
        total: products.length,
        active: activeProducts,
        draft: draftProducts,
        templates: templatesCount,
        sourceCode: sourceCodeCount,
        top: topProducts,
      },
      users: {
        total: usersCount,
        superAdmin: superAdminCount,
        admin: adminCount,
        customer: Math.max(0, usersCount - superAdminCount - adminCount),
      },
      content: {
        reviewsCount: reviews.length,
        avgRating,
        subscribers: subscribersCount,
        coupons: couponsCount,
        activeCoupons: activeCouponsCount,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
