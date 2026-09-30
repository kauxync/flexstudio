"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ArrowLeft, User, Mail, Phone, Shield, Save, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      // Fetch phone from DB
      fetch("/api/users/me").then((r) => r.json()).then((d) => {
        if (d.user?.phone) setPhone(d.user.phone);
      }).catch(() => {});
    }
  }, [status, session, router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() || null }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save");
    }
    setLoading(false);
  };

  if (status === "loading") {
    return <div className="min-h-[80vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            {["admin", "super_admin"].includes((session?.user as any)?.role) && (
              <Link href="/admin/settings">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-semibold h-8">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Platform Settings
                </Button>
              </Link>
            )}
          </div>
          <AnimatedSection animation="fade-up">
            <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
          <AnimatedSection animation="fade-up">
            <div className="rounded-2xl border border-border/30 bg-card/20 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" /> Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-4 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <input type="email" value={email} disabled className="w-full h-10 px-4 text-sm bg-muted/50 border border-border/40 rounded-xl text-muted-foreground cursor-not-allowed" />
                  <p className="text-[11px] text-muted-foreground/50 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" maxLength={10} className="w-full h-10 px-4 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                  <p className="text-[11px] text-muted-foreground/50 mt-1">Used for payment processing</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="rounded-2xl border border-border/30 bg-card/20 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" /> Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email Verified</span>
                  {(session?.user as any)?.emailVerified ? (
                    <Badge variant="success" className="text-[10px]">Verified</Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px]">Unverified</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Type</span>
                  <Badge variant="primary" className="text-[10px]">{(session?.user as any)?.role || "user"}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground/80">{session?.user?.email}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={loading} className="rounded-xl px-6">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </Button>
              {saved && <span className="text-sm text-success flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Changes saved</span>}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
