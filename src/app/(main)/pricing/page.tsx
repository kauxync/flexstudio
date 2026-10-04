"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Check,
  X,
  ArrowRight,
  Clock,
  Code2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Zap,
  Cpu,
  Globe,
  Plus,
  Calculator,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Core Project Packages
const projectPlans = [
  {
    name: "Starter MVP",
    tagline: "High-Converting Landing Page",
    description: "Perfect for early-stage founders, portfolios, local businesses, and fast MVP validation.",
    price: 4999,
    usdPrice: "$60",
    timeline: "3–5 Days Turnaround",
    highlighted: false,
    badge: "Quick Launch",
    features: [
      { name: "1 Custom Next.js 16 + Tailwind Page", included: true },
      { name: "100% Mobile & Tablet Responsive", included: true },
      { name: "Contact Form & Lead Capture (Email/WhatsApp)", included: true },
      { name: "95+ Google Lighthouse Speed Score", included: true },
      { name: "Basic On-Page SEO & OpenGraph Meta", included: true },
      { name: "Free Vercel or Netlify Deployment", included: true },
      { name: "14 Days Post-Launch Bug Warranty", included: true },
      { name: "Full-Stack Database & Auth", included: false },
      { name: "Payment Gateway Integration", included: false },
      { name: "Custom Admin Portal / CMS", included: false },
    ],
    cta: "Hire for MVP",
    href: "/contact?service=starter-mvp",
  },
  {
    name: "Full-Stack Web App",
    tagline: "Complete Commercial Application",
    description: "For startups, SaaS MVPs, booking systems, and scalable eCommerce storefronts.",
    price: 14999,
    usdPrice: "$180",
    timeline: "10–14 Days Turnaround",
    highlighted: true,
    badge: "Most Popular ⭐",
    features: [
      { name: "Up to 6 Custom Pages / Screens", included: true },
      { name: "Next.js App Router + TypeScript + Tailwind", included: true },
      { name: "Auth & Database (PostgreSQL/Supabase + NextAuth)", included: true },
      { name: "Payment Gateway (Cashfree UPI / Stripe / Razorpay)", included: true },
      { name: "Admin Dashboard & Dynamic CMS", included: true },
      { name: "Transactional Emails (Resend setup)", included: true },
      { name: "30 Days Dedicated Support & 2 Sprints", included: true },
      { name: "100% Code & IP Transfer on GitHub", included: true },
      { name: "Microservices & Multi-Tenant RBAC", included: false },
      { name: "Custom AI Assistant Integration", included: false },
    ],
    cta: "Start Your Project",
    href: "/contact?service=fullstack-app",
  },
  {
    name: "Custom Enterprise / SaaS",
    tagline: "Bespoke Platform & Cloud Architecture",
    description: "For scaling businesses requiring advanced multi-tenant logic, high load, or AI pipelines.",
    price: 34999,
    usdPrice: "$420+",
    timeline: "3–4 Weeks Delivery",
    highlighted: false,
    badge: "Enterprise Grade",
    features: [
      { name: "Unlimited Custom Screens & Microservices", included: true },
      { name: "Next.js 16 + Node.js / Serverless Cloud", included: true },
      { name: "Multi-Tenant Architecture & Complex RBAC", included: true },
      { name: "AI Integration (OpenAI/Anthropic LLMs & Vectors)", included: true },
      { name: "Third-Party APIs, Webhooks & Automated Queues", included: true },
      { name: "Automated CI/CD Pipelines & Docker Deploy", included: true },
      { name: "Performance Auditing & Load Testing", included: true },
      { name: "60 Days VIP Priority SLA Support", included: true },
      { name: "System Architecture Docs & Team Handover", included: true },
      { name: "Dedicated Weekly Strategy Calls", included: true },
    ],
    cta: "Discuss Enterprise Scope",
    href: "/contact?service=custom-enterprise",
  },
];

