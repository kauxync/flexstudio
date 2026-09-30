"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Star,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  Store,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  exact?: boolean;
  badge?: string;
  badgeVariant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
  superAdminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Catalog & Sales",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { title: "Coupons", href: "/admin/coupons", icon: Tag },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Audience & Growth",
    items: [
      { title: "Subscribers", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Users & Roles", href: "/admin/users", icon: Users, badge: "Super", badgeVariant: "warning", superAdminOnly: true },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const isSuperAdmin = user?.role === "super_admin";

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-card/60 backdrop-blur-2xl border-r border-border/40 transition-all duration-300 select-none ${
        collapsed && !isMobile ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/30">
          <Link
            href="/admin"
            onClick={isMobile ? onCloseMobile : undefined}
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-border/40 bg-card flex items-center justify-center p-1 shadow-md shadow-primary/10 group-hover:scale-105 transition-transform shrink-0">
              <LogoIcon size={36} className="w-full h-full" />
            </div>
            {(!collapsed || isMobile) && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-base tracking-tight truncate leading-none text-foreground">
                  FlexStudio
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-primary mt-1 font-semibold">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {(!collapsed || isMobile) && (
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isLinkActive(item);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onCloseMobile : undefined}
                      title={collapsed && !isMobile ? item.title : undefined}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-gold/15 text-gold border border-gold/30 shadow-sm font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                      } ${collapsed && !isMobile ? "justify-center px-0" : ""}`}
                    >
                      {active && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gold" />
                      )}
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          active ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      {(!collapsed || isMobile) && (
                        <span className="truncate flex-1">{item.title}</span>
                      )}
                      {(!collapsed || isMobile) && item.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-warning/15 text-warning border border-warning/20">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area: View Store & Profile */}
      <div className="p-3 border-t border-border/30 space-y-2 bg-muted/10">
        {/* Live Store Shortcut */}
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors border border-border/20 ${
            collapsed && !isMobile ? "justify-center px-0" : ""
          }`}
          title={collapsed && !isMobile ? "View Live Store" : undefined}
        >
          <Store className="w-4 h-4 text-gold shrink-0" />
          {(!collapsed || isMobile) && (
            <>
              <span className="flex-1 truncate">View Live Store</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
            </>
          )}
        </Link>

        {/* Profile Card */}
        <div
          className={`p-2.5 rounded-xl border border-border/30 bg-card/40 flex items-center gap-2.5 ${
            collapsed && !isMobile ? "justify-center p-2" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold border border-gold/30 font-bold flex items-center justify-center shrink-0 text-xs">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
          </div>

          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold truncate leading-none text-foreground">
                  {user?.name || "Admin"}
                </p>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                  {isSuperAdmin ? "SUPER" : "ADMIN"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {user?.email || "flexstudio@kauxync.in"}
              </p>
            </div>
          )}

          {(!collapsed || isMobile) && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-muted-foreground hover:text-error p-1 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
