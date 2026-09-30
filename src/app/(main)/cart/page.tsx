"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  LICENSE_TIERS,
  LicenseType,
  calculateLicensePrice,
} from "@/lib/licensing";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Shield,
  RefreshCw,
  Headphones,
  CreditCard,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  license: LicenseType;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    category: string;
    technologies: string[];
    thumbnail: string;
    type: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch {}
  };

  const updateItemLicense = async (id: string, newLicense: LicenseType) => {
    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, license: newLicense } : item))
    );

    try {
      await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license: newLicense }),
      });
    } catch (e) {
      console.error("Failed to update item license", e);
    }
  };

  const getItemPrice = (item: CartItem) => {
    return calculateLicensePrice(item.product.price, item.license || "personal");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item), 0);
  const discount = 0;
  const total = subtotal - discount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase border-primary/30 bg-primary/5 text-primary rounded-full"
            >
              Secure Cart
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} selected · Choose your license tiers below
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-20 rounded-3xl border border-border/30 bg-card/20 p-8">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Explore our premium templates and source code packs to kickstart your next project.
                </p>
                <Link href="/templates">
                  <Button className="rounded-xl px-6">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cart Items (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item, i) => {
                  const price = getItemPrice(item);
                  const tier = LICENSE_TIERS[item.license || "personal"];

                  return (
                    <AnimatedSection key={item.id} animation="fade-up" delay={i * 50}>
                      <div className="p-5 rounded-3xl border border-border/30 bg-card/40 backdrop-blur-xl hover:border-border/60 transition-all flex flex-col sm:flex-row gap-5 items-start">
                        {/* Thumbnail */}
                        <Link
                          href={
                            item.product.type === "source-code"
                              ? `/source-code/${item.product.slug}`
                              : `/templates/${item.product.slug}`
                          }
                          className="shrink-0 w-full sm:w-36 h-28 rounded-2xl overflow-hidden border border-border/40 relative group"
                        >
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Info & License Selector */}
                        <div className="flex-1 min-w-0 w-full space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                href={
                                  item.product.type === "source-code"
                                    ? `/source-code/${item.product.slug}`
                                    : `/templates/${item.product.slug}`
                                }
                                className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.product.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] px-2 py-0">
                                  {item.product.category}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground capitalize">
                                  {item.product.type}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* License Tier Selector */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/20">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                License:
                              </span>
                              <select
                                value={item.license || "personal"}
                                onChange={(e) =>
                                  updateItemLicense(item.id, e.target.value as LicenseType)
                                }
                                className="h-8 px-2.5 rounded-xl border border-border/40 bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="personal">Personal — 1 Site (₹{item.product.price})</option>
                                <option value="commercial">
                                  Commercial — Client (₹{Math.round(item.product.price * 1.6)})
                                </option>
                                <option value="extended">
                                  Extended — Unlimited (₹{Math.round(item.product.price * 3.2)})
                                </option>
                              </select>
                            </div>

                            <div className="text-right">
                              <span className="text-lg font-bold text-foreground block">
                                ₹{price}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {tier.badge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}

                {/* Assurance footer */}
                <div className="p-4 rounded-2xl border border-border/20 bg-muted/20 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-bit Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Instant Digital Downloads</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Official License Keys Included</span>
                  </div>
                </div>
              </div>

              {/* Order Summary (4 cols) */}
              <div className="lg:col-span-4">
                <AnimatedSection animation="fade-up" delay={150}>
                  <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-xl space-y-5 sticky top-24">
                    <h3 className="font-serif text-lg font-bold text-foreground">Summary</h3>

                    <div className="space-y-2.5 text-xs text-muted-foreground">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="truncate mr-2 text-foreground font-medium">
                            {item.product.title}
                          </span>
                          <span className="font-bold text-foreground shrink-0">
                            ₹{getItemPrice(item)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-border/30" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-semibold text-foreground">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Estimated Taxes</span>
                        <span className="text-emerald-400 font-medium">Included</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border/20">
                        <span>Total Due</span>
                        <span className="text-2xl font-extrabold text-foreground">₹{total}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="block w-full">
                      <Button className="w-full rounded-2xl h-12 bg-primary text-primary-fg hover:bg-primary-hover font-bold shadow-xl shadow-primary/20 text-sm">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    <p className="text-[10px] text-muted-foreground text-center">
                      Guest checkout available · No password required
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
