"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-[15%] w-64 h-64 rounded-full bg-error/5 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/3 left-[10%] w-48 h-48 rounded-full bg-gold/5 blur-[80px] animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative text-center px-4">
        {/* Large number */}
        <div className="relative mb-8">
          <span className="font-display text-[12rem] sm:text-[16rem] md:text-[20rem] font-bold leading-none text-foreground/[0.02] select-none">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl sm:text-7xl md:text-8xl font-bold gradient-text-gold">
              500
            </span>
          </div>
        </div>

        {/* Gold line */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Message */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          Please try again or contact support if the problem persists.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            size="lg"
            className="rounded-xl px-8 h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="rounded-xl px-8 h-12">
              Go Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground/50 mb-3">Need help?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/support" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Support Center
            </Link>
            <Link href="/contact" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
