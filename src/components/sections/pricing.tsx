"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Check, Clock, Sparkles, Code2, ArrowRight, ShieldCheck } from "lucide-react";

const freelancePlans = [
  {
    name: "Starter MVP",
    tagline: "High-Converting Landing Page",
    description: "Ideal for product launches, indie hackers, portfolios, and fast MVP validation.",
    price: "₹4,999",
    usdPrice: "$60",
    timeline: "3–5 Days Turnaround",
    features: [
      "1 Custom Next.js 16 + Tailwind Landing Page",
      "100% Mobile & Ultra-Fast Responsive Design",
      "Contact Form & Lead Capture (Email/WhatsApp)",
      "95+ Google Lighthouse Speed & Core Web Vitals",
      "Basic On-Page SEO & Social OpenGraph Tags",
      "14 Days Post-Launch Bug Fix Warranty",
      "100% Full Source Code & GitHub Handover",
    ],
    cta: "Hire for MVP",
    href: "/contact?service=starter-mvp",
    highlighted: false,
    badge: "Fast Turnaround",
  },
  {
    name: "Full-Stack Web App",
    tagline: "Commercial Web Application",
    description: "For startups, SaaS MVPs, booking systems, and scalable eCommerce storefronts.",
    price: "₹14,999",
    usdPrice: "$180",
    timeline: "10–14 Days Turnaround",
    features: [
      "Up to 6 Custom Pages (Dashboard, Store, Checkout)",
      "Next.js App Router + TypeScript + Tailwind CSS",
      "Auth & Database (PostgreSQL/Supabase + NextAuth)",
      "Payment Gateway (Cashfree UPI / Stripe / Razorpay)",
      "Admin Panel & Dynamic Content Management",
      "Transactional Emails (Resend / Notification setup)",
      "30 Days Dedicated Support & 2 Iteration Sprints",
      "Complete Deployment to Vercel/AWS & IP Rights",
    ],
    cta: "Start Your Project",
    href: "/contact?service=fullstack-app",
    highlighted: true,
    badge: "Most Popular ⭐",
  },
  {
    name: "Custom Bespoke Platform",
    tagline: "Enterprise & Complex Architecture",
    description: "For scaling businesses requiring advanced logic, microservices, or AI pipelines.",
    price: "₹34,999+",
    usdPrice: "$420+",
    timeline: "3–4 Weeks Delivery",
    features: [
      "Full Custom Architecture & Scalable Backend",
      "Multi-Tenant SaaS / RBAC (Superadmin, Tenant, User)",
      "AI Integration (OpenAI/Anthropic LLMs & Vectors)",
      "Third-Party APIs, Webhooks & Automated Workflows",
      "Automated CI/CD Pipelines & Docker / Cloud Deploy",
      "Performance Auditing, Load Testing & Security Hardening",
      "60 Days VIP Priority Engineering SLA",
      "Complete Architecture Diagram & Team Handover",
    ],
    cta: "Discuss Architecture",
    href: "/contact?service=custom-enterprise",
    highlighted: false,
    badge: "Enterprise",
  },
];

export function Pricing() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 text-[11px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold"
          >
            Freelance Web Development Rates
          </Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Transparent Pricing for Web Engineering
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Hire a senior full-stack developer with clear milestones, zero surprise costs, guaranteed delivery timelines, and 100% intellectual property ownership.
          </p>
        </AnimatedSection>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {freelancePlans.map((plan, i) => (
            <AnimatedSection key={plan.name} animation="scale-up" delay={i * 120} className="flex">
              <div
                className={cn(
                  "relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl transition-all duration-500 overflow-hidden w-full backdrop-blur-xl",
                  plan.highlighted
                    ? "border-2 border-primary bg-card/90 shadow-2xl shadow-primary/20 md:-translate-y-2 z-10"
                    : "border border-border/50 bg-card/40 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl"
                )}
              >
                {/* Highlight Glow Accent */}
                {plan.highlighted && (
                  <>
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary" />
                    <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                  </>
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="flex justify-between items-center mb-4">
                    <Badge
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full border",
                        plan.highlighted
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-muted text-muted-foreground border-border/50"
                      )}
                    >
                      {plan.badge}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="w-3 h-3 text-primary" />
                      {plan.timeline}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs font-medium text-primary mb-3">{plan.tagline}</p>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-border/40">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        / project (~{plan.usdPrice})
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 mt-1">
                      Milestone payments (50% start / 50% completion)
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <div className="h-4 w-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link href={plan.href} className="block w-full">
                    <Button
                      variant={plan.highlighted ? "primary" : "outline"}
                      size="lg"
                      className={cn(
                        "w-full rounded-xl h-11 text-xs font-semibold transition-all duration-300",
                        plan.highlighted
                          ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                          : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      {plan.cta}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Retainer & Hourly Banner */}
        <AnimatedSection animation="fade-up" delay={300} className="mt-12 max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl border border-primary/25 bg-card/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  Need Hourly Tasks or a Monthly Retainer?
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Availability
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Available for quick bug fixes at <strong>₹999/hr (~$12/hr)</strong> or monthly dedicated developer retainers at <strong>₹24,999/mo</strong>.
                </p>
              </div>
            </div>
            <Link href="/pricing" className="shrink-0">
              <Button variant="outline" size="sm" className="rounded-xl border-primary/30 hover:bg-primary/10 text-xs text-primary font-semibold">
                Explore All Services &amp; Add-ons
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Trust Badges */}
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Code &amp; IP Ownership
            </span>
            <span className="h-3 w-px bg-border/60 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Milestone Escrow Payouts
            </span>
            <span className="h-3 w-px bg-border/60 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Strict On-Time Delivery Guarantee
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
