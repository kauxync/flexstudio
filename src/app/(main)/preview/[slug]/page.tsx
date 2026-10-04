"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RefreshCw,
  QrCode,
  ShoppingCart,
  X,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Device = "desktop" | "tablet" | "mobile";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  rating: number;
  demoUrl?: string;
  type: string;
}

const deviceWidths: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const demoUrls: Record<string, string> = {
  "dashboard-pro": "https://vercel.com",
  "saas-landing": "https://stripe.com",
  "portfolio-creative": "https://linear.app",
  "ecommerce-starter": "https://shopify.com",
  "blog-minimal": "https://medium.com",
  "agency-template": "https://www.apple.com",
  "react-components": "https://tailwindcss.com",
  "nextjs-starter": "https://nextjs.org",
  "restaurant-template": "https://www.uber.com",
  "vue-admin": "https://vuejs.org",
  "education-platform": "https://www.udemy.com",
  "tailwind-components": "https://tailwindui.com",
  "real-estate": "https://www.zillow.com",
  "healthcare-portal": "https://www.hopkinsmedicine.org",
  "fitness-app": "https://www.nike.com",
  "ai-dashboard": "https://openai.com",
  "nextjs-saas-starter": "https://vercel.com",
  "react-dashboard-admin": "https://demo.admin.com",
  "nextjs-ecommerce-store": "https://stripe.com",
  "nodejs-rest-api": "https://expressjs.com",
  "react-native-mobile-app": "https://expo.dev",
  "nextjs-blog-cms": "https://sanity.io",
  "python-ai-chatbot": "https://openai.com",
  "saas-invoice-system": "https://stripe.com",
  "graphql-api-boilerplate": "https://graphql.org",
  "nextjs-realtime-collab": "https://liveblocks.io",
  "vue3-admin-template": "https://vuejs.org",
  "laravel-api-starter": "https://laravel.com",
};

export default function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => setProduct(data.product))
      .catch(() => {});
  }, [slug]);

  const previewUrl = product?.demoUrl || demoUrls[slug] || "https://example.com";
  const currentPrice = product ? product.price : 0;

  const handleCheckout = () => {
    if (!product) return;
    router.push(`/checkout?productId=${product.id}&price=${currentPrice}`);
  };

  return (
    <div className={cn("h-screen flex flex-col bg-background text-foreground", isFullscreen && "fixed inset-0 z-50")}>
      {/* Sleek Floating Header */}
      <header className="shrink-0 h-16 border-b border-border/40 bg-card/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 gap-3 z-30 shadow-lg">
        {/* Left: Product Info */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={product?.type === "source-code" ? `/source-code/${slug}` : `/templates/${slug}`}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-border/30 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
            title="Back to Product Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[140px] sm:max-w-[220px]">
                {product?.title || "Live Preview"}
              </p>
              {product?.category && (
                <Badge variant="outline" className="hidden md:inline-flex text-[10px] px-2 py-0">
                  {product.category}
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Interactive Live Preview
            </p>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/30 border border-border/30">
          {([
            { id: "desktop" as Device, icon: Monitor, label: "Desktop" },
            { id: "tablet" as Device, icon: Tablet, label: "Tablet" },
            { id: "mobile" as Device, icon: Smartphone, label: "Mobile" },
          ]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all",
                device === id
                  ? "bg-primary text-primary-fg shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: QR Code & Buy Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile QR scan trigger */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/30 bg-muted/30 hover:bg-muted text-xs font-medium text-foreground transition-all"
            title="Scan with phone to test live on mobile"
          >
            <QrCode className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xl:inline text-[11px]">Test on Phone</span>
          </button>

          {/* Direct Buy Button */}
          <Button
            onClick={handleCheckout}
            size="sm"
            className="rounded-xl h-9 px-3.5 text-xs font-bold bg-primary text-primary-fg hover:bg-primary-hover shadow-lg shadow-primary/20"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            <span>Buy {currentPrice > 0 ? `· ₹${currentPrice}` : ""}</span>
          </Button>

          {/* External tab & Fullscreen */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden sm:flex items-center justify-center h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Preview Device Canvas */}
      <div className="flex-1 overflow-hidden bg-muted/15 flex items-center justify-center p-2 sm:p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-7 h-7 text-primary animate-spin" />
              <p className="text-xs font-medium text-muted-foreground">
                Connecting to live template preview...
              </p>
            </div>
          </div>
        )}

        <div
          className={cn(
            "h-full max-w-full transition-all duration-500 ease-out overflow-hidden shadow-2xl relative",
            device === "desktop" && "w-full rounded-2xl border border-border/30",
            device === "tablet" && "w-[768px] rounded-3xl border-4 border-card shadow-2xl ring-1 ring-border/40",
            device === "mobile" && "w-[375px] rounded-[36px] border-8 border-card shadow-2xl ring-1 ring-border/40"
          )}
          style={{ maxWidth: `min(${deviceWidths[device]}, 100%)` }}
        >
          {device === "mobile" && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-28 bg-card rounded-full z-10" />
          )}

          <iframe
            src={previewUrl}
            className="w-full h-full border-0 bg-background"
            title={`Preview: ${product?.title}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>

      {/* QR Code Modal for Phone Preview */}
      {showQrModal && (
        <Modal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          title="Test Live on Your Phone"
        >
          <div className="text-center p-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Scan this QR code with your smartphone camera to preview the live template directly on your mobile device.
            </p>

            <div className="p-4 rounded-2xl bg-white mx-auto w-52 h-52 flex items-center justify-center shadow-lg border border-border/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  previewUrl
                )}`}
                alt="QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p className="text-[11px] font-mono text-muted-foreground break-all px-2">
              {previewUrl}
            </p>

            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setShowQrModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
