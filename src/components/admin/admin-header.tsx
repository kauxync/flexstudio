"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Store,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  User,
  ChevronRight,
  ChevronDown,
  LogOut,
  ExternalLink,
  Tag,
  Package,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "order" | "user" | "system";
  read: boolean;
}

export function AdminHeader({
  onOpenMobileSidebar,
  onOpenCommandPalette,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const isSuperAdmin = user?.role === "super_admin";

  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", title: "New Order Completed", desc: "Order #FS-8491 paid successfully (₹2,499)", time: "5m ago", type: "order", read: false },
    { id: "2", title: "New Customer Registered", desc: "dev.sarah@example.com created an account", time: "1h ago", type: "user", read: false },
    { id: "3", title: "System Health Alert", desc: "Automated database backup completed successfully", time: "3h ago", type: "system", read: true },
  ]);

  const createMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Generate breadcrumb items
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const url = "/" + pathParts.slice(0, index + 1).join("/");
    const label =
      part === "admin"
        ? "Console"
        : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    const isLast = index === pathParts.length - 1;
    return { url, label, isLast };
  });

  return (
    <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border/40 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Mobile hamburger, logo icon & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Header Brand with Logo Icon */}
        <Link href="/admin" className="lg:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-border/40 bg-card p-0.5 flex items-center justify-center shrink-0 shadow-sm">
            <LogoIcon size={26} className="w-full h-full" />
          </div>
          <span className="hidden sm:inline font-serif font-bold text-sm text-foreground">FlexStudio</span>
        </Link>

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 truncate">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.url} className="flex items-center gap-1.5 truncate">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />}
              {crumb.isLast ? (
                <span className="font-semibold text-foreground truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.url}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          aria-label="Search"
          className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 text-xs text-muted-foreground bg-muted/40 hover:bg-muted/70 border border-border/40 rounded-xl transition-all w-9 sm:w-40 lg:w-56 shrink-0"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
          <span className="hidden sm:block truncate flex-1 text-left">Search or press</span>
          <kbd className="hidden lg:inline-block font-mono text-[10px] text-muted-foreground/80 px-1.5 py-0.5 rounded border border-border/40 bg-background/80">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative shrink-0" ref={createMenuRef}>
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            aria-label="Create new"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className={`hidden sm:block w-3 h-3 transition-transform ${createMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {createMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-2xl shadow-2xl p-1.5 z-50 animate-scale-in">
              <Link
                href="/admin/products/new"
                onClick={() => setCreateMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted/50 text-foreground transition-colors"
              >
                <Package className="w-4 h-4 text-primary" />
                <span>New Product</span>
              </Link>
              <Link
                href="/admin/coupons"
                onClick={() => setCreateMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted/50 text-foreground transition-colors"
              >
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>New Coupon</span>
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-primary-fg font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-border/40 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-muted/20">
                <span className="text-xs font-bold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-gold hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border/20">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs transition-colors ${
                      n.read ? "bg-transparent text-muted-foreground" : "bg-gold/5 text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          n.type === "order"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : n.type === "user"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-gold/10 text-gold"
                        }`}
                      >
                        {n.type === "order" ? (
                          <ShoppingBag className="w-3 h-3" />
                        ) : n.type === "user" ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {n.desc}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 block mt-1">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-border/20 text-center bg-muted/10">
                <Link
                  href="/admin/orders"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-muted-foreground hover:text-gold transition-colors font-medium"
                >
                  View all order activities →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Live Store Button (desktop) */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-gold" />
          <span>Store</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle className="h-9 w-9 rounded-xl border border-border/40" />

        {/* Admin Profile Dropdown */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary font-bold flex items-center justify-center text-xs border border-primary/30">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-scale-in space-y-1">
              <div className="px-3 py-2 border-b border-border/20">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-primary/15 text-primary border border-primary/30 shrink-0 font-bold">
                    {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Customer Dashboard</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Console Settings</span>
              </Link>

              <div className="pt-1 border-t border-border/20">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-error hover:bg-error/10 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
