import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page Not Found | FlexStudioo",
  description: "The page you're looking for doesn't exist or has been moved. Browse our premium web templates and source code.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-gold/5 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-[10%] w-48 h-48 rounded-full bg-primary/5 blur-[80px] animate-float-slow" style={{ animationDelay: "2s" }} />

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-border/20 to-transparent" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-border/20 to-transparent" />
      </div>

      <div className="relative text-center px-4">
        {/* Large number */}
        <div className="relative mb-8">
          <span className="font-display text-[12rem] sm:text-[16rem] md:text-[20rem] font-bold leading-none text-foreground/[0.02] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl sm:text-7xl md:text-8xl font-bold gradient-text-gold">
              404
            </span>
          </div>
        </div>

        {/* Gold line */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Message */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg" className="rounded-xl px-8 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-medium">
              Go Home
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" size="lg" className="rounded-xl px-8 h-12">
              Browse Templates
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground/50 mb-4">Or try one of these:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/source-code" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Source Code
            </Link>
            <Link href="/services" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/pricing" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
