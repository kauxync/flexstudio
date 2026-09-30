"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative w-full max-w-md px-4">
        <AnimatedSection animation="scale-up">
          <div className="p-8 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-sm">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>

            {submitted ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 mx-auto mb-6">
                  <CheckCircle className="w-7 h-7 text-success" />
                </div>
                <h1 className="font-display text-2xl font-bold text-center mb-2">Check your email</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  If an account exists with {email}, we&apos;ve sent a password reset link.
                </p>
                {resetUrl && (
                  <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Dev mode - Reset link:</p>
                    <Link href={resetUrl} className="text-xs text-primary hover:underline break-all">
                      {resetUrl}
                    </Link>
                  </div>
                )}
                <Link href="/login">
                  <Button variant="outline" className="w-full rounded-xl">Back to Login</Button>
                </Link>
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold text-center mb-2">Forgot password?</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-4 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                   <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-medium">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
