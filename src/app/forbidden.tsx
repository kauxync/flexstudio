import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "403 — Access Restricted | FlexStudioo",
  description: "You do not have authorization or administrative clearance to access this resource.",
  robots: { index: false, follow: false },
};

export default function Forbidden() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 right-[15%] w-72 h-72 rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-[15%] w-60 h-60 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative text-center max-w-lg mx-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Security Notice · 403 Forbidden</span>
        </div>

        {/* Large Decorative 403 */}
        <div className="relative mb-6">
          <span className="font-serif text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none block">
            403
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-500/20">
              <ShieldAlert className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Heading & Details */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Access Restricted
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          You don&apos;t have the necessary administrative privileges to view this area.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="rounded-xl px-7 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-semibold shadow-lg shadow-primary/20 text-sm">
              Sign In with Authorized Account
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="rounded-xl px-6 h-12 border-border/40 hover:bg-card text-sm font-semibold flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>

        {/* Help footer */}
        <p className="text-xs text-muted-foreground/60 mt-10">
          Think this is a mistake? Contact our support team at{" "}
          <Link href="/contact" className="text-primary hover:underline">
            support@kauxync.in
          </Link>
        </p>
      </div>
    </div>
  );
}