// Retainers & Hourly Options
const retainerPlans = [
  {
    name: "Hourly On-Demand",
    tagline: "Ad-hoc Engineering & Bug Fixes",
    description: "Quick bug patching, feature additions, Figma slicing, or code refactoring.",
    rate: "₹999",
    unit: "/ hour (~$12)",
    features: [
      "Minimum 2 hours engagement",
      "Direct code commits to your Git repository",
      "Same-day emergency bug patching available",
      "Detailed time tracking & PR summaries",
      "Stack: React, Next.js, TypeScript, Tailwind, Node, Postgres",
    ],
    cta: "Book Developer Hours",
    href: "/contact?service=hourly",
  },
  {
    name: "Part-Time Sprint Retainer",
    tagline: "10 Hours / Week Dedicated",
    description: "Consistent ongoing development for growing products with weekly feature requests.",
    rate: "₹14,999",
    unit: "/ month (~$180)",
    features: [
      "10 dedicated development hours every week",
      "Shared private Slack or WhatsApp channel",
      "Weekly backlog sprint planning & delivery",
      "Priority response within 4 hours",
      "Unused hours roll over up to 1 month",
    ],
    cta: "Hire Part-Time",
    href: "/contact?service=part-time-retainer",
    badge: "Great for Startups",
  },
  {
    name: "Full Dedicated Developer",
    tagline: "25 Hours / Week Core Resource",
    description: "Embedded senior engineer acting as your tech lead or fractional CTO.",
    rate: "₹29,999",
    unit: "/ month (~$360)",
    features: [
      "25 dedicated development hours every week",
      "Daily asynchronous standups & PR reviews",
      "Direct client/team communication in Slack",
      "Immediate 1-hour priority response SLA",
      "Full stack coverage (Frontend + Backend + Cloud Ops)",
    ],
    cta: "Reserve Full Retainer",
    href: "/contact?service=full-retainer",
    highlighted: true,
    badge: "High Velocity",
  },
];

// A La Carte Add-ons ("Other Things")
const addOnServices = [
  {
    title: "Figma to Clean Next.js/Tailwind Code",
    description: "Convert your UI/UX designs into pixel-perfect, accessible, semantic React components.",
    cost: "₹2,499",
    unit: "per screen",
    time: "1–2 days",
    icon: Layers,
  },
  {
    title: "Payment Gateway Integration",
    description: "Complete checkout flow setup with Cashfree UPI, Stripe, or Razorpay with webhooks.",
    cost: "₹1,999",
    unit: "flat",
    time: "1–2 days",
    icon: Zap,
  },
  {
    title: "Database & Auth Setup (PostgreSQL + Auth.js)",
    description: "Production database on Neon/Supabase with Prisma ORM, migrations, and OAuth / credentials.",
    cost: "₹2,499",
    unit: "flat",
    time: "2 days",
    icon: Cpu,
  },
  {
    title: "Performance & Core Web Vitals Optimization",
    description: "Optimize image delivery, bundles, and fonts to achieve a 95+ score on Google Lighthouse.",
    cost: "₹1,999",
    unit: "flat",
    time: "1–2 days",
    icon: Globe,
  },
  {
    title: "Custom AI Assistant / LLM Chatbot Integration",
    description: "Embed OpenAI or Anthropic chatbots with streaming responses, function calling, or vector search.",
    cost: "₹4,999",
    unit: "flat",
    time: "3–4 days",
    icon: Sparkles,
  },
  {
    title: "Technical SEO Audit, Schema & Social Cards",
    description: "Complete Structured Data (Product, Organization, FAQ JSON-LD), robots, and OpenGraph images.",
    cost: "₹1,499",
    unit: "flat",
    time: "1 day",
    icon: Code2,
  },
];

