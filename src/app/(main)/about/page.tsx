import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import {
  Sparkles,
  Zap,
  Code2,
  Users,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "About Us — Premium Web Engineering & Design Studio | FlexStudioo",
  description:
    "Learn about FlexStudioo's mission to empower engineers and creative agencies with world-class web templates, production source code, and design systems.",
  path: "/about",
});

const STATS = [
  { value: "500+", label: "Curated Templates & Starters" },
  { value: "10k+", label: "Engineers & Teams Empowered" },
  { value: "99.9%", label: "Satisfaction & Code Quality" },
  { value: "24/7", label: "Developer Priority Support" },
];

const VALUES = [
  {
    icon: Code2,
    title: "Production-Grade Code Quality",
    desc: "Every template is crafted with strict TypeScript types, modern React patterns, zero layout shifts, and clean component hierarchies.",
  },
  {
    icon: Zap,
    title: "Blazing Speed & Performance",
    desc: "We benchmark every page to achieve 95+ Lighthouse scores across performance, accessibility, best practices, and SEO.",
  },
  {
    icon: ShieldCheck,
    title: "Honest & Transparent Pricing",
    desc: "No recurring hidden subscriptions. Simple, one-time purchases that give solo founders and agencies complete freedom to build.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Developer Support",
    desc: "We are active builders ourselves. When you reach out for help with setup or custom integrations, you talk to real software engineers.",
  },
];

export default function AboutPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge
              variant="outline"
              className="mb-4 px-3.5 py-1 text-[10px] tracking-[0.2em] uppercase border-primary/30 bg-primary/5 text-primary rounded-full"
            >
              Our Mission
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Building the Future of Digital Web Marketplaces
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              FlexStudioo was founded with a singular conviction: developers and founders should spend their time solving unique business problems, not recreating boilerplate UI.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <AnimatedSection key={s.label} animation="fade-up" delay={i * 50}>
                <div className="p-6 rounded-3xl border border-border/30 bg-card/40 backdrop-blur-xl text-center">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground block mb-1">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Engineered with Integrity
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              The fundamental pillars that define every template and source codebase we publish.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} animation="fade-up" delay={i * 75}>
                <div className="p-6 rounded-3xl border border-border/30 bg-card/40 backdrop-blur-xl space-y-3 h-full">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="p-8 sm:p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-primary/5 text-center space-y-6 shadow-2xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Ready to accelerate your next project?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Explore our curated library of production-ready Next.js templates, React dashboards, and source code.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/templates">
                  <Button className="rounded-2xl px-6 h-11 text-xs font-bold bg-primary text-primary-fg hover:bg-primary-hover">
                    Explore Templates
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="rounded-2xl px-6 h-11 text-xs font-semibold">
                    Contact Our Studio
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
