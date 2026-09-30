"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = searchParams.get("service");
    const addon = searchParams.get("addon");
    const scope = searchParams.get("scope");
    const estimate = searchParams.get("estimate");

    if (service || addon || scope) {
      setSubject("custom");
      if (scope && estimate) {
        setMessage(
          `Hi! I configured a custom project scope for "${scope}" with an estimated quote of ₹${Number(
            estimate
          ).toLocaleString("en-IN")}. Here are my requirements and timeline: `
        );
      } else if (service) {
        const serviceMap: Record<string, string> = {
          "starter-mvp": "Starter MVP Landing Page (₹4,999)",
          "fullstack-app": "Full-Stack Web App (₹14,999)",
          "custom-enterprise": "Custom Enterprise / SaaS Platform (₹34,999+)",
          "hourly": "Hourly On-Demand Development (₹999/hr)",
          "part-time-retainer": "Part-Time Sprint Retainer (₹14,999/mo)",
          "full-retainer": "Full Dedicated Developer Retainer (₹29,999/mo)",
        };
        const title = serviceMap[service] || service;
        setMessage(
          `Hi! I would like to hire your team for the "${title}" package. Here are my project details: `
        );
      } else if (addon) {
        setMessage(
          `Hi! I'm interested in booking the "${addon}" add-on service. Here are the specifics: `
        );
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch message.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to send message at this moment. You can also write to flexstudio@kauxync.in directly."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contact Channels (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <AnimatedSection animation="fade-right">
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                Direct Channels
              </h3>
              <p className="text-xs text-muted-foreground">
                Skip the queue — reach our core engineers directly.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:flexstudio@kauxync.in"
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Engineering Desk
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    flexstudio@kauxync.in
                  </span>
                </div>
              </a>

              <a
                href="https://discord.gg/flexstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-transparent transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Discord Community
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                    discord.gg/flexstudio
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 border border-border/20">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Standard SLA
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    &lt; 24h Response (Mon – Sat)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Looking for Detailed Rates?
              </p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Check our transparent fixed packages, hourly rates, and interactive project cost calculator.
              </p>
              <Link
                href="/pricing"
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 mt-1"
              >
                View Pricing &amp; Scope Calculator <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Message Form (7 cols) */}
      <div className="lg:col-span-7">
        <AnimatedSection animation="fade-left">
          <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl shadow-xl space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                Send a Message
              </h2>
              <p className="text-xs text-muted-foreground">
                Fill out this brief form and our lead developer will get back to you with a proposal or answer.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Thank you for reaching out. A ticket has been created and we will reply to {email} shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="rounded-xl mt-2 text-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full h-11 px-3 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="w-full h-11 px-3 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  >
                    <option value="custom">Hire Custom Web Development / Project</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support &amp; Setup</option>
                    <option value="licensing">Licensing &amp; Agency Rights</option>
                    <option value="billing">Invoices &amp; Billing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Message / Project Details <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project, timeline, and tech stack requirements..."
                    className="w-full p-3 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-2xl h-12 bg-primary text-primary-fg hover:bg-primary-hover font-bold shadow-xl shadow-primary/20 text-xs"
                >
                  {sending ? (
                    "Transmitting..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-2" />
                      Dispatch Inquiry
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge
              variant="outline"
              className="mb-4 px-3.5 py-1 text-[10px] tracking-[0.2em] uppercase border-primary/30 bg-primary/5 text-primary rounded-full font-semibold"
            >
              Get in Touch
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Let&apos;s Build Your Next Web Project
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Have a project wireframe, need custom Next.js development, or looking for technical assistance? We typically respond within 24 hours.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Grid inside Suspense for searchParams */}
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-12 text-xs text-muted-foreground">Loading inquiry form...</div>}>
            <ContactFormInner />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
