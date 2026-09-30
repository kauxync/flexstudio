"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import { Search, X, Clock, Star, Download, ArrowRight, Layout, FileCode, Sparkles } from "lucide-react";

type SearchCategory = "all" | "templates" | "source-code";

interface SearchResult {
  id: string;
  type: "template" | "source-code";
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
  downloadCount?: number;
  category?: string;
  tags?: string[];
  slug: string;
  url: string;
}

const recentSearches = ["dashboard", "react", "next.js", "saas", "tailwind"];
const popularSearches = ["Next.js template", "React dashboard", "SaaS boilerplate", "Tailwind CSS", "E-commerce", "Portfolio", "Admin panel", "API starter"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [isFocused, setIsFocused] = useState(false);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setAllResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const results: SearchResult[] = [];
        (data.products || []).forEach((p: any) => {
          results.push({
            id: p.id, type: p.type, title: p.title, description: p.shortDesc || p.description,
            thumbnail: p.thumbnail, price: p.price, rating: p.rating,
            downloadCount: p.downloadCount, category: p.category, tags: p.technologies,
            slug: p.slug, url: p.type === "template" ? `/templates/${p.slug}` : `/source-code/${p.slug}`,
          });
        });
        setAllResults(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  const filteredResults = useMemo(() => {
    return allResults.filter((item) => {
      if (activeCategory === "all") return true;
      if (activeCategory === "templates" && item.type === "template") return true;
      if (activeCategory === "source-code" && item.type === "source-code") return true;
      return false;
    });
  }, [allResults, activeCategory]);

  const resultCounts = useMemo(() => ({
    all: allResults.length,
    templates: allResults.filter((i) => i.type === "template").length,
    "source-code": allResults.filter((i) => i.type === "source-code").length,
  }), [allResults]);

  const typeIcon = (type: string) => {
    switch (type) {
      case "template": return <Layout className="w-4 h-4" />;
      case "source-code": return <FileCode className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "template": return "Template";
      case "source-code": return "Source Code";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Search</h1>
            <p className="text-muted-foreground">Find templates and source code</p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <div className={cn("relative rounded-2xl border transition-all duration-300", isFocused ? "border-primary shadow-lg shadow-primary/5 bg-card" : "border-border/40 bg-background")}>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
              <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Search templates, source code..." className="w-full h-14 pl-13 pr-12 text-base bg-transparent rounded-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
              {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>}
            </div>
          </AnimatedSection>
          {!query && (
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent</p>
                  <div className="flex flex-wrap gap-2">{recentSearches.map((term) => <button key={term} onClick={() => setQuery(term)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"><Clock className="w-3 h-3" />{term}</button>)}</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Popular</p>
                  <div className="flex flex-wrap gap-2">{popularSearches.map((term) => <button key={term} onClick={() => setQuery(term)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"><Sparkles className="w-3 h-3 text-gold" />{term}</button>)}</div>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
      {query && (
        <section className="py-6 relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-up" className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {([ { id: "all" as SearchCategory, label: "All", count: resultCounts.all }, { id: "templates" as SearchCategory, label: "Templates", count: resultCounts.templates }, { id: "source-code" as SearchCategory, label: "Source Code", count: resultCounts["source-code"] } ]).map((tab) => (
                  <button key={tab.id} onClick={() => setActiveCategory(tab.id)} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300", activeCategory === tab.id ? "bg-primary text-primary-fg" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30")}>
                    {tab.label}
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", activeCategory === tab.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground")}>{tab.count}</span>
                  </button>
                ))}
              </div>
            </AnimatedSection>
            <div className="text-sm text-muted-foreground mb-6">{filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</div>
            {loading ? (
              <div className="text-center py-20"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto" /></div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-14 h-14 text-muted-foreground/15 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm text-muted-foreground/50">Try different keywords</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((result, i) => (
                  <AnimatedSection key={result.id} animation="fade-up" delay={i * 40}>
                    <Link href={result.url} className="group block">
                      <article className="flex gap-4 p-4 rounded-xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-md transition-all duration-300">
                        {result.thumbnail && <div className="relative h-20 w-28 sm:h-24 sm:w-32 shrink-0 rounded-lg overflow-hidden"><img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60 uppercase">{typeIcon(result.type)} {typeLabel(result.type)}</span>
                              {result.category && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{result.category}</Badge>}
                            </div>
                            {result.price !== undefined && <span className="text-sm font-bold shrink-0">₹{result.price}</span>}
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1 mb-1">{result.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mb-2">{result.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                            {result.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold fill-gold" />{result.rating}</span>}
                            {result.downloadCount && <span className="flex items-center gap-1"><Download className="w-3 h-3" />{result.downloadCount.toLocaleString()}</span>}
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center shrink-0"><ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" /></div>
                      </article>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
