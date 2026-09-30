"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="scale-up">
          <div className="relative overflow-hidden rounded-[2rem] bg-muted/50 dark:bg-card border border-border/50">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-gold/[0.02] dark:from-primary/[0.05] dark:to-gold/[0.03]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/[0.04] dark:bg-gold/[0.06] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/[0.03] dark:bg-primary/[0.05] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 lg:px-24 lg:py-24">
            <div className="max-w-2xl mx-auto text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 dark:bg-gold/15 text-gold border border-gold/20">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold mb-3 leading-tight">
                Stay in the loop
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto">
                Get the latest templates, deals, and developer resources.
                No spam, unsubscribe anytime.
              </p>

              {submitted ? (
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-12 px-4 text-sm bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium shadow-lg shadow-foreground/10 hover:shadow-xl hover:shadow-foreground/15 transition-all duration-500 shrink-0"
                  >
                    Subscribe
                  </Button>
                </form>
              )}

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-5 mt-6 text-[11px] text-muted-foreground/50">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  No spam
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unsubscribe anytime
                </span>
              </div>
            </div>
          </div>
        </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
