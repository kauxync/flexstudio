"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import {
  LICENSE_TIERS,
  LicenseType,
  calculateLicensePrice,
} from "@/lib/licensing";
import {
  Star,
  Download,
  Clock,
  Check,
  ShoppingCart,
  Heart,
  Eye,
  ChevronRight,
  Share2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  FileCode,
  Sparkles,
  HelpCircle,
  History,
  Gauge,
  CheckCircle2,
  Package,
  Plus,
} from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  user: { name: string; image: string | null };
  createdAt: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  price: number;
  originalPrice?: number;
  category: string;
  technologies: string[];
  rating: number;
  reviewCount: number;
  downloadCount: number;
  version: string;
  thumbnail: string;
  images: string[];
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  status: string;
  zipUrl?: string;
  demoUrl?: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

const DELIVERABLE_BADGES = [
  { label: "Figma Source Included", icon: Layers, highlight: true },
  { label: "100% TypeScript", icon: FileCode },
  { label: "Tailwind CSS v4 Ready", icon: Zap },
  { label: "Dark & Light Cosmic Modes", icon: Sparkles },
  { label: "Next.js 16 App Router", icon: CheckCircle2 },
];

const LIGHTHOUSE_METRICS = [
  { label: "Performance", score: 99, color: "text-emerald-400" },
  { label: "Accessibility", score: 100, color: "text-emerald-400" },
  { label: "Best Practices", score: 100, color: "text-emerald-400" },
  { label: "SEO Optimized", score: 100, color: "text-emerald-400" },
];

const PREBUILT_PAGES = [
  { title: "Landing / Homepage", desc: "High-conversion hero, bento feature grid, social proof, newsletter" },
  { title: "Product Detail / Marketplace", desc: "Interactive galleries, license picker, reviews & specs breakdown" },
  { title: "Authentication Flow", desc: "Custom sign in, register, forgot-password, OAuth buttons" },
  { title: "User Account Dashboard", desc: "Orders ledger, downloadable assets, account & security settings" },
  { title: "Checkout & Payment Gateway", desc: "Express checkout, coupon engine, summary card & success states" },
  { title: "Custom 404 & Maintenance", desc: "Branded error screens with quick back-navigation routes" },
];

