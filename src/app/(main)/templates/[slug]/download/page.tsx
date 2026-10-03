"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle,
  Lock,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  FileCode,
  Zap,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  technologies: string[];
  version: string;
  thumbnail: string;
  zipUrl?: string;
  demoUrl?: string;
}

export default function DownloadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/templates/${slug}/download`);
      return;
    }

    if (status === "authenticated") {
      // Fetch product
      fetch(`/api/products/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          setProduct(data.product);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      // Check if user has purchased
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          const orders = data.orders || [];
          for (const order of orders) {
            if (order.status === "paid") {
              const matchedItem = (order.items || []).find(
                (item: any) => item.product?.slug === slug
              );
              if (matchedItem) {
                setHasPurchased(true);
                break;
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [status, slug, router]);

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  if (status === "loading" || loading) {
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
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const quickstartScript = `npm install\ncp .env.example .env\nnpm run dev`;

  return (
    <div className="min-h-screen pb-24">
      <section className="pt-24 pb-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/templates/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Product Details
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Header Showcase */}
              <div className="relative h-44 sm:h-56 overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-6 left-6 sm:left-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    {hasPurchased ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Ownership Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-2.5 py-0.5">
                        <Lock className="w-3.5 h-3.5 mr-1" /> Purchase Required
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">v{product.version}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {product.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Downloads Action Box */}
                <div className="p-6 rounded-2xl border border-border/30 bg-muted/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary" />
                      Production Files & Source Bundle
                    </h3>
                    <span className="text-xs text-muted-foreground">Clean, documented source</span>
                  </div>

                  {hasPurchased ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.zipUrl ? (
                        <a
                          href={product.zipUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-2xl border border-primary/30 bg-card hover:bg-card/80 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <Download className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">Download Archive</p>
                              <p className="text-[10px] text-muted-foreground">ZIP Archive · Full Codebase</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </a>
                      ) : (
                        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 text-xs text-muted-foreground">
                          Direct archive download configured via cloud storage.
                        </div>
                      )}

                      {product.demoUrl && (
                        <a
                          href={product.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-2xl border border-border/30 bg-card hover:bg-card/80 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                              <Zap className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">Live Staging Preview</p>
                              <p className="text-[10px] text-muted-foreground">Hosted Demo Instance</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        You have not purchased this template yet. Complete checkout to unlock instant downloads.
                      </p>
                      <Link href={`/templates/${slug}`}>
                        <Button className="rounded-xl text-xs font-bold px-5">
                          Purchase for ₹{product.price}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quickstart Setup Commands */}
                {hasPurchased && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        Developer Quickstart Guide
                      </h3>
                      <button
                        onClick={() => handleCopyCmd(quickstartScript)}
                        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd ? "Copied" : "Copy commands"}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090714] border border-border/40 font-mono text-xs text-violet-200 overflow-x-auto space-y-1">
                      <p className="text-muted-foreground"># 1. Install dependencies</p>
                      <p className="text-emerald-400">npm install</p>
                      <p className="text-muted-foreground pt-1"># 2. Configure environment</p>
                      <p className="text-emerald-400">cp .env.example .env</p>
                      <p className="text-muted-foreground pt-1"># 3. Launch local development server</p>
                      <p className="text-emerald-400">npm run dev</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
