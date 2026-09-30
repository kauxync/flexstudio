"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Newsletter } from "@/components/sections/newsletter";
import {
  Code2,
  Palette,
  Search,
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  Clock,
  Headphones,
  Calculator,
  Sparkles,
} from "lucide-react";

const services = [
  {
    id: "development",
    icon: <Code2 className="w-6 h-6" />,
    title: "Website & MVP Development",
    description: "Custom websites and full-stack web applications built with modern frameworks, optimized for speed and conversion.",
    longDescription: "We build fast, scalable, and beautiful websites using Next.js 16, TypeScript, and Tailwind CSS. From high-converting landing pages to complex SaaS applications, we deliver clean architecture and pixel-perfect results.",
    features: [
      "Custom Next.js 16 (App Router) & React",
      "Responsive design across all devices",
      "Auth (NextAuth / Auth.js) & Database (PostgreSQL/Neon)",
      "Payment gateway integration (Cashfree / Stripe)",
      "REST & GraphQL API integrations",
      "95+ Google Lighthouse speed optimization",
    ],
    price: "From ₹4,999 (~$60)",
    timeline: "3–14 days",
    gradient: "from-primary/10 to-indigo-500/10",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "design",
    icon: <Palette className="w-6 h-6" />,
    title: "UI/UX & Design Systems",
    description: "Beautiful, user-centered Figma designs converted into accessible, component-driven React & Tailwind frontend code.",
    longDescription: "We craft intuitive, visually stunning interfaces that users love. We focus on usability, design tokens, accessibility, and brand consistency.",
    features: [
      "Figma to pixel-perfect React/Tailwind code",
      "Visual design systems & component libraries",
      "Interactive prototypes & micro-interactions",
      "Dark mode & theme switcher setup",
      "Responsive layout engineering",
      "Usability & conversion rate testing",
    ],
    price: "From ₹2,499 (~$30)",
    timeline: "1–2 weeks",
    gradient: "from-indigo-500/10 to-purple-500/10",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
  {
    id: "seo",
    icon: <Search className="w-6 h-6" />,
    title: "Technical SEO & Speed Optimization",
    description: "Rank higher on Google with proven strategies, Core Web Vitals optimization, and Rich JSON-LD Schemas.",
    longDescription: "We optimize your web app's architecture for maximum visibility and organic traffic through structured data, crawl budget tuning, and sub-second load times.",
    features: [
      "Core Web Vitals & 95+ Lighthouse audit",
      "Schema.org JSON-LD (Product, FAQ, Organization)",
      "Sitemap.xml & robots.txt crawl budget tuning",
      "OpenGraph dynamic social card generation",
      "Clean semantic HTML5 structure",
      "Zero-fluff audit report & actionable fixes",
    ],
    price: "From ₹1,499 (~$18)",
    timeline: "1–3 days",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery & Scope",
    description: "We discuss your product requirements, target audience, and feature priorities to formulate a precise scope and milestone timeline.",
  },
  {
    step: "02",
    title: "Architecture & Sprints",
    description: "We define the database schema, frontend components, and cloud infrastructure for a scalable implementation.",
  },
  {
    step: "03",
    title: "Design & Slicing",
    description: "We design or convert Figma screens into high-performance, mobile-first, semantic React and Tailwind code.",
  },
  {
    step: "04",
    title: "Full-Stack Development",
    description: "We implement APIs, database queries, payment gateways, and authentication with robust TypeScript typing.",
  },
  {
    step: "05",
    title: "Staging Demo & Testing",
    description: "We deploy to a private live staging URL for end-to-end user testing, bug fixes, and your final milestone approval.",
  },
  {
    step: "06",
    title: "Launch & IP Handover",
    description: "We deploy to production, transfer the GitHub repository to your organization, and initiate your complimentary warranty.",
  },
];

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24h", label: "Support SLA" },
];

const whyChooseUs = [
  { icon: <Zap className="w-5 h-5 text-primary" />, title: "Rapid Turnaround", description: "Clear milestone deadlines with fast sprints from 3 to 14 days." },
  { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, title: "100% Code & IP Ownership", description: "You own every single line of code, database schema, and Git commit." },
  { icon: <Clock className="w-5 h-5 text-indigo-400" />, title: "Transparent Pricing", description: "Predictable milestone costs with zero surprise fees or agency markups." },
  { icon: <Headphones className="w-5 h-5 text-violet-400" />, title: "Post-Launch Warranty", description: "14 to 60 days of complimentary bug-fix coverage for complete peace of mind." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-[11px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold">
              Senior Web Engineering
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              Bespoke Web Development Services
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto mb-8">
              Hire an expert full-stack developer to craft fast, scalable, and high-converting digital products.
            </p>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl">
                  <div className="text-2xl font-extrabold text-primary font-serif">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Core Development Services
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Comprehensive full-stack engineering tailored to startups, agencies, and founders.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} animation="fade-up" delay={i * 80}>
                <div id={service.id} className="group relative p-8 rounded-3xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between backdrop-blur-xl">
                  <div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.iconBg} ${service.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {service.longDescription}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0 stroke-[2.5]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-border/30 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-foreground">{service.price}</span>
                      <span className="text-xs text-muted-foreground ml-2">({service.timeline})</span>
                    </div>
                    <Link
                      href={`/contact?service=${service.id}`}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator Callout Banner */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Want an Instant Project Estimate?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use our interactive scope calculator to select pages, payment gateways, auth, and AI features to see live transparent pricing.
                </p>
              </div>
            </div>
            <Link href="/pricing" className="shrink-0">
              <Button size="lg" className="rounded-xl px-6 h-11 text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20">
                Open Pricing &amp; Scope Calculator
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-[11px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold">
              Step-by-Step Flow
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              How We Deliver Your Project
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              A transparent, milestone-driven process with zero guesswork.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((step, i) => (
              <AnimatedSection key={step.step} animation="fade-up" delay={i * 80}>
                <div className="relative p-7 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl font-extrabold text-primary/30 mb-3 font-serif">{step.step}</div>
                    <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Why Work With Us
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Developer-first values engineered for speed, reliability, and code excellence.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 80}>
                <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl h-full flex flex-col items-center text-center">
                  <div className="p-3 rounded-2xl bg-muted/40 mb-4">{item.icon}</div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card text-center relative overflow-hidden shadow-2xl">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mb-3">
              Ready to Discuss Your Project?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Send us your project wireframe, Figma file, or requirements for an exact same-day proposal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">
                  Book a Free 15-min Discovery Call
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-xs border-border/60 hover:bg-card">
                  View Pricing Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
