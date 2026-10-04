"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Newsletter } from "@/components/sections/newsletter";
import { cn } from "@/lib/utils";
import { Clock, Star, Download, Search, SlidersHorizontal, X, Layout, Grid3X3, List, ChevronDown, ChevronUp, Eye, ShoppingCart, Check, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const priceRanges = [
  { label: "All Prices", min: 0, max: 10000 },
  { label: "Under ₹2000", min: 0, max: 2000 },
  { label: "₹2000 - ₹4000", min: 2000, max: 4000 },
  { label: "₹4000 - ₹6000", min: 4000, max: 6000 },
  { label: "₹6000+", min: 6000, max: 10000 },
];

const ratingOptions = [
  { label: "Any Rating", value: 0 },
  { label: "4.5 & up", value: 4.5 },
  { label: "4.7 & up", value: 4.7 },
  { label: "4.8 & up", value: 4.8 },
];

const categorySlugMap: Record<string, string> = {
  html: "HTML",
  tailwind: "Tailwind",
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  php: "PHP",
  laravel: "Laravel",
  shopify: "Shopify",
  wordpress: "WordPress",
  dashboard: "Dashboard",
  portfolio: "Portfolio",
  "landing-page": "Landing Page",
  landing: "Landing Page",
  saas: "SaaS",
  ecommerce: "E-Commerce",
  "e-commerce": "E-Commerce",
  ai: "AI",
  agency: "Agency",
  crm: "CRM",
  education: "Education",
  mobile: "Mobile App",
  "mobile-app": "Mobile App",
  "ui-kit": "UI Kit",
  starter: "Starter",
};

const templateCategories = [
  "All",
  "HTML",
  "Tailwind",
  "React",
  "Next.js",
  "Dashboard",
  "Landing Page",
  "Portfolio",
  "E-Commerce",
  "SaaS",
  "Vue",
  "PHP",
  "Laravel",
  "WordPress",
  "Shopify",
  "AI",
  "Agency",
  "CRM",
  "Education",
  "Mobile App",
];
const templateTechnologies = ["Next.js", "React", "Vue", "Tailwind", "TypeScript", "HTML", "Framer Motion", "Prisma", "Stripe"];

interface Template {
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

function TemplateCard({ template, view }: { template: Template; view: "grid" | "list" }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);

  // Check if already in cart
  useEffect(() => {
    if (!session) return;
    fetch("/api/cart").then((r) => r.json()).then((d) => {
      const items = d.items || [];
      setInCart(items.some((item: any) => item.productId === template.id));
    }).catch(() => {});
  }, [session, template.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { router.push(`/login?callbackUrl=/templates`); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: template.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok || data.error === "Already in cart") {
        setInCart(true);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch {}
    setLoading(false);
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${template.id}`, { method: "DELETE" });
      if (res.ok) {
        setInCart(false);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch {}
    setLoading(false);
  };

  if (view === "list") {
    return (
      <AnimatedSection animation="fade-up">
        <Link href={`/templates/${template.slug}`} className="group block">
          <article className="relative rounded-2xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-lg transition-all duration-500 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-48 sm:h-auto sm:w-64 shrink-0 overflow-hidden">
                <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10" />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/preview/${template.slug}`; }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border/30 text-sm font-medium shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-4 h-4" /> Live Preview
                  </button>
                </div>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {template.isNew && <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white">New</Badge>}
                  {template.isBestseller && <Badge className="text-[10px] px-2 py-0.5 bg-gold text-[#1a1a1a]">Bestseller</Badge>}
                </div>
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 mb-2">{template.category}</Badge>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{template.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold">₹{template.price}</div>
                    {template.originalPrice && <div className="text-xs text-muted-foreground line-through">₹{template.originalPrice}</div>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{template.shortDesc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">{tech}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold fill-gold" />{template.rating}</span>
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" />{template.downloadCount.toLocaleString()}</span>
                  </div>
                  {inCart ? (
                    <button
                      onClick={handleRemoveFromCart}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-fg hover:bg-primary-hover transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        </Link>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fade-up">
      <Link href={`/templates/${template.slug}`} className="group block h-full">
        <article className="relative h-full rounded-2xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-xl hover:shadow-gold/5 transition-all duration-700 overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/preview/${template.slug}`; }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border/30 text-sm font-medium shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-4 h-4" /> Live Preview
              </button>
            </div>
            <div className="absolute top-3 left-3 flex gap-1.5">
              {template.isNew && <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white">New</Badge>}
              {template.isBestseller && <Badge className="text-[10px] px-2 py-0.5 bg-gold text-[#1a1a1a]">Bestseller</Badge>}
              {template.originalPrice && <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-background/80 backdrop-blur-sm">-{Math.round((1 - template.price / template.originalPrice) * 100)}%</Badge>}
            </div>
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/30">
                {template.originalPrice && <span className="text-xs text-muted-foreground line-through">₹{template.originalPrice}</span>}
                <span className="text-sm font-bold">₹{template.price}</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 mb-2.5">{template.category}</Badge>
            <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1">{template.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{template.shortDesc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {template.technologies.slice(0, 3).map((tech) => (
                <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">{tech}</span>
              ))}
              {template.technologies.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/60">+{template.technologies.length - 3}</span>}
            </div>
            <div className="flex items-center justify-between pt-3.5 border-t border-border/20">
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold fill-gold" />{template.rating}</span>
                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{template.downloadCount.toLocaleString()}</span>
              </div>
              {inCart ? (
                <button
                  onClick={handleRemoveFromCart}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-fg hover:bg-primary-hover transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
              )}
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getMappedCategory = (slugOrName: string | null) => {
    if (!slugOrName || slugOrName.toLowerCase() === "all") return "All";
    const lower = slugOrName.toLowerCase().trim();
    if (categorySlugMap[lower]) return categorySlugMap[lower];
    const found = templateCategories.find((c) => c.toLowerCase() === lower);
    if (found) return found;
    return slugOrName.charAt(0).toUpperCase() + slugOrName.slice(1);
  };

  const initialCat = getMappedCategory(searchParams.get("category"));
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high" | "rating">("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showBestsellerOnly, setShowBestsellerOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Sync category when URL query parameter changes
  useEffect(() => {
    const cat = getMappedCategory(searchParams.get("category"));
    setActiveCategory(cat);
    const q = searchParams.get("q") || searchParams.get("search");
    if (q !== null && q !== undefined) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/products?type=template")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
    if (cat === "All") {
      router.push("/templates", { scroll: false });
    } else {
      const slugEntry = Object.entries(categorySlugMap).find(
        ([_, name]) => name.toLowerCase() === cat.toLowerCase()
      );
      const slug = slugEntry ? slugEntry[0] : cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      router.push(`/templates?category=${slug}`, { scroll: false });
    }
  };

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSelectedTech([]);
    setPriceRange([0, 10000]);
    setMinRating(0);
    setShowNewOnly(false);
    setShowBestsellerOnly(false);
    setVisibleCount(ITEMS_PER_PAGE);
    router.push("/templates", { scroll: false });
  };

  const hasActiveFilters =
    activeCategory !== "All" ||
    selectedTech.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    minRating > 0 ||
    showNewOnly ||
    showBestsellerOnly ||
    searchQuery !== "";

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => {
        const matchesCategory =
          activeCategory === "All" ||
          (() => {
            const normActive = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normCat = (t.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");

            // 1. Direct category name match
            if (
              normCat === normActive ||
              normCat.includes(normActive) ||
              normActive.includes(normCat)
            ) {
              return true;
            }

            // 2. Technology match (e.g. template uses HTML or React)
            if (
              Array.isArray(t.technologies) &&
              t.technologies.some((tech) => {
                const normTech = tech.toLowerCase().replace(/[^a-z0-9]/g, "");
                return (
                  normTech === normActive ||
                  normTech.includes(normActive) ||
                  normActive.includes(normTech)
                );
              })
            ) {
              return true;
            }

            // 3. Keyword in title or short summary
            const titleDesc = `${t.title || ""} ${t.shortDesc || ""}`
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "");
            if (titleDesc.includes(normActive)) {
              return true;
            }

            return false;
          })();

        const matchesSearch =
          searchQuery === "" ||
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(t.technologies) &&
            t.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesTech =
          selectedTech.length === 0 ||
          (Array.isArray(t.technologies) &&
            selectedTech.some((tech) => t.technologies.includes(tech)));

        const matchesPrice = t.price >= priceRange[0] && t.price <= priceRange[1];
        const matchesRating = t.rating >= minRating;
        const matchesNew = !showNewOnly || t.isNew;
        const matchesBestseller = !showBestsellerOnly || t.isBestseller;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesTech &&
          matchesPrice &&
          matchesRating &&
          matchesNew &&
          matchesBestseller
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return b.downloadCount - a.downloadCount;
          case "newest":
            return new Date(b.id).getTime() - new Date(a.id).getTime();
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [
    templates,
    activeCategory,
    searchQuery,
    sortBy,
    selectedTech,
    priceRange,
    minRating,
    showNewOnly,
    showBestsellerOnly,
  ]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <Badge
              variant="outline"
              className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full"
            >
              Templates
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Premium Templates</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Beautifully crafted templates to launch your next project faster
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search templates, technologies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="w-full h-12 pl-11 pr-4 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all duration-300"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {/* Horizontal Quick Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {templateCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border shrink-0 font-medium",
                  activeCategory === cat
                    ? "bg-gold text-[#1a1a1a] border-gold font-bold shadow-sm"
                    : "bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground border-border/40 hover:border-gold/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 p-5 rounded-2xl border border-border/30 bg-card/20">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm font-semibold">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <SidebarSection title="Category">
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                    {templateCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          activeCategory === cat
                            ? "bg-primary text-primary-fg font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </SidebarSection>
                <SidebarSection title="Technology">
                  <div className="flex flex-wrap gap-1.5">
                    {templateTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={cn(
                          "px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-200",
                          selectedTech.includes(tech)
                            ? "bg-primary text-primary-fg"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30"
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </SidebarSection>
                <SidebarSection title="Price">
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setPriceRange([range.min, range.max]);
                          setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          priceRange[0] === range.min && priceRange[1] === range.max
                            ? "bg-primary text-primary-fg font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </SidebarSection>
                <SidebarSection title="Rating">
                  <div className="space-y-1">
                    {ratingOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setMinRating(opt.value);
                          setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          minRating === opt.value
                            ? "bg-primary text-primary-fg font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {opt.value > 0 && <Star className="w-3 h-3 text-gold fill-gold" />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </SidebarSection>
                <SidebarSection title="Quick Filters">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowNewOnly(!showNewOnly);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                        showNewOnly
                          ? "bg-emerald-500 text-white font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30"
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full", showNewOnly ? "bg-white" : "bg-emerald-500")} />
                      New Arrivals
                    </button>
                    <button
                      onClick={() => {
                        setShowBestsellerOnly(!showBestsellerOnly);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                        showBestsellerOnly
                          ? "bg-gold text-[#1a1a1a] font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30"
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full", showBestsellerOnly ? "bg-[#1a1a1a]" : "bg-gold")} />
                      Bestsellers
                    </button>
                  </div>
                </SidebarSection>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Active Filter Notice if activeCategory !== All */}
              {activeCategory !== "All" && (
                <div className="mb-4 p-3.5 rounded-2xl border border-gold/30 bg-gold/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">Category filter:</span>
                    <span className="font-bold text-foreground bg-gold/20 text-gold px-2 py-0.5 rounded-lg border border-gold/30">
                      {activeCategory}
                    </span>
                    <span className="text-muted-foreground">
                      ({filteredTemplates.length} result{filteredTemplates.length === 1 ? "" : "s"})
                    </span>
                  </div>
                  <button
                    onClick={() => handleCategorySelect("All")}
                    className="px-2 py-1 rounded-lg border border-border/40 bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear Filter</span>
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-card text-xs font-semibold text-foreground"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredTemplates.length}</span> templates
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 px-3 text-xs bg-background border border-border/40 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="hidden sm:flex items-center gap-1 h-8 px-1.5 rounded-lg border border-border/40 bg-background">
                    <button
                      onClick={() => setView("grid")}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                        view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                        view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filter Drawer / Collapse */}
              {showFilters && (
                <div className="lg:hidden mb-6 p-4 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/30">
                    <span className="font-bold text-foreground">Mobile Filters</span>
                    <button onClick={() => setShowFilters(false)} className="text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="font-semibold block mb-2">Category</span>
                    <div className="flex flex-wrap gap-1.5">
                      {templateCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            handleCategorySelect(cat);
                            setShowFilters(false);
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border text-xs",
                            activeCategory === cat
                              ? "bg-gold text-[#1a1a1a] border-gold font-bold"
                              : "border-border/40 bg-background/60 text-muted-foreground"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold block mb-2">Technology</span>
                    <div className="flex flex-wrap gap-1.5">
                      {templateTechnologies.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border text-xs",
                            selectedTech.includes(tech)
                              ? "bg-primary text-primary-fg"
                              : "border-border/40 bg-background/60 text-muted-foreground"
                          )}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full text-xs">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}

              {loading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto" />
                </div>
              ) : visibleTemplates.length === 0 ? (
                <div className="text-center py-20">
                  <Layout className="w-14 h-14 text-muted-foreground/15 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No templates found</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {activeCategory !== "All"
                      ? `No templates matching "${activeCategory}" currently available.`
                      : "No templates found matching your filter criteria."}
                  </p>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-lg">
                    Clear all filters
                  </Button>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visibleTemplates.map((t) => (
                    <TemplateCard key={t.id} template={t} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleTemplates.map((t) => (
                    <TemplateCard key={t.id} template={t} view="list" />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="rounded-xl px-8"
                  >
                    Load More (
                    {Math.min(ITEMS_PER_PAGE, filteredTemplates.length - visibleCount)} of{" "}
                    {filteredTemplates.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-32 text-center text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading templates...</p>
        </div>
      }
    >
      <TemplatesPageContent />
    </Suspense>
  );
}

function SidebarSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/20 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      <div className={cn("transition-all duration-300 overflow-hidden", open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>{children}</div>
    </div>
  );
}