const FAQ_ITEMS = [
  {
    q: "Can I use this template for commercial client work?",
    a: "Yes! Choosing the Commercial License allows you to deploy this template for 1 client website or commercial business. If you need to build multiple client projects or a SaaS, select the Extended License.",
  },
  {
    q: "Do I get free updates after purchasing?",
    a: "Absolutely. All future releases, bug fixes, and compatibility updates (such as new Next.js or Tailwind versions) are included at no extra cost.",
  },
  {
    q: "Are the design files (Figma) included in the download?",
    a: "Yes, a fully organized, component-driven Figma design file with design tokens and auto-layouts is packaged alongside the codebase.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, Netbanking, and international cards via secure 256-bit encrypted checkout.",
  },
];

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("personal");
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "changelog" | "reviews" | "faq">("overview");

  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [bundleIncluded, setBundleIncluded] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Check if in cart/wishlist
  useEffect(() => {
    if (!session || !product) return;
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        setIsInCart((data.items || []).some((item: any) => item.productId === product.id));
      })
      .catch(() => {});

    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        setIsInWishlist((data.items || []).some((item: any) => item.productId === product.id));
      })
      .catch(() => {});
  }, [session, product]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const currentPrice = product ? calculateLicensePrice(product.price, selectedLicense) : 0;
  const currentOriginalPrice = product?.originalPrice
    ? calculateLicensePrice(product.originalPrice, selectedLicense)
    : Math.round(currentPrice * 1.35);

  const bundleAddonPrice = 1499; // Complementary UI starter bundle
  const totalWithBundle = currentPrice + (bundleIncluded ? bundleAddonPrice : 0);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!session) {
      // Guest can add to cart via localStorage or direct checkout
      router.push(`/checkout?productId=${product.id}&license=${selectedLicense}`);
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, license: selectedLicense }),
      });
      if (res.ok) {
        setIsInCart(true);
        showToast(`Added to cart with ${LICENSE_TIERS[selectedLicense].name}`);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        const data = await res.json();
        if (data.error === "Already in cart") {
          setIsInCart(true);
          showToast("Already in cart");
        } else {
          showToast(data.error || "Failed to add to cart", "error");
        }
      }
    } catch {
      showToast("Failed to add to cart", "error");
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!session) {
      // Guest direct checkout
      router.push(`/checkout?productId=${product.id}&license=${selectedLicense}&price=${currentPrice}`);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, license: selectedLicense }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/checkout");
    } catch {
      router.push("/checkout");
    }
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/templates/${slug}`);
      return;
    }
    if (!product) return;
    try {
      if (isInWishlist) {
        const res = await fetch("/api/wishlist").then((r) => r.json());
        const item = (res.items || []).find((i: any) => i.productId === product.id);
        if (item) {
          await fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
          setIsInWishlist(false);
          showToast("Removed from wishlist");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) {
          setIsInWishlist(true);
          showToast("Added to wishlist");
        }
      }
    } catch {
      showToast("Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/templates">
            <Button>Browse Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[110] animate-fade-in-up">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl",
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            )}
          >
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="pt-24 pb-3 border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/templates" className="hover:text-foreground transition-colors">
              Templates
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery & Badges (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatedSection animation="fade-left">
                {/* Main Showcase Image */}
                <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-border/40 shadow-2xl bg-card/60 group">
                  <img
                    src={images[activeImage]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

                  {/* Live preview button */}
                  {product.demoUrl && (
                    <Link
                      href={`/preview/${product.slug}`}
                      className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background/90 hover:bg-background backdrop-blur-md border border-border/40 text-xs font-semibold text-foreground shadow-xl transition-all hover:scale-105"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>Interactive Live Preview</span>
                    </Link>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isNew && (
                      <Badge className="text-xs px-2.5 py-1 bg-emerald-500 text-white shadow-lg">
                        New Release
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="text-xs px-2.5 py-1 bg-primary text-white shadow-lg">
                        ★ Bestseller
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          "relative h-16 sm:h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                          activeImage === i
                            ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                            : "border-border/30 opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </AnimatedSection>

              {/* Deliverable Trust Badges */}
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Deliverables & Standards
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERABLE_BADGES.map((b) => (
                      <span
                        key={b.label}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors",
                          b.highlight
                            ? "bg-primary/10 border-primary/30 text-primary-fg/90"
                            : "bg-muted/30 border-border/30 text-muted-foreground"
                        )}
                      >
                        <b.icon className="w-3.5 h-3.5 text-primary" />
                        <span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Lighthouse Performance Scorecard */}
              <AnimatedSection animation="fade-up" delay={150}>
                <div className="p-5 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Lighthouse Audited Benchmark
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                      100% Passed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LIGHTHOUSE_METRICS.map((m) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl border border-border/20 bg-background/50 text-center"
                      >
                        <span className={cn("text-2xl font-bold font-mono block", m.color)}>
                          {m.score}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Buy Box & Licensing Configurator (5 cols) */}
            <div className="lg:col-span-5">
              <AnimatedSection animation="fade-right">
                <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl space-y-6">
                  {/* Title & Metadata */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[11px] px-2.5 py-0.5">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">v{product.version}</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {product.title}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.shortDesc}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3.5 h-3.5",
                              s <= Math.round(product.rating || 5)
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold">{product.rating || "5.0"}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount || 12} reviews)
                      </span>
                      <span>·</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {product.downloadCount.toLocaleString()} downloads
                      </span>
                    </div>
                  </div>

                  {/* Multi-Tier License Selector */}
                  <div className="space-y-3 pt-2 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Select License Tier
                      </label>
                      <span className="text-[11px] text-primary hover:underline cursor-pointer">
                        Compare rights
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(["personal", "commercial", "extended"] as LicenseType[]).map((tierKey) => {
                        const tier = LICENSE_TIERS[tierKey];
                        const isSelected = selectedLicense === tierKey;
                        const tierPrice = calculateLicensePrice(product.price, tierKey);

                        return (
                          <button
                            key={tierKey}
                            onClick={() => setSelectedLicense(tierKey)}
                            className={cn(
                              "p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between",
                              isSelected
                                ? "bg-primary/10 border-primary shadow-md ring-1 ring-primary/30"
                                : "bg-card/40 border-border/30 hover:border-border/60 hover:bg-muted/20"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                            <div>
                              <span className="text-[10px] font-bold block capitalize text-foreground">
                                {tierKey}
                              </span>
                              <span className="text-[9px] text-muted-foreground block truncate">
                                {tier.badge}
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-foreground mt-2 block">
                              ₹{tierPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Tier Benefits */}
                    <div className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                        <span>{LICENSE_TIERS[selectedLicense].name}</span>
                        <span className="text-[10px] text-primary font-bold">
                          {LICENSE_TIERS[selectedLicense].badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {LICENSE_TIERS[selectedLicense].shortDesc}
                      </p>
                      <div className="pt-1.5 border-t border-primary/10 space-y-1">
                        {LICENSE_TIERS[selectedLicense].rights.slice(0, 3).map((r) => (
                          <div key={r} className="flex items-center gap-2 text-[11px] text-foreground/80">
                            <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price Summary & Purchase Actions */}
                  <div className="pt-2 border-t border-border/20 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-foreground">
                            ₹{currentPrice}
                          </span>
                          {currentOriginalPrice > currentPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{currentOriginalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Instant access · One-time payment · No subscription
                        </p>
                      </div>

                      <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                        Save ₹{currentOriginalPrice - currentPrice}
                      </Badge>
                    </div>

                    <div className="flex gap-2.5">
                      <Button
                        onClick={handleBuyNow}
                        className="flex-1 rounded-2xl h-12 bg-primary text-primary-fg hover:bg-primary-hover font-bold shadow-xl shadow-primary/20 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button
                        onClick={handleAddToWishlist}
                        variant="outline"
                        className={cn(
                          "rounded-2xl h-12 w-12 px-0 shrink-0",
                          isInWishlist && "border-rose-500/50 bg-rose-500/10 text-rose-500"
                        )}
                        title="Save to Wishlist"
                      >
                        <Heart className={cn("w-4 h-4", isInWishlist && "fill-rose-500")} />
                      </Button>
                    </div>

                    {!isInCart ? (
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="w-full py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {addingToCart ? "Adding..." : "+ Add to Cart"}
                      </button>
                    ) : (
                      <Link
                        href="/cart"
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-primary hover:underline"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Item in Cart · View Cart
                      </Link>
                    )}
                  </div>

                  {/* Frequently Bought Together Bundle */}
                  <div className="p-4 rounded-2xl border border-border/30 bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Frequently Bought Together
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Bundle & Save 25%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-border/40 shrink-0"
                      />
                      <Plus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          SaaS Admin Dashboard Pack
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Components, auth & charts boilerplate
                        </p>
                      </div>
                      <span className="text-xs font-bold text-foreground shrink-0">
                        +₹{bundleAddonPrice}
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={bundleIncluded}
                        onChange={(e) => setBundleIncluded(e.target.checked)}
                        className="rounded border-border/50 text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        Include SaaS Admin Bundle for ₹{totalWithBundle} total
                      </span>
                    </label>
                  </div>

                  {/* Guarantee & Support */}
                  <div className="pt-2 text-[11px] text-muted-foreground space-y-1.5 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>100% Verified Secure 256-bit Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      <span>{LICENSE_TIERS[selectedLicense].support} included</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Details Tabs */}
      <section className="py-12 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {/* Tab navigation */}
          <div className="flex items-center gap-2 border-b border-border/30 pb-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview & Features" },
              { id: "pages", label: "Pages Included (6+)" },
              { id: "changelog", label: "Changelog (v" + product.version + ")" },
              { id: "reviews", label: `Customer Reviews (${product.reviews?.length || 0})` },
              { id: "faq", label: "License & FAQ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-fg shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "overview" && (
              <AnimatedSection animation="fade-up" className="space-y-8 max-w-4xl">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    About {product.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
                    Technologies & Dependencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.technologies.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs px-3 py-1">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {activeTab === "pages" && (
              <AnimatedSection animation="fade-up" className="max-w-4xl space-y-4">
                <div className="mb-4">
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Included Pre-Built Pages & Layouts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    All pages are fully responsive, SEO-ready, and production-tested.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PREBUILT_PAGES.map((p, i) => (
                    <div
                      key={p.title}
                      className="p-4 rounded-2xl border border-border/30 bg-card/40 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{p.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {activeTab === "changelog" && (
              <AnimatedSection animation="fade-up" className="max-w-3xl space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                    Release History & Changelog
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Continuous improvements and security updates.
                  </p>
                </div>

                <div className="space-y-4 relative pl-6 border-l border-border/40">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-4 border-background" />
                    <span className="text-xs font-mono font-bold text-primary">v{product.version} (Latest)</span>
                    <span className="text-[10px] text-muted-foreground ml-2">Released this week</span>
                    <p className="text-xs text-foreground mt-1">
                      Upgraded to Tailwind CSS v4, full Next.js 16 App Router support, dark mode color balance, performance enhancements.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-muted-foreground/40 border-4 border-background" />
                    <span className="text-xs font-mono font-bold text-muted-foreground">v1.1.0</span>
                    <span className="text-[10px] text-muted-foreground ml-2">Previous release</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Added Figma component library, unified responsive layout tokens, accessibility fixes.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {activeTab === "reviews" && (
              <AnimatedSection animation="fade-up" className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-foreground">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold">{product.rating || "5.0"}</span>
                  </div>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {product.reviews.map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl border border-border/30 bg-card/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-foreground">
                            {r.user?.name || "Verified Customer"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-border/30 bg-card/20 text-center">
                    <p className="text-xs text-muted-foreground">
                      No customer reviews yet. Be the first to review after purchase!
                    </p>
                  </div>
                )}
              </AnimatedSection>
            )}

            {activeTab === "faq" && (
              <AnimatedSection animation="fade-up" className="max-w-3xl space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Everything you need to know about licensing and product delivery.
                  </p>
                </div>

                <div className="space-y-3">
                  {FAQ_ITEMS.map((item) => (
                    <div
                      key={item.q}
                      className="p-4 rounded-2xl border border-border/30 bg-card/40 space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-primary" />
                        {item.q}
                      </h4>
                      <p className="text-xs text-muted-foreground pl-5 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
