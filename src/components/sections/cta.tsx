import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export function CTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="scale-up">
          <div className="relative rounded-[2rem] bg-muted/50 dark:bg-card border border-border/50 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-gold/[0.02] dark:from-primary/[0.05] dark:to-gold/[0.03]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.04] dark:bg-gold/[0.06] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/[0.03] dark:bg-primary/[0.04] rounded-full blur-[100px]" />

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            <div className="relative flex flex-col items-center text-center px-8 py-16 sm:px-16 sm:py-24">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary border border-primary/20">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold mb-3 leading-tight">
                Ready to build something
                <br />
                <span className="gradient-text-gold">exceptional?</span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
                Join thousands of developers who ship faster with FlexStudio.
                Start building today with premium templates and tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/templates">
                  <Button size="lg" className="rounded-xl px-8 h-12 bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/10 hover:shadow-xl hover:shadow-foreground/15 font-medium transition-all duration-500">
                    Browse Templates
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="rounded-xl px-8 h-12 border-border hover:border-gold/20 hover:bg-muted/50 transition-all duration-500">
                    Create Free Account
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-10 text-[11px] text-muted-foreground/50">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secure checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  30-day guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                  10K+ developers
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
