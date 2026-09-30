"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: decodeURIComponent(email), token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative w-full max-w-md px-4">
          <AnimatedSection animation="scale-up">
            <div className="p-8 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-sm text-center">
              <h1 className="font-display text-2xl font-bold mb-2">Invalid Reset Link</h1>
              <p className="text-muted-foreground mb-6">This password reset link is invalid or expired.</p>
              <Link href="/forgot-password">
                <Button className="rounded-xl">Request New Link</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative w-full max-w-md px-4">
        <AnimatedSection animation="scale-up">
          <div className="p-8 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-sm">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>

            {success ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 mx-auto mb-6">
                  <CheckCircle className="w-7 h-7 text-success" />
                </div>
                <h1 className="font-display text-2xl font-bold text-center mb-2">Password Reset!</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Your password has been reset. Redirecting to login...
                </p>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-center mb-2">Reset password</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Enter your new password below.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full h-11 px-4 pr-10 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full h-11 px-4 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                      placeholder="Confirm your password"
                    />
                  </div>
                   <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-medium">
                    {loading ? "Resetting..." : "Reset Password"}
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
