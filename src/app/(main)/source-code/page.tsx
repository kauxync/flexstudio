"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Newsletter } from "@/components/sections/newsletter";
import { cn } from "@/lib/utils";
import { Clock, Star, Download, Search, ArrowRight, TrendingUp, Eye, Layout } from "lucide-react";

interface SourceCodeProduct {
  id: string;
  slug: string;
  title: string;
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
  isNew: boolean;
  isBestseller: boolean;
}

function ProductCard({ product }: { product: SourceCodeProduct }) {
  return (
    <AnimatedSection animation="fade-up">
      <Link href={`/source-code/${product.slug}`} className="group block h-full">
        <article className="relative h-full rounded-2xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-xl hover:shadow-gold/5 transition-all duration-700 overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = "/preview/" + product.slug; }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border/30 text-sm font-medium shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-4 h-4" /> Live Preview
              </button>
            </div>
            <div className="absolute top-3 left-3 flex gap-1.5">
              {product.isNew && <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white">New</Badge>}
              {product.isBestseller && <Badge className="text-[10px] px-2 py-0.5 bg-gold text-[#1a1a1a]">Bestseller</Badge>}
              {product.originalPrice && <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-background/80 backdrop-blur-sm">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
            </div>
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/30">
                {product.originalPrice && <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>}
                <span className="text-sm font-bold">₹{product.price}</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 mb-2.5">{product.category}</Badge>
            <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{product.shortDesc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.technologies.slice(0, 4).map((tech) => <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">{tech}</span>)}
              {product.technologies.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">+{product.technologies.length - 4}</span>}
            </div>
            <div className="flex items-center justify-between pt-3.5 border-t border-border/20">
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold fill-gold" />{product.rating}</span>
                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{product.downloadCount.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1"><Clock className="w-3 h-3" />v{product.version}</span>
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}

const categories = ["All", "Boilerplates", "Dashboards", "E-Commerce", "APIs", "Mobile", "CMS", "AI", "SaaS"];

export default function SourceCodePage() {
  const [products, setProducts] = useState<SourceCodeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high" | "rating">("popular");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetch("/api/products?type=source-code")
      .then((res) => res.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) || p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular": return b.downloadCount - a.downloadCount;
        case "newest": return new Date(b.id).getTime() - new Date(a.id).getTime();
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full">Source Code</Badge>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Premium Source Code</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">Production-ready codebases to accelerate your development</p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input type="text" placeholder="Search source code, technologies..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(8); }} className="w-full h-12 pl-11 pr-4 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all duration-300" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setVisibleCount(8); }} className={cn("px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-300", activeCategory === cat ? "bg-primary text-primary-fg" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30")}>{cat}</button>
                ))}
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-8 px-3 text-xs bg-background border border-border/40 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </AnimatedSection>
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto" /></div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-20">
              <Layout className="w-14 h-14 text-muted-foreground/15 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <Button variant="outline" size="sm" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="rounded-lg">Clear filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button variant="outline" size="lg" onClick={() => setVisibleCount((prev) => prev + 8)} className="rounded-xl px-8">
                    Load More ({Math.min(8, filteredProducts.length - visibleCount)} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
