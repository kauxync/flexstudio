import Link from "next/link";
import { KeyRound, ArrowRight, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "401 — Authentication Required | FlexStudioo",
  description: "Please sign in to access your digital dashboard, purchases, and developer assets.",
  robots: { index: false, follow: false },
};

export default function Unauthorized() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-[20%] w-72 h-72 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-[20%] w-60 h-60 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative text-center max-w-lg mx-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Session Required · 401 Unauthorized</span>
        </div>

        {/* Large Decorative 401 */}
        <div className="relative mb-6">
          <span className="font-serif text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none block">
            401
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
              <LogIn className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Heading & Details */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Sign In Required
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Please sign in to your FlexStudio account to access your downloads and cloud assets.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="rounded-xl px-7 h-12 bg-primary text-primary-fg hover:bg-primary-hover font-semibold shadow-lg shadow-primary/20 text-sm flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="rounded-xl px-6 h-12 border-border/40 hover:bg-card text-sm font-semibold flex items-center gap-2">
              <span>Create New Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Return home link */}
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Return to FlexStudio Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
