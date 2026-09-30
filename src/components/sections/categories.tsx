"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Code2,
  Wind,
  Atom,
  Triangle,
  ShoppingBag,
  Globe,
  LayoutDashboard,
  User,
  Rocket,
  Cloud,
  ShoppingCart,
  BrainCircuit,
  Building2,
  Database,
  BookOpen,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ReactNode> = {
  html: <Code2 className="w-6 h-6" />,
  tailwind: <Wind className="w-6 h-6" />,
  react: <Atom className="w-6 h-6" />,
  nextjs: <Triangle className="w-6 h-6" />,
  vue: <Triangle className="w-6 h-6" />,
  php: <Code2 className="w-6 h-6" />,
  laravel: <Code2 className="w-6 h-6" />,
  shopify: <ShoppingBag className="w-6 h-6" />,
  wordpress: <Globe className="w-6 h-6" />,
  dashboard: <LayoutDashboard className="w-6 h-6" />,
  portfolio: <User className="w-6 h-6" />,
  "landing-page": <Rocket className="w-6 h-6" />,
  saas: <Cloud className="w-6 h-6" />,
  ecommerce: <ShoppingCart className="w-6 h-6" />,
  ai: <BrainCircuit className="w-6 h-6" />,
  agency: <Building2 className="w-6 h-6" />,
  crm: <Database className="w-6 h-6" />,
  education: <BookOpen className="w-6 h-6" />,
};

const categoryStyles: Record<string, { bg: string; hover: string; icon: string; shadow: string }> = {
  html:       { bg: "bg-orange-50 dark:bg-orange-500/10", hover: "group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20", icon: "text-orange-600 dark:text-orange-400", shadow: "group-hover:shadow-orange-500/10" },
  tailwind:   { bg: "bg-cyan-50 dark:bg-cyan-500/10",     hover: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20",     icon: "text-cyan-600 dark:text-cyan-400",     shadow: "group-hover:shadow-cyan-500/10" },
  react:      { bg: "bg-sky-50 dark:bg-sky-500/10",        hover: "group-hover:bg-sky-100 dark:group-hover:bg-sky-500/20",       icon: "text-sky-600 dark:text-sky-400",        shadow: "group-hover:shadow-sky-500/10" },
  nextjs:     { bg: "bg-slate-100 dark:bg-slate-500/10",   hover: "group-hover:bg-slate-200 dark:group-hover:bg-slate-500/20",   icon: "text-slate-700 dark:text-slate-300",    shadow: "group-hover:shadow-slate-500/10" },
  vue:        { bg: "bg-emerald-50 dark:bg-emerald-500/10", hover: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20", icon: "text-emerald-600 dark:text-emerald-400", shadow: "group-hover:shadow-emerald-500/10" },
  php:        { bg: "bg-indigo-50 dark:bg-indigo-500/10",  hover: "group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20", icon: "text-indigo-600 dark:text-indigo-400",  shadow: "group-hover:shadow-indigo-500/10" },
  laravel:    { bg: "bg-rose-50 dark:bg-rose-500/10",      hover: "group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20",     icon: "text-rose-600 dark:text-rose-400",      shadow: "group-hover:shadow-rose-500/10" },
  shopify:    { bg: "bg-green-50 dark:bg-green-500/10",    hover: "group-hover:bg-green-100 dark:group-hover:bg-green-500/20",   icon: "text-green-600 dark:text-green-400",    shadow: "group-hover:shadow-green-500/10" },
  wordpress:  { bg: "bg-blue-50 dark:bg-blue-500/10",      hover: "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",     icon: "text-blue-600 dark:text-blue-400",      shadow: "group-hover:shadow-blue-500/10" },
  dashboard:  { bg: "bg-violet-50 dark:bg-violet-500/10",  hover: "group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20", icon: "text-violet-600 dark:text-violet-400",  shadow: "group-hover:shadow-violet-500/10" },
  portfolio:  { bg: "bg-pink-50 dark:bg-pink-500/10",      hover: "group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20",     icon: "text-pink-600 dark:text-pink-400",      shadow: "group-hover:shadow-pink-500/10" },
  "landing-page": { bg: "bg-amber-50 dark:bg-amber-500/10", hover: "group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20", icon: "text-amber-600 dark:text-amber-400",    shadow: "group-hover:shadow-amber-500/10" },
  saas:       { bg: "bg-purple-50 dark:bg-purple-500/10",  hover: "group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20", icon: "text-purple-600 dark:text-purple-400",  shadow: "group-hover:shadow-purple-500/10" },
  ecommerce:  { bg: "bg-teal-50 dark:bg-teal-500/10",      hover: "group-hover:bg-teal-100 dark:group-hover:bg-teal-500/20",     icon: "text-teal-600 dark:text-teal-400",      shadow: "group-hover:shadow-teal-500/10" },
  ai:         { bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", hover: "group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-500/20", icon: "text-fuchsia-600 dark:text-fuchsia-400", shadow: "group-hover:shadow-fuchsia-500/10" },
  agency:     { bg: "bg-red-50 dark:bg-red-500/10",        hover: "group-hover:bg-red-100 dark:group-hover:bg-red-500/20",       icon: "text-red-600 dark:text-red-400",        shadow: "group-hover:shadow-red-500/10" },
  crm:        { bg: "bg-cyan-50 dark:bg-cyan-500/10",      hover: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20",     icon: "text-cyan-600 dark:text-cyan-400",      shadow: "group-hover:shadow-cyan-500/10" },
  education:  { bg: "bg-orange-50 dark:bg-orange-500/10",  hover: "group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20", icon: "text-orange-600 dark:text-orange-400",  shadow: "group-hover:shadow-orange-500/10" },
};

const productCounts: Record<string, number> = {
  html: 124, tailwind: 89, react: 156, nextjs: 67, vue: 43, php: 78,
  laravel: 52, shopify: 34, wordpress: 91, dashboard: 45, portfolio: 62,
  "landing-page": 138, saas: 28, ecommerce: 56, ai: 19, agency: 41,
  crm: 23, education: 31,
};

export function Categories() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <Badge variant="outline" className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full">
            Categories
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Curated collections for every need
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {siteConfig.categories.map((category, i) => {
            const styles = categoryStyles[category.slug] || categoryStyles.react;
            return (
              <AnimatedSection key={category.slug} animation="scale-up" delay={i * 60}>
                <Link
                  href={`/templates?category=${category.slug}`}
                  className={`group relative flex flex-col items-center gap-4 p-6 sm:p-7 rounded-2xl border border-border/30 bg-card/20 hover:bg-card hover:border-border/50 hover:shadow-xl ${styles.shadow} hover:-translate-y-1.5 transition-all duration-700 overflow-hidden`}
                >
                {/* Icon */}
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 ${styles.bg} ${styles.hover} ${styles.icon}`}>
                  {iconMap[category.slug]}
                </div>

                {/* Text */}
                <div className="relative text-center">
                  <span className="block text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-500">
                    {category.name}
                  </span>
                  <span className="block text-[11px] text-muted-foreground/50 mt-1 font-medium tabular-nums">
                    {productCounts[category.slug] || 0} items
                  </span>
                </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>

        {/* View all */}
        <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-foreground/70 hover:text-foreground border border-border/30 rounded-full hover:border-gold/20 hover:bg-card hover:shadow-lg hover:shadow-gold/5 transition-all duration-500"
          >
            View all categories
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
