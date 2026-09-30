"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.05z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branded */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0c0a09]">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1e1b4b]/30 via-[#0c0a09] to-[#0c0a09]" />
          <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />
          <div className="absolute bottom-[15%] right-[5%] w-72 h-72 rounded-full bg-[#1e1b4b]/20 blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Decorative lines */}
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          <div className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20">
          {/* Logo */}
          <Link href="/" className="mb-16">
            <Image src="/logo.svg" alt="FlexStudio" width={180} height={32} className="h-8 w-auto" style={{ filter: "invert(1) brightness(2)" }} />
          </Link>

          {/* Heading */}
          <h1 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Build something
            <span className="block mt-1">
              <span className="bg-gradient-to-r from-gold via-[#f0d060] to-gold bg-clip-text text-transparent">
                exceptional.
              </span>
            </span>
          </h1>

          <p className="text-[#a8a29e] text-base leading-relaxed max-w-md mb-12">
            Access premium templates, UI kits, and source code.
            Join thousands of developers shipping faster with FlexStudioo.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "500+", label: "Products" },
              { value: "50K+", label: "Downloads" },
              { value: "10K+", label: "Developers" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-[#78716c] tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative gold line */}
          <div className="mt-16 w-16 h-px bg-gradient-to-r from-gold/60 to-transparent" />
        </div>

        {/* Floating orb */}
        <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border border-gold/10 animate-[spin_30s_linear_infinite]">
          <div className="absolute inset-2 rounded-full border border-gold/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold/30" />
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-mesh opacity-15" />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
        <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-gold/3 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full bg-[#1e1b4b]/5 blur-[80px]" />

        {/* Form Card */}
        <div className="relative w-full max-w-md px-6 py-12">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="FlexStudio" width={170} height={30} className="h-8 w-auto dark:invert dark:brightness-200" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-error/5 border border-error/20 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/10 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-12 pr-4 text-sm bg-background border border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-gold hover:text-gold/80 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-12 pr-12 text-sm bg-background border border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium text-sm transition-all duration-300 shadow-lg shadow-foreground/10 hover:shadow-xl hover:shadow-foreground/15"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground/40 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-border/50 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-border transition-all duration-300"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              onClick={() => signIn("github", { callbackUrl })}
              className="flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-border/50 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-border transition-all duration-300"
            >
              <GitHubIcon />
              GitHub
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-foreground hover:text-gold transition-colors">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
