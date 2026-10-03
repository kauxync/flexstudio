"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page500() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      <div className="absolute top-1/4 right-[15%] w-72 h-72 rounded-full bg-rose-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-[15%] w-60 h-60 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative text-center max-w-lg mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>System Alert · 500 Server Error</span>
        </div>

        <div className="relative mb-6">
          <span className="font-serif text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none block">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-2xl shadow-rose-500/20">
              <AlertTriangle className="w-12 h-12" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Internal Server Incident
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Our servers encountered an unexpected condition. Telemetry logs have been captured for engineering review.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handleReload}
            size="lg"
            className="rounded-xl px-7 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-semibold shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Page</span>
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-6 h-12 border-border/40 hover:bg-card text-sm font-semibold flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="ghost" size="lg" className="rounded-xl px-5 h-12 text-sm font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Templates</span>
            </Button>
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-border/20">
          <p className="text-xs text-muted-foreground">
            If you need immediate assistance with orders or downloads, visit our{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Support Center
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
