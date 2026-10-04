"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { Search, Heart, ShoppingBag, LayoutDashboard, Package, Settings, ShieldCheck, LogOut, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { mounted } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const logoFilter = isDark ? "invert(1) brightness(2)" : "none";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch cart count when logged in
  useEffect(() => {
    if (session) {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          setCartCount((data.items || []).length);
        })
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [session]);

  // Listen for cart updates via custom event
  useEffect(() => {
    const handleStorage = () => {
      if (session) {
        fetch("/api/cart")
          .then((r) => r.json())
          .then((data) => {
            setCartCount((data.items || []).length);
          })
          .catch(() => {});
      }
    };
    window.addEventListener("cart-updated", handleStorage);
    return () => window.removeEventListener("cart-updated", handleStorage);
  }, [session]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    if (userMenuOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Brand Accent Top Glow Line */}
      <div className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />

      {/* Main Header Shell */}
      <header
        className={cn(
          "fixed top-[2px] inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/40 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Brand Logo */}
            <Link href="/" className="relative shrink-0 group flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="FlexStudio"
                className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                style={{ filter: logoFilter }}
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/40 border border-border/40 backdrop-blur-md">
                {siteConfig.nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200",
                        active
                          ? "text-primary bg-card shadow-sm border border-primary/25"
                          : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      {item.label}
                      {item.href === "/pricing" && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/15 text-primary">
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Global Search */}
              <Link
                href="/search"
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Saved Items"
              >
                <Heart className="w-4 h-4" />
              </Link>

              {/* Cart with count badge */}
              <Link
                href="/cart"
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="hidden sm:block w-px h-4 bg-border/40 mx-0.5" />

              {/* Light / Dark Mode Toggle */}
              <ThemeToggle />

              {/* User Session Dropdown or Login CTAs */}
              {session ? (
                <div className="hidden sm:block relative ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-indigo-500/20 text-[11px] font-bold text-primary overflow-hidden border border-primary/20">
                      {session.user?.image ? (
                        <Image src={session.user.image} alt="" width={28} height={28} className="rounded-lg" />
                      ) : (
                        session.user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn("text-muted-foreground/50 transition-transform duration-200", userMenuOpen && "rotate-180")}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      "absolute right-0 top-full mt-2 w-56 py-2 rounded-2xl border border-border/40 bg-card shadow-2xl backdrop-blur-xl transition-all duration-200 origin-top-right z-50",
                      userMenuOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    )}
                  >
                    <div className="px-3.5 py-2 border-b border-border/30 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">{session.user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mx-1.5 rounded-xl"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                      User Dashboard
                    </Link>

                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mx-1.5 rounded-xl"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package className="w-3.5 h-3.5 text-indigo-400" />
                      Orders &amp; Downloads
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mx-1.5 rounded-xl"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-3.5 h-3.5 text-violet-400" />
                      Profile Settings
                    </Link>

                    {["admin", "super_admin"].includes((session.user as any)?.role) && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors mx-1.5 rounded-xl"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Portal
                      </Link>
                    )}

                    <div className="h-px bg-border/30 my-1 mx-2" />

                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors mx-1.5 rounded-xl w-full text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-muted-foreground/80 hover:text-foreground rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-xs font-semibold bg-primary text-white hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors ml-0.5"
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-xl transition-opacity duration-300"
          onClick={closeMobile}
        />
        <div
          className={cn(
            "absolute top-16 lg:top-[68px] inset-x-0 bottom-0 bg-background/98 backdrop-blur-2xl transition-all duration-300 ease-out overflow-hidden border-t border-border/40",
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <div className="h-full overflow-y-auto">
            <div className="max-w-lg mx-auto px-6 py-6 space-y-6">
              {/* User snippet if logged in */}
              {session && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/40 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-indigo-500/20 text-sm font-bold text-primary overflow-hidden border border-primary/20">
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="" width={40} height={40} className="rounded-xl" />
                    ) : (
                      session.user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-2xl transition-colors",
                      isActive(item.href)
                        ? "text-primary bg-primary/10 border border-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.href === "/pricing" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                        New
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Auth / Account Actions */}
              <div className="pt-4 border-t border-border/30 space-y-2">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobile}
                      className="flex items-center px-4 py-3 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-xl transition-colors"
                    >
                      User Dashboard
                    </Link>
                    {["admin", "super_admin"].includes((session.user as any)?.role) && (
                      <Link
                        href="/admin"
                        onClick={closeMobile}
                        className="flex items-center px-4 py-3 text-xs font-semibold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        closeMobile();
                      }}
                      className="flex items-center px-4 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/login" onClick={closeMobile}>
                      <button className="w-full h-11 rounded-xl border border-border/50 text-xs font-semibold hover:bg-muted/50 transition-colors">
                        Log In
                      </button>
                    </Link>
                    <Link href="/register" onClick={closeMobile}>
                      <button className="w-full h-11 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Utility Links */}
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center justify-around text-xs font-medium text-muted-foreground">
                  <Link href="/wishlist" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> Wishlist
                  </Link>
                  <Link href="/cart" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link href="/contact" onClick={closeMobile} className="hover:text-primary transition-colors">
                    Contact Desk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
