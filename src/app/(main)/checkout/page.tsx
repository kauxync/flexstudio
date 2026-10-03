"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Shield,
  Lock,
  ShoppingCart,
  ChevronRight,
  Loader2,
  CreditCard,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useActivity } from "@/hooks/use-activity";

interface CheckoutCartItem {
  id: string;
  price: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    thumbnail: string;
    type: string;
    category: string;
  };
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { log } = useActivity();

  const directProductId = searchParams.get("productId");

  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Guest details state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Coupon state
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  const cashfreeRef = useRef<any>(null);

  // Load items: either direct buy or from /api/cart
  useEffect(() => {
    if (directProductId) {
      // Direct single-product checkout
      fetch(`/api/products/${directProductId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setCartItems([
              {
                id: `direct-${p.id}`,
                price: p.price,
                product: p,
              },
            ]);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === "authenticated") {
      // Authenticated cart checkout
      fetch("/api/cart")
        .then((r) => r.json())
        .then((d) => {
          const items: CheckoutCartItem[] = (d.items || [])
            .filter((item: any) => item && item.product)
            .map((item: any) => ({
              id: item.id,
              price: item.product?.price || 0,
              product: item.product,
            }));
          setCartItems(items);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      fetch("/api/users/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.user?.phone) setPhone(d.user.phone);
        })
        .catch(() => {});
    } else if (status === "unauthenticated") {
      // Unauthenticated without directProductId: check if any items in cart
      setLoading(false);
    }
  }, [directProductId, status]);

  // Load Cashfree SDK
  useEffect(() => {
    if (window.Cashfree) {
      cashfreeRef.current = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox",
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      cashfreeRef.current = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox",
      });
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = couponData
    ? couponData.discountType === "percentage"
      ? Math.min(Math.round((subtotal * couponData.discountValue) / 100), couponData.maxDiscount || Infinity)
      : Math.min(couponData.discountValue, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponError("");
    setCouponData(null);
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(coupon.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon code");
        return;
      }
      if (subtotal < data.coupon.minOrder) {
        setCouponError(`Minimum order amount of ₹${data.coupon.minOrder} required`);
        return;
      }
      setCouponData(data.coupon);
      setCouponApplied(true);
    } catch {
      setCouponError("Failed to validate coupon");
    }
  };

  const handleCheckout = async () => {
    // Validate contact info
    const customerEmail = session?.user?.email || guestEmail.trim();
    const customerName = session?.user?.name || guestName.trim() || customerEmail.split("@")[0];

    if (!customerEmail || !customerEmail.includes("@")) {
      alert("Please provide a valid email address to receive your order downloads.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number for transaction verification.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.product.id,
            price: i.price,
          })),
          coupon: couponApplied ? couponData?.code : null,
          phone: phone.trim(),
          customerName,
          customerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Order creation failed");
        setProcessing(false);
        return;
      }

      log("checkout_initiated", { orderId: data.orderId, total, items: cartItems.length });

      if (!cashfreeRef.current) {
        alert("Payment gateway is initializing. Please try clicking pay again.");
        setProcessing(false);
        return;
      }

      // Launch Cashfree checkout
      cashfreeRef.current.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (e: any) {
      console.error(e);
      alert("Order checkout encountered an error. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-24 pb-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-6">
              <Link href="/cart" className="hover:text-foreground transition-colors">
                Cart
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Secure Checkout</span>
            </nav>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1">Checkout</h1>
            <p className="text-muted-foreground text-sm">
              Instant digital delivery · Choose your preferred payment method
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-20 rounded-3xl border border-border/30 bg-card/20 p-8">
                <ShoppingCart className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="text-lg font-bold mb-2">No items selected for checkout</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Browse our catalog to select your digital template or source code.
                </p>
                <Link href="/templates">
                  <Button className="rounded-xl">Browse Catalog</Button>
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Customer Details & Order Items (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Guest / Authenticated Customer Card */}
                <AnimatedSection animation="fade-up">
                  <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Buyer Information
                      </h2>
                      {session?.user ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                          Logged in as {session.user.name?.split(" ")[0] || "User"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          Guest Checkout Mode
                        </Badge>
                      )}
                    </div>

                    {!session?.user ? (
                      <div className="space-y-3 pt-1">
                        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            No password required! We will email your download link instantly after payment.
                          </span>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                              type="text"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="e.g. Alex Morgan"
                              className="w-full h-11 pl-10 pr-3 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="alex@company.com"
                              className="w-full h-11 pl-10 pr-3 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-muted/20 border border-border/20 text-xs space-y-1">
                        <p className="font-semibold text-foreground">{session.user.name}</p>
                        <p className="text-muted-foreground">{session.user.email}</p>
                      </div>
                    )}

                    {/* Phone Number Field */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        Mobile Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className="w-full h-11 pl-10 pr-3 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Required by payment gateways for OTP and UPI notifications.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Selected Items */}
                <AnimatedSection animation="fade-up" delay={50}>
                  <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Order Items ({cartItems.length})
                    </h2>
                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3.5 rounded-2xl border border-border/30 bg-card/40"
                          >
                            <img
                              src={item.product?.thumbnail || "/placeholder.png"}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover border border-border/30 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                                {item.product?.title || "Template Package"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary capitalize">
                                  {item.product?.category || "Digital Product"}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground capitalize">
                                  {item.product?.type}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-foreground shrink-0">
                              ₹{item.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Column: Order Total & Payment Button (5 cols) */}
              <div className="lg:col-span-5">
                <AnimatedSection animation="fade-up" delay={100}>
                  <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-xl space-y-5 sticky top-24">
                    <h3 className="font-serif text-lg font-bold text-foreground">Order Total</h3>

                    {/* Coupon Engine */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground block">
                        Promotional Coupon
                      </label>
                      {couponApplied ? (
                        <div className="flex items-center justify-between h-10 px-3 text-xs bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <span className="text-emerald-400 font-bold">
                            {couponData?.code} — {couponData?.discountType === "percentage" ? `${couponData.discountValue}% OFF` : `₹${couponData.discountValue} OFF`}
                          </span>
                          <button
                            onClick={() => {
                              setCouponApplied(false);
                              setCouponData(null);
                              setCoupon("");
                            }}
                            className="text-[11px] text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={coupon}
                            onChange={(e) => {
                              setCoupon(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                            placeholder="e.g. WELCOME10"
                            className="flex-1 h-10 px-3 text-xs bg-background border border-border/40 rounded-xl uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={applyCoupon}
                            disabled={!coupon.trim()}
                            className="rounded-xl h-10 text-xs px-3"
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                      {couponError && (
                        <p className="text-[11px] text-red-400">{couponError}</p>
                      )}
                    </div>

                    <div className="h-px bg-border/20" />

                    {/* Breakdown */}
                    <div className="space-y-2.5 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold text-foreground">₹{subtotal}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount Applied</span>
                          <span className="font-bold">-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxes & Processing</span>
                        <span className="text-emerald-400">₹0 (Included)</span>
                      </div>
                      <div className="h-px bg-border/20" />
                      <div className="flex justify-between text-base font-bold text-foreground pt-1">
                        <span>Total Payable</span>
                        <span className="text-2xl font-extrabold text-foreground">₹{total}</span>
                      </div>
                    </div>

                    {/* Gateway Badge */}
                    <div className="p-3.5 rounded-2xl border border-border/20 bg-muted/20 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">Cashfree Hosted Checkout</p>
                        <p className="text-[10px] text-muted-foreground">UPI · Cards · Netbanking</p>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="w-full rounded-2xl h-13 bg-primary text-primary-fg hover:bg-primary-hover font-bold shadow-xl shadow-primary/20 text-sm transition-all"
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Securing Order...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Pay ₹{total}
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60 pt-1">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Instant Delivery
                      </span>
                    </div>
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
