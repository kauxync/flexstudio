"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Heart, Star, Download, ShoppingCart, Trash2, Eye, ArrowRight } from "lucide-react";

interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  technologies: string[];
  rating: number;
  downloadCount: number;
  thumbnail: string;
  type: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored =
      localStorage.getItem("flexstudio-wishlist") ||
      localStorage.getItem("flexstudioo-wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    } else {
      fetch("/api/products?type=template&limit=4")
        .then((res) => res.json())
        .then((data) => {
          const items = (data.products || []).slice(0, 4).map((p: any) => ({
            id: p.id, title: p.title, slug: p.slug, price: p.price,
            originalPrice: p.originalPrice, category: p.category,
            technologies: p.technologies, rating: p.rating,
            downloadCount: p.downloadCount, thumbnail: p.thumbnail, type: p.type,
          }));
          setWishlist(items);
        })
        .catch(() => {});
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = wishlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full">
              Wishlist
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground text-lg">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-24 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {wishlist.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-muted-foreground/15 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">Browse templates and save your favorites here</p>
                <Link href="/templates">
                  <Button className="rounded-xl">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {wishlist.map((item, i) => (
                  <AnimatedSection key={item.id} animation="fade-up" delay={i * 60}>
                    <div className="flex gap-4 p-4 rounded-2xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-lg transition-all duration-500">
                      {/* Thumbnail */}
                      <Link href={`/templates/${item.slug}`} className="shrink-0">
                        <div className="relative h-24 w-32 rounded-xl overflow-hidden">
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link href={`/templates/${item.slug}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Badge variant="outline" className="text-[10px] px-2 py-0 mb-2">{item.category}</Badge>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground/60 mb-2">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold fill-gold" />{item.rating}</span>
                          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloadCount.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.technologies.slice(0, 3).map((tech) => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">{tech}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/preview/${item.slug}`}>
                              <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs">
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Preview
                              </Button>
                            </Link>
                            <Button size="sm" className="rounded-lg h-8 text-xs bg-primary text-primary-fg hover:bg-primary-hover">
                              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <AnimatedSection animation="fade-up" delay={200}>
                  <div className="sticky top-24 p-6 rounded-2xl border border-border/30 bg-card/20">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Items ({wishlist.length})</span>
                        <span className="font-medium">₹{totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-success">-₹{wishlist.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price), 0)}</span>
                      </div>
                      <div className="h-px bg-border/30" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">₹{totalPrice}</span>
                      </div>
                    </div>
                    <Link href="/cart">
                      <Button className="w-full rounded-xl h-12 bg-primary text-primary-fg hover:bg-primary-hover font-medium">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add All to Cart
                      </Button>
                    </Link>
                    <Link href="/templates">
                      <Button variant="ghost" className="w-full mt-2 h-10 text-sm">
                        Continue Shopping
                      </Button>
                    </Link>
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
