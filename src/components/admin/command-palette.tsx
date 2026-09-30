"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/ui/logo-icon";
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
  PlusCircle,
  ExternalLink,
  Search,
  X,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Action" | "External";
  href: string;
  icon: any;
  keywords?: string[];
  external?: boolean;
}

const COMMANDS: CommandItem[] = [
  { id: "dash", title: "Dashboard Overview", category: "Navigation", href: "/admin", icon: LayoutDashboard, keywords: ["home", "stats", "overview"] },
  { id: "analytics", title: "Analytics & Performance", category: "Navigation", href: "/admin/analytics", icon: BarChart3, keywords: ["charts", "revenue", "sales"] },
  { id: "products", title: "Manage Products", category: "Navigation", href: "/admin/products", icon: Package, keywords: ["templates", "code", "items"] },
  { id: "orders", title: "Orders & Sales", category: "Navigation", href: "/admin/orders", icon: ShoppingBag, keywords: ["sales", "invoices", "payments"] },
  { id: "coupons", title: "Discount Coupons", category: "Navigation", href: "/admin/coupons", icon: Tag, keywords: ["promotions", "discounts", "codes"] },
  { id: "reviews", title: "Product Reviews", category: "Navigation", href: "/admin/reviews", icon: Star, keywords: ["ratings", "feedback"] },
  { id: "newsletter", title: "Newsletter Subscribers", category: "Navigation", href: "/admin/newsletter", icon: Mail, keywords: ["email", "audience", "subscribers"] },
  { id: "users", title: "Users & Permissions", category: "Navigation", href: "/admin/users", icon: Users, keywords: ["customers", "roles", "super admin"] },
  { id: "settings", title: "System Settings", category: "Navigation", href: "/admin/settings", icon: Settings, keywords: ["configuration", "gateway", "store"] },
  // Quick Actions
  { id: "new-product", title: "Create New Product", category: "Quick Action", href: "/admin/products/new", icon: PlusCircle, keywords: ["add", "upload"] },
  // External
  { id: "store", title: "View Live Marketplace", category: "External", href: "/", icon: ExternalLink, external: true, keywords: ["shop", "storefront", "customer"] },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.external) {
      window.open(item.href, "_blank");
    } else {
      router.push(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border border-border/40 bg-card/95 shadow-2xl overflow-hidden backdrop-blur-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30 bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to page... (ESC to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded border border-border/40 bg-muted/40">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${
                    isSelected
                      ? "bg-gold/15 text-foreground border border-gold/30"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-gold text-primary-fg"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium leading-none text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.external ? (
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50" />
                    ) : (
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? "translate-x-0.5 text-gold" : "text-muted-foreground/30"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/20 text-[11px] text-muted-foreground/60 bg-muted/10">
          <div className="flex items-center gap-1.5">
            <LogoIcon size={14} className="w-3.5 h-3.5" alt="" />
            <span>FlexStudio Admin Console</span>
          </div>
        </div>
      </div>
    </div>
  );
}
