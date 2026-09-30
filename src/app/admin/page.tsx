"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Tag,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Star,
  FileText,
  Mail,
  ChevronRight,
  Database,
  CreditCard,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StatsData {
  revenue: {
    total: number;
    avgOrderValue: number;
    monthly: { month: string; revenue: number; orders: number }[];
  };
  orders: {
    total: number;
    paid: number;
    pending: number;
    failed: number;
    refunded: number;
    recent: any[];
  };
  products: {
    total: number;
    active: number;
    draft: number;
    templates: number;
    sourceCode: number;
    top: any[];
  };
  users: {
    total: number;
    superAdmin: number;
    admin: number;
    customer: number;
  };
  content: {
    reviewsCount: number;
    avgRating: number;
    subscribers: number;
    coupons: number;
    activeCoupons: number;
  };
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load admin stats", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-card/60 rounded-3xl border border-border/30" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-card/60 rounded-2xl border border-border/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-card/60 rounded-2xl border border-border/30" />
          <div className="h-80 bg-card/60 rounded-2xl border border-border/30" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Gross Revenue",
      value: `₹${(stats?.revenue.total || 0).toLocaleString("en-IN")}`,
      change: "+24.8% vs last mo",
      trend: "up",
      icon: DollarSign,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    },
    {
      label: "Paid Orders",
      value: stats?.orders.paid || 0,
      subtext: `${stats?.orders.total || 0} total created`,
      change: `${stats?.orders.pending || 0} pending`,
      trend: "neutral",
      icon: ShoppingBag,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
    },
    {
      label: "Live Products",
      value: stats?.products.active || 0,
      subtext: `${stats?.products.templates || 0} templates, ${stats?.products.sourceCode || 0} code`,
      change: `${stats?.products.draft || 0} drafts`,
      trend: "neutral",
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
      label: "Registered Users",
      value: stats?.users.total || 0,
      subtext: `${stats?.users.customer || 0} customers`,
      change: `${stats?.users.admin || 0} staff`,
      trend: "up",
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-400/10 border-violet-400/20",
    },
  ];

  const maxRevenue = Math.max(
    ...(stats?.revenue.monthly.map((m) => m.revenue) || [1000]),
    1000
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-r from-card/80 via-card/50 to-muted/20 p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                Executive Console
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()}, {session?.user?.name?.split(" ")[0] || "Admin"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Here is your live marketplace snapshot. Monitor sales performance, customer orders, inventory catalog, and growth channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              title="Refresh stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-gold" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link href="/admin/products/new">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold shadow-md">
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </Button>
            </Link>

            <Link href="/admin/orders">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ShoppingBag className="w-3.5 h-3.5" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="relative p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl hover:border-gold/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground truncate">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold tracking-tight font-sans text-foreground">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{kpi.subtext || kpi.change}</span>
                  {kpi.change && !kpi.subtext && (
                    <span className="text-emerald-400 font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                      {kpi.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/admin/products/new"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-gold/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">New Product</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Upload template</span>
        </Link>

        <Link
          href="/admin/orders"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-emerald-500/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">Order Invoices</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{stats?.orders.pending || 0} pending</span>
        </Link>

        <Link
          href="/admin/coupons"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-amber-500/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Tag className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">Discounts</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{stats?.content.activeCoupons || 0} active</span>
        </Link>

        <Link
          href="/admin/analytics"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-blue-500/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">Analytics</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Deep charts</span>
        </Link>

        <Link
          href="/admin/reviews"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-yellow-500/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">Reviews</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{stats?.content.reviewsCount || 0} reviews</span>
        </Link>

        <Link
          href="/admin/newsletter"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/30 bg-card/30 hover:bg-card hover:border-violet-500/40 text-center transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">Subscribers</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{stats?.content.subscribers || 0} total</span>
        </Link>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">Revenue Trend</h2>
              <p className="text-xs text-muted-foreground">Monthly sales performance over the past 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                Avg: ₹{(stats?.revenue.avgOrderValue || 0).toLocaleString("en-IN")}/order
              </span>
            </div>
          </div>

          {/* SVG Visual Bar Chart */}
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/30">
            {stats?.revenue.monthly.map((m, idx) => {
              const heightPercent = Math.max(12, Math.round((m.revenue / maxRevenue) * 100));
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-medium px-2 py-1 rounded-lg bg-foreground text-background whitespace-nowrap shadow-md pointer-events-none">
                    ₹{m.revenue.toLocaleString("en-IN")} ({m.orders} orders)
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-indigo-500/20 via-primary to-accent transition-all duration-500 group-hover:scale-y-105 origin-bottom relative shadow-md shadow-primary/20"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-xl" />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div className="text-center p-3 rounded-xl bg-muted/20 border border-border/20">
              <span className="text-[11px] text-muted-foreground block">Total Revenue</span>
              <span className="text-base font-bold text-foreground">
                ₹{(stats?.revenue.total || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/20 border border-border/20">
              <span className="text-[11px] text-muted-foreground block">Paid Invoices</span>
              <span className="text-base font-bold text-emerald-400">
                {stats?.orders.paid || 0}
              </span>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/20 border border-border/20">
              <span className="text-[11px] text-muted-foreground block">Conversion Rate</span>
              <span className="text-base font-bold text-foreground">
                {stats?.orders.total
                  ? `${Math.round(((stats.orders.paid || 0) / stats.orders.total) * 100)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Catalog & System Health Panel */}
        <div className="space-y-6">
          {/* Order Status Distribution */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-foreground">Order Distribution</h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Paid & Delivered
                  </span>
                  <span className="font-semibold">{stats?.orders.paid || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats?.orders.total ? ((stats.orders.paid || 0) / stats.orders.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Pending Payment
                  </span>
                  <span className="font-semibold">{stats?.orders.pending || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats?.orders.total ? ((stats.orders.pending || 0) / stats.orders.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Failed / Cancelled
                  </span>
                  <span className="font-semibold">{stats?.orders.failed || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats?.orders.total ? ((stats.orders.failed || 0) / stats.orders.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Catalog Type Ratio:</span>
              <span className="font-medium text-foreground">
                {stats?.products.templates || 0} Templates / {stats?.products.sourceCode || 0} Code
              </span>
            </div>
          </div>

          {/* System Health Card */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-foreground">System Health</h2>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  Neon PostgreSQL
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-3.5 h-3.5 text-gold" />
                  Cashfree Gateway
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Live</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  NextAuth v5
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground">Latest transactions across all payment methods</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 text-muted-foreground/70">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {(!stats?.orders.recent || stats.orders.recent.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  stats.orders.recent.map((order) => {
                    const statusColor =
                      order.status === "paid"
                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                        : order.status === "pending"
                        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                        : "bg-rose-400/10 text-rose-400 border-rose-400/20";

                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-medium text-foreground">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-foreground truncate max-w-[140px]">
                            {order.user?.name || "Anonymous"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                            {order.user?.email || "No email"}
                          </p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {order.itemsCount} product{order.itemsCount !== 1 ? "s" : ""}
                        </td>
                        <td className="py-3 font-bold text-foreground">
                          ₹{order.total}
                        </td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor} capitalize`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-muted-foreground whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Downloaded Products */}
        <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">Top Products</h2>
              <p className="text-xs text-muted-foreground">Best-selling templates & code</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
            >
              <span>Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!stats?.products.top || stats.products.top.length === 0) ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No products found.
              </p>
            ) : (
              stats.products.top.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border border-border/20 bg-muted/10 hover:bg-muted/30 transition-all group"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-12 h-12 rounded-xl object-cover border border-border/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate group-hover:text-gold transition-colors">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="capitalize">{product.type}</span>
                      <span>·</span>
                      <span className="font-medium text-foreground">₹{product.price}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-foreground block">
                      {product.downloadCount}
                    </span>
                    <span className="text-[10px] text-muted-foreground">downloads</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
