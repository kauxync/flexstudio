"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Settings,
  Store,
  CreditCard,
  Database,
  Shield,
  Key,
  Globe,
  Mail,
  User,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
            Configuration
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Console & Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Platform configurations, payment gateway connections, and administrator controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Profile */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Store className="w-5 h-5 text-gold" />
              <div>
                <h2 className="font-serif text-base font-bold text-foreground">Store Identity</h2>
                <p className="text-xs text-muted-foreground">Public marketplace branding and metadata</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="font-semibold text-foreground block mb-1">Marketplace Name</label>
                <input
                  type="text"
                  readOnly
                  value="FlexStudio"
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-border/40 text-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Default Currency</label>
                <input
                  type="text"
                  readOnly
                  value="INR (₹) - Indian Rupee"
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-border/40 text-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Support Email</label>
                <input
                  type="text"
                  readOnly
                  value="flexstudio@kauxync.in"
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-border/40 text-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Production Domain</label>
                <input
                  type="text"
                  readOnly
                  value="https://flexstudio.kauxync.in"
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-border/40 text-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway Settings */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="font-serif text-base font-bold text-foreground">Cashfree Payment Gateway</h2>
                  <p className="text-xs text-muted-foreground">UPI, Credit/Debit cards, Netbanking checkout</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">Active Environment</p>
                  <p className="text-[11px] text-muted-foreground">Cashfree Sandbox / Production API</p>
                </div>
                <span className="font-mono text-[11px] bg-background px-2.5 py-1 rounded-lg border border-border/40 text-foreground">
                  CASHFREE_ENVIRONMENT: SANDBOX
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">Webhook Listener Endpoint</p>
                  <p className="text-[11px] text-muted-foreground">Receives async payment notifications</p>
                </div>
                <span className="font-mono text-[11px] bg-background px-2.5 py-1 rounded-lg border border-border/40 text-gold truncate max-w-xs">
                  /api/webhooks/cashfree
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="font-serif text-base font-bold text-foreground">Infrastructure & Database</h2>
                <p className="text-xs text-muted-foreground">Neon PostgreSQL, Prisma ORM, and Edge Middleware</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 rounded-2xl bg-muted/20 border border-border/20">
                <span className="text-muted-foreground block text-[11px]">Database Provider</span>
                <span className="font-bold text-foreground mt-0.5 block">Neon Serverless Postgres</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/20 border border-border/20">
                <span className="text-muted-foreground block text-[11px]">Prisma Client</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">v7.x Connected</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/20 border border-border/20">
                <span className="text-muted-foreground block text-[11px]">Auth Engine</span>
                <span className="font-bold text-violet-400 mt-0.5 block">NextAuth v5 (JWT)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (1 col) */}
        <div className="space-y-6">
          {/* Admin Profile Details */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-base font-bold text-foreground">Session Profile</h2>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/20">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold font-bold flex items-center justify-center text-base border border-gold/30 shrink-0">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-muted-foreground font-mono truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 uppercase">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Account Role</span>
                <span className="font-mono text-foreground font-semibold uppercase">{user?.role}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Access Level</span>
                <span className="text-emerald-400 font-semibold">
                  {isSuperAdmin ? "Unrestricted (Root)" : "Admin Operations"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full gap-2 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Console
              </Button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Quick Links</h2>
            <div className="space-y-1.5">
              <a
                href="/test-credentials"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Test Payment Credentials</span>
                <span className="text-[10px] font-mono text-gold">/test-credentials →</span>
              </a>
              <a
                href="/setup"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>OAuth Setup Guide</span>
                <span className="text-[10px] font-mono text-gold">/setup →</span>
              </a>
              <a
                href="/"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Public Storefront</span>
                <span className="text-[10px] font-mono text-gold">/ →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