// FAQ List
const freelanceFaqs = [
  {
    q: "How do milestone payments and escrow work?",
    a: "We work on a transparent 50/50 milestone system. 50% upfront deposit to initiate development and book the schedule, and the remaining 50% upon final review on our live staging server before full repository transfer.",
  },
  {
    q: "Do I get full ownership of the source code and intellectual property?",
    a: "Yes, 100%! All code, assets, database schemas, and documentation created for your project belong entirely to you with unrestricted commercial rights. We transfer the private GitHub repository to your organization upon project completion.",
  },
  {
    q: "Can you work with an existing codebase or Figma file?",
    a: "Absolutely. If you already have a Figma design, we will build it pixel-for-pixel into responsive code. If you have an existing codebase, we conduct a quick code review first to ensure clean architecture and seamless integration.",
  },
  {
    q: "What happens if there are bugs after the project is launched?",
    a: "Every project package includes a complimentary post-launch bug warranty (14 days for MVP, 30 days for Web Apps, 60 days for Enterprise). If any technical defect arises from our work during this window, we fix it within 24 hours at zero extra charge.",
  },
  {
    q: "What technologies and frameworks do you specialize in?",
    a: "Our core expertise is modern full-stack web engineering: Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4, Node.js, Prisma ORM, PostgreSQL (Neon/Supabase), NextAuth (Auth.js v5), Cashfree, Stripe, and Vercel/AWS.",
  },
  {
    q: "How do we communicate throughout the project?",
    a: "We communicate transparently via private Slack channel, WhatsApp group, or Discord, along with staging deployment links where you can track progress live as features are completed.",
  },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "retainers">("projects");

  // Interactive Project Cost Estimator state
  const [calcBase, setCalcBase] = useState<number>(14999);
  const [calcBaseName, setCalcBaseName] = useState<string>("Full-Stack Web App");
  const [calcBaseDays, setCalcBaseDays] = useState<number>(12);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([1]); // Default has Payment Gateway selected

  const calculatorAddons = [
    { id: 1, name: "Payment Gateway (Cashfree/Stripe)", price: 1999, days: 1 },
    { id: 2, name: "Auth & Database (PostgreSQL)", price: 2499, days: 2 },
    { id: 3, name: "Custom Admin CMS Portal", price: 3499, days: 3 },
    { id: 4, name: "AI Chatbot / LLM Integration", price: 4999, days: 3 },
    { id: 5, name: "Core Web Vitals & SEO Setup", price: 1999, days: 1 },
  ];

  const toggleAddon = (id: number) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculatedTotal =
    calcBase +
    calculatorAddons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);

  const calculatedDays =
    calcBaseDays +
    calculatorAddons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.days, 0);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <section className="pt-28 pb-14 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1 text-[11px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold"
            >
              Freelance Web Development Rates
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              Clear, Predictable Web Development Costs
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-8">
              Work directly with a senior full-stack developer. No agency bloat, no hidden surprises. Fixed milestone projects, flexible hourly tasks, and dedicated monthly retainers.
            </p>
          </AnimatedSection>

          {/* Pricing Model Switcher */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="inline-flex flex-wrap justify-center items-center p-1.5 rounded-2xl bg-card/60 border border-border/50 shadow-md backdrop-blur-xl">
              <button
                onClick={() => setActiveTab("projects")}
                className={cn(
                  "px-3 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap",
                  activeTab === "projects"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="sm:hidden">Fixed Projects</span>
                <span className="hidden sm:inline">Fixed Project Packages</span>
              </button>
              <button
                onClick={() => setActiveTab("retainers")}
                className={cn(
                  "px-3 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap",
                  activeTab === "retainers"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="sm:hidden">Retainers</span>
                <span className="hidden sm:inline">Hourly &amp; Monthly Retainers</span>
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Pricing Cards */}
      <section className="pb-16 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {activeTab === "projects" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
              {projectPlans.map((plan, i) => (
                <AnimatedSection key={plan.name} animation="scale-up" delay={i * 120} className="flex">
                  <div
                    className={cn(
                      "relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl transition-all duration-500 overflow-hidden w-full backdrop-blur-xl",
                      plan.highlighted
                        ? "border-2 border-primary bg-card/90 shadow-2xl shadow-primary/20 md:-translate-y-2 z-10"
                        : "border border-border/50 bg-card/40 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl"
                    )}
                  >
                    {plan.highlighted && (
                      <>
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary" />
                        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                      </>
                    )}

                    <div>
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

                      <h2 className="text-xl font-bold font-serif text-foreground mb-1">{plan.name}</h2>
                      <p className="text-xs font-semibold text-primary mb-3">{plan.tagline}</p>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mb-6 pb-6 border-b border-border/40">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                            ₹{plan.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">
                            / project (~{plan.usdPrice})
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 mt-1">
                          50% deposit / 50% on live staging approval
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature) => (
                          <li key={feature.name} className="flex items-start gap-2.5 text-xs">
                            {feature.included ? (
                              <div className="h-4 w-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-muted/60 text-muted-foreground/40 flex items-center justify-center shrink-0 mt-0.5">
                                <X className="h-2.5 w-2.5 stroke-[2]" />
                              </div>
                            )}
                            <span
                              className={
                                feature.included
                                  ? "text-foreground/90 font-medium"
                                  : "text-muted-foreground/50 line-through"
                              }
                            >
                              {feature.name}
                            </span>
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
          ) : (
            /* Retainer & Hourly Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
              {retainerPlans.map((plan, i) => (
                <AnimatedSection key={plan.name} animation="scale-up" delay={i * 120} className="flex">
                  <div
                    className={cn(
                      "relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl transition-all duration-500 overflow-hidden w-full backdrop-blur-xl",
                      plan.highlighted
                        ? "border-2 border-primary bg-card/90 shadow-2xl shadow-primary/20 md:-translate-y-2 z-10"
                        : "border border-border/50 bg-card/40 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl"
                    )}
                  >
                    {plan.highlighted && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary" />
                    )}

                    <div>
                      {plan.badge && (
                        <Badge
                          className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full border mb-4 w-fit",
                            plan.highlighted
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-muted text-muted-foreground border-border/50"
                          )}
                        >
                          {plan.badge}
                        </Badge>
                      )}

                      <h2 className="text-xl font-bold font-serif text-foreground mb-1">{plan.name}</h2>
                      <p className="text-xs font-semibold text-primary mb-3">{plan.tagline}</p>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mb-6 pb-6 border-b border-border/40">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                            {plan.rate}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {plan.unit}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 mt-1">
                          No long contracts · Cancel or pause anytime
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
          )}
        </div>
      </section>

      {/* Interactive Project Cost & Timeline Estimator */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="p-8 sm:p-10 rounded-3xl border border-primary/30 bg-card/70 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-border/40">
                <div>
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                    <Calculator className="w-4 h-4" />
                    Interactive Scope Estimator
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Estimate Your Custom Project Cost &amp; Timeline
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Select your project foundation and optional modular add-ons to calculate instant transparent pricing.
                  </p>
                </div>

                {/* Instant Quote Box */}
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center shrink-0 min-w-[200px]">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Estimated Total
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">
                    ₹{calculatedTotal.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs font-semibold text-primary mt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> ~{calculatedDays} Business Days
                  </div>
                </div>
              </div>

              {/* Step 1: Base Tier */}
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                  Step 1: Choose Base Architecture
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Starter MVP", price: 4999, days: 4, desc: "1-Page Landing" },
                    { name: "Full-Stack Web App", price: 14999, days: 12, desc: "Multi-Page App" },
                    { name: "Custom SaaS Platform", price: 34999, days: 24, desc: "Enterprise Complex" },
                  ].map((base) => (
                    <button
                      key={base.name}
                      onClick={() => {
                        setCalcBase(base.price);
                        setCalcBaseName(base.name);
                        setCalcBaseDays(base.days);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all duration-300",
                        calcBase === base.price
                          ? "border-primary bg-primary/15 shadow-sm"
                          : "border-border/50 bg-card/40 hover:border-primary/30"
                      )}
                    >
                      <div className="font-bold text-sm text-foreground">{base.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{base.desc}</div>
                      <div className="text-sm font-extrabold text-primary mt-2">
                        ₹{base.price.toLocaleString("en-IN")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Add-ons */}
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                  Step 2: Add Modular Components &amp; Integrations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {calculatorAddons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/40 bg-card/30 hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                              isSelected ? "bg-primary text-white" : "border border-border/60 bg-muted/30"
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-foreground">{addon.name}</div>
                            <div className="text-[11px] text-muted-foreground">+{addon.days} Day</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-primary">
                          +₹{addon.price.toLocaleString("en-IN")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA based on selection */}
              <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  Includes full source code handover, deployment, and post-launch bug warranty.
                </p>
                <Link
                  href={`/contact?service=custom-scope&scope=${encodeURIComponent(
                    calcBaseName
                  )}&estimate=${calculatedTotal}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto rounded-xl px-8 h-11 text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Hire Developer with this Scope
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* A La Carte Add-on Services ("Other Things") */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-3 px-3 py-1 text-[10px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold"
            >
              A La Carte &amp; Add-ons
            </Badge>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mb-2">
              Individual Web Development Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Need a single specific task or integration without a full project package? Book any service standalone.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {addOnServices.map((addon, i) => {
              const Icon = addon.icon;
              return (
                <AnimatedSection key={addon.title} animation="fade-up" delay={i * 80}>
                  <div className="p-6 rounded-3xl border border-border/50 bg-card/40 hover:bg-card/70 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground mb-1.5">{addon.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                        {addon.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-foreground">{addon.cost}</span>
                        <span className="text-[11px] text-muted-foreground ml-1">{addon.unit}</span>
                        <div className="text-[10px] text-primary font-medium mt-0.5">
                          Delivery: {addon.time}
                        </div>
                      </div>

                      <Link href={`/contact?addon=${encodeURIComponent(addon.title)}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs border-border/60 hover:border-primary/40 hover:bg-primary/10"
                        >
                          Book Task
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Developer Guarantees */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl text-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">100% IP &amp; Code Transfer</h3>
              <p className="text-xs text-muted-foreground">
                All repository commits, schemas, and code belong entirely to you with unrestricted commercial rights.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl text-center">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mx-auto mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">50/50 Milestone Payouts</h3>
              <p className="text-xs text-muted-foreground">
                Pay 50% upfront to reserve the sprint and the final 50% only when satisfied with the live staging demo.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl text-center">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">Zero-Bug Post-Launch Warranty</h3>
              <p className="text-xs text-muted-foreground">
                14 to 60 days of complimentary technical warranty where any unexpected defect is patched within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to know about working together, milestone deliverables, and warranties.
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            {freelanceFaqs.map((faq, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 60}>
                <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl">
                  <h3 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                    <span className="text-primary font-bold">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card text-center relative overflow-hidden shadow-2xl">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mb-3">
              Ready to Build Your Project?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Send us your project wireframe, Figma file, or requirements for an exact same-day proposal and quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">
                  Book a Free 15-min Discovery Call
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/support" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-xs border-border/60 hover:bg-card">
                  Technical Help &amp; FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
