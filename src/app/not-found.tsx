import Link from "next/link";
import { Search, Compass, Home, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page Not Found | FlexStudioo",
  description: "The page you're looking for doesn't exist or has been moved. Browse our premium web templates and source code.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-[10%] w-72 h-72 rounded-full bg-gold/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-[10%] w-60 h-60 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative text-center max-w-lg mx-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Error 404 · Missing Route</span>
        </div>

        {/* Large Decorative 404 */}
        <div className="relative mb-6">
          <span className="font-serif text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-2xl shadow-gold/20">
              <Compass className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Heading & Details */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Lost in Space?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page or product you are looking for does not exist, has been archived, or the URL might have a typo.
        </p>

        {/* Quick Search Bar */}
        <form action="/search" method="GET" className="max-w-md mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search templates, dashboards, source code..."
              className="w-full h-12 pl-11 pr-24 rounded-2xl bg-card/80 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 backdrop-blur-xl shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 h-8 rounded-xl bg-primary text-primary-fg text-xs font-semibold hover:bg-primary-hover transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/templates">
            <Button size="lg" className="rounded-xl px-7 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-semibold shadow-lg shadow-primary/20 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Browse All Templates</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="rounded-xl px-6 h-12 border-border/40 hover:bg-card text-sm font-semibold flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>

        {/* Quick category links */}
        <div className="mt-10 pt-6 border-t border-border/20">
          <p className="text-xs text-muted-foreground/70 mb-3">Popular destinations:</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {[
              { label: "Dashboard Kits", href: "/templates?category=dashboard" },
              { label: "SaaS Templates", href: "/templates?category=saas" },
              { label: "HTML Templates", href: "/templates?category=html" },
              { label: "Source Code", href: "/source-code" },
              { label: "Pricing", href: "/pricing" },
              { label: "Support", href: "/contact" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="px-3 py-1.5 rounded-lg border border-border/30 bg-card/40 hover:border-primary/40 hover:text-foreground text-muted-foreground transition-all"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
