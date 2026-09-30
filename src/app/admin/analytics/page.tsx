"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6m");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-card/60 rounded-3xl border border-border/30" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card/60 rounded-2xl border border-border/30" />
          ))}
        </div>
        <div className="h-80 bg-card/60 rounded-3xl border border-border/30" />
      </div>
    );
  }

  const revenue = stats?.revenue?.total || 0;
  const paidOrders = stats?.orders?.paid || 0;
  const avgOrder = stats?.revenue?.avgOrderValue || 0;
  const totalDownloads = stats?.products?.top?.reduce((acc: number, p: any) => acc + (p.downloadCount || 0), 0) || 0;

  const monthly = stats?.revenue?.monthly || [];
  const maxMonthly = Math.max(...monthly.map((m: any) => m.revenue), 1000);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
              Intelligence
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Granular breakdown of revenue, product conversions, order volume, and catalog trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["30d", "6m", "1y", "All"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === t
                  ? "bg-gold text-primary-fg shadow-sm"
                  : "bg-card/60 border border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Total Realized Revenue</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-bold text-foreground">₹{revenue.toLocaleString("en-IN")}</div>
          <span className="text-[11px] text-emerald-400 font-medium">100% verified settlement</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Average Order Value (AOV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">₹{avgOrder.toLocaleString("en-IN")}</div>
          <span className="text-[11px] text-muted-foreground">Across {paidOrders} completed orders</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Product Downloads Delivered</span>
            <Download className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalDownloads}</div>
          <span className="text-[11px] text-muted-foreground">Digital zip deliveries</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Catalog Count</span>
            <Package className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.products?.total || 0}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {stats?.products?.templates || 0} templates, {stats?.products?.sourceCode || 0} source code
          </span>
        </div>
      </div>

      {/* Visual Revenue Graph */}
      <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">Revenue Trajectory</h2>
            <p className="text-xs text-muted-foreground">Monthly cash volume over time</p>
          </div>
          <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
            INR (₹) Currency
          </span>
        </div>

        <div className="h-64 flex items-end gap-4 sm:gap-8 pt-8 pb-2 px-4 border-b border-border/30">
          {monthly.map((m: any) => {
            const pct = Math.max(15, Math.round((m.revenue / maxMonthly) * 100));
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono px-2 py-1 rounded bg-foreground text-background shadow-lg whitespace-nowrap">
                  ₹{m.revenue.toLocaleString("en-IN")} · {m.orders} sales
                </div>
                <div
                  className="w-full max-w-[54px] rounded-t-xl bg-gradient-to-t from-indigo-500/20 via-primary to-accent transition-all duration-300 group-hover:scale-y-105 origin-bottom relative shadow-md shadow-primary/20"
                  style={{ height: `${pct}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-xl" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/20 text-center">
            <span className="text-xs text-muted-foreground block">Peak Month</span>
            <span className="text-sm font-bold text-foreground">
              {monthly.length > 0
                ? monthly.reduce((max: any, cur: any) => (cur.revenue > max.revenue ? cur : max), monthly[0])?.month
                : "N/A"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/20 text-center">
            <span className="text-xs text-muted-foreground block">Total Customer Base</span>
            <span className="text-sm font-bold text-foreground">{stats?.users?.total || 0} registered</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/20 text-center">
            <span className="text-xs text-muted-foreground block">Coupon Impact</span>
            <span className="text-sm font-bold text-amber-400">
              {stats?.content?.activeCoupons || 0} active promotion{stats?.content?.activeCoupons !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Product Category Breakdown Table */}
      <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Top Performing Products</h2>
        <p className="text-xs text-muted-foreground">Digital assets ranked by customer downloads and revenue contribution</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground/70">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Unit Price</th>
                <th className="pb-3 font-semibold">Downloads</th>
                <th className="pb-3 font-semibold text-right">Estimated Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {stats?.products?.top?.map((p: any) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-border/30" />
                      <div>
                        <span className="font-semibold text-foreground block truncate max-w-[200px]">{p.title}</span>
                        <span className="text-[10px] text-muted-foreground">⭐ {p.rating} ({p.reviewCount || 0})</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-muted-foreground">{p.type}</td>
                  <td className="py-3 text-muted-foreground">{p.category}</td>
                  <td className="py-3 font-semibold text-foreground">₹{p.price}</td>
                  <td className="py-3 font-bold text-foreground">{p.downloadCount}</td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    ₹{(p.price * p.downloadCount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
