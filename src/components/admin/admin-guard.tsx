"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-primary/30 border-t-primary animate-spin" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-border/40 bg-card p-0.5 flex items-center justify-center shrink-0 shadow-sm">
              <LogoIcon size={26} className="w-full h-full" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight">FlexStudio</span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
              Admin
            </span>
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">Authenticating admin session...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-8 rounded-3xl border border-error/20 bg-card/60 backdrop-blur-xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto ring-8 ring-error/5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Access Restricted</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are signed in as <span className="font-medium text-foreground">{session.user?.email}</span>, which does not have administrator privileges for FlexStudio Console.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Button>
            </Link>
            <Link href="/login?callbackUrl=/admin" className="flex-1">
              <Button variant="primary" className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Switch Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
