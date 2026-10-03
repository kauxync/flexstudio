"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, LifeBuoy, ChevronDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("[APPLICATION_ERROR]", error);
  }, [error]);

  const handleCopyDigest = () => {
    if (error.digest || error.message) {
      navigator.clipboard.writeText(`Digest: ${error.digest || "N/A"}\nMessage: ${error.message}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-[15%] w-72 h-72 rounded-full bg-rose-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-[15%] w-60 h-60 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative text-center max-w-lg mx-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>System Alert · 500 Server Error</span>
        </div>

        {/* Large number */}
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

        {/* Heading & Details */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          An unexpected server error occurred while processing your request. Our automated telemetry has logged the issue.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-xl px-7 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-semibold shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
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
            <Button
              variant="ghost"
              size="lg"
              className="rounded-xl px-5 h-12 text-sm font-semibold"
            >
              Browse Templates
            </Button>
          </Link>
        </div>

        {/* Technical Details Toggle */}
        <div className="mt-8 pt-6 border-t border-border/20 text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <span>Technical incident details</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
          </button>

          {showDetails && (
            <div className="mt-3 p-4 rounded-xl border border-border/30 bg-card/60 backdrop-blur-md text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Error Digest Code:</span>
                <button
                  type="button"
                  onClick={handleCopyDigest}
                  className="px-2 py-1 rounded bg-muted/30 text-foreground hover:bg-muted/60 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-foreground font-bold break-all bg-background/50 p-2 rounded-lg border border-border/20">
                {error.digest || error.message || "Unknown internal exception"}
              </p>
            </div>
          )}
        </div>

        {/* Support links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/contact" className="hover:text-foreground transition-colors flex items-center gap-1">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </Link>
          <span>·</span>
          <Link href="/templates" className="hover:text-foreground transition-colors">
            All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
