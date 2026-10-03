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
  Star,
  Download,
  Check,
  ShoppingCart,
  Heart,
  Eye,
  ChevronRight,
  ShieldCheck,
  Zap,
  FileCode,
  Sparkles,
  HelpCircle,
  Gauge,
  CheckCircle2,
  Terminal,
  Database,
  Lock,
} from "lucide-react";

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
  createdAt: string;
}

const DELIVERABLES = [
  { label: "Full Clean Source Code", icon: FileCode, highlight: true },
  { label: "100% Typed TypeScript", icon: Zap },
  { label: "Prisma & Database Schema", icon: Database },
  { label: "NextAuth / JWT Auth Pre-configured", icon: Lock },
  { label: "Docker & Deployment Scripts", icon: Terminal },
];

export default function SourceCodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "faq">("overview");

  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
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

  const currentPrice = product ? product.price : 0;
  const currentOriginalPrice = product?.originalPrice
    ? product.originalPrice
    : Math.round(currentPrice * 1.35);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!session) {
      router.push(`/checkout?productId=${product.id}`);
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        setIsInCart(true);
        showToast("Added to cart!");
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch {
      showToast("Failed to add to cart", "error");
    }
    setAddingToCart(false);
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?productId=${product.id}&price=${currentPrice}`);
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
          <Link href="/source-code">
            <Button>Browse Source Code</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/source-code" className="hover:text-foreground transition-colors">
              Source Code
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-8 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Col (7) */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatedSection animation="fade-left">
                <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-border/40 shadow-2xl bg-card/60 group">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

                  {product.demoUrl && (
                    <Link
                      href={`/preview/${product.slug}`}
                      className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background/90 hover:bg-background backdrop-blur-md border border-border/40 text-xs font-semibold text-foreground shadow-xl transition-all hover:scale-105"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>Live Preview</span>
                    </Link>
                  )}
                </div>
              </AnimatedSection>

              {/* Architecture & Deliverables */}
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="p-5 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Codebase Standards & Deliverables
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERABLES.map((d) => (
                      <span
                        key={d.label}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border",
                          d.highlight
                            ? "bg-primary/10 border-primary/30 text-primary-fg"
                            : "bg-muted/30 border-border/30 text-muted-foreground"
                        )}
                      >
                        <d.icon className="w-3.5 h-3.5 text-primary" />
                        <span>{d.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Col - Buy Box (5) */}
            <div className="lg:col-span-5">
              <AnimatedSection animation="fade-right">
                <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl space-y-6">
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
                  </div>

                  {/* Price & Buy Now */}
                  <div className="pt-2 border-t border-border/20 space-y-3">
                    <div className="flex items-baseline justify-between">
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
                        Buy Codebase
                      </Button>
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="rounded-2xl h-12 w-12 px-0 shrink-0"
                        title="Add to Cart"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center">
                      Instant Git / ZIP download · Complete ownership · Free updates
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
