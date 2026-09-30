"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Clock,
  Star,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const userRole = (session.user as any)?.role;
  const isAdmin = userRole === "admin" || userRole === "super_admin";
  const isSuperAdmin = userRole === "super_admin";

  const menuItems = [
    ...(isAdmin
      ? [
          {
            icon: ShieldCheck,
            label: "Admin Portal",
            href: "/admin",
            description: "Catalog, orders, users & analytics",
            color: "from-primary/20 to-indigo-500/20",
            iconColor: "text-primary",
            badge: isSuperAdmin ? "Super Admin" : "Admin",
          },
        ]
      : []),
    {
      icon: Package,
      label: "My Orders",
      href: "/dashboard/orders",
      description: "View your purchase history & license keys",
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/wishlist",
      description: "Your saved products & templates",
      color: "from-rose-500/10 to-pink-500/10",
      iconColor: "text-rose-500",
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      href: "/cart",
      description: "Review pending items",
      color: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
    },
    {
      icon: CreditCard,
      label: "Billing",
      href: "/dashboard/settings",
      description: "Invoices & payment records",
      color: "from-violet-500/10 to-purple-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
      description: "Account profile & security",
      color: "from-slate-500/10 to-gray-500/10",
      iconColor: "text-slate-500",
    },
  ];

  const recentActivity = [
    { action: "Account authenticated", time: "Active now", icon: CheckCircle, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen relative pb-20">
      {/* Atmosphere Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header Profile Section */}
      <section className="pt-28 pb-8 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border/30">
              {/* User Avatar & Info */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-indigo-500/20 text-primary text-2xl font-bold border border-primary/20 shadow-lg shadow-primary/10 overflow-hidden">
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="" width={80} height={80} className="rounded-2xl" />
                    ) : (
                      session.user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-background shadow-sm">
                    {(session.user as any)?.emailVerified ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                      Welcome back, {session.user?.name?.split(" ")[0] || "User"}
                    </h1>
                    {isAdmin && (
                      <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {isSuperAdmin ? "Super Admin" : "Admin"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{session.user?.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {(session.user as any)?.emailVerified ? (
                      <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Email verified
                      </span>
                    ) : (
                      <span className="text-xs text-amber-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> Email not verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {isAdmin && (
                  <Link href="/admin" className="flex-1 sm:flex-initial">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto rounded-xl text-xs h-9 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 gap-1.5 font-bold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Visit Admin Portal
                    </Button>
                  </Link>
                )}
                <Link href="/templates" className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-xl text-xs h-9 border-border/50 hover:bg-card">
                    Browse Catalog
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs h-9 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                  onClick={() => import("next-auth/react").then(({ signOut }) => signOut())}
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-6">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {/* Prominent Admin Access Banner if Administrator */}
          {isAdmin && (
            <AnimatedSection animation="fade-up">
              <div className="mb-8 p-6 rounded-3xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg shadow-primary/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-bold text-foreground font-serif">
                        Administrative Privileges Active
                      </h2>
                      <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary text-white border-0 shadow-sm">
                        {isSuperAdmin ? "Super Admin Access" : "Admin Console"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                      You have full authority to manage store products, source code catalog, orders ledger, promo coupons, customer reviews, newsletter audience, and financial analytics.
                    </p>
                  </div>
                </div>

                <Link href="/admin" className="shrink-0 w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-xl px-5 h-10 text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 gap-1.5">
                    Launch Admin Console
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          )}

          {/* Quick Stats Grid */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "My Orders", value: "0", icon: Package, trend: "Order history" },
                { label: "Wishlist", value: "0", icon: Heart, trend: "Saved items" },
                { label: "Cart", value: "0", icon: ShoppingCart, trend: "Pending checkout" },
                { label: "Account Role", value: isAdmin ? (isSuperAdmin ? "Super" : "Admin") : "User", icon: ShieldCheck, trend: "Access level" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 sm:p-5 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/70 backdrop-blur-xl transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</span>
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-foreground">{stat.value}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">{stat.trend}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Main Grid: Actions & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions List (2 Cols) */}
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-up" delay={200}>
                <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider font-serif">
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {menuItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <div className="group flex items-center gap-4 p-5 rounded-3xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer h-full backdrop-blur-xl">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} ${item.iconColor} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-foreground">{item.label}</p>
                            {(item as any).badge && (
                              <Badge className="text-[9px] px-1.5 py-0.2 bg-primary text-white font-bold border-0">
                                {(item as any).badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Activity & Resources (1 Col) */}
            <div className="lg:col-span-1 space-y-4">
              <AnimatedSection animation="fade-up" delay={300}>
                <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider font-serif">
                  Recent Activity
                </h3>
                <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-5">
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 mt-0.5 shrink-0">
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{activity.action}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/20 text-center">
                    <p className="text-[11px] text-muted-foreground/60">Your recent orders and downloads will appear here.</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Developer / Customer Resource Card */}
              <AnimatedSection animation="fade-up" delay={400}>
                <div className="rounded-3xl border border-primary/25 bg-primary/5 backdrop-blur-xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Need Technical Support?
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Have questions about downloading your template or integrating Cashfree and Neon PostgreSQL?
                  </p>
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                  >
                    Open Support Center
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
