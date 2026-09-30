"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Code2, Palette, Search, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Website & MVP Development",
    description: "High-performance full-stack web applications and conversion-focused landing pages built with Next.js 16 and Tailwind CSS.",
    icon: <Code2 className="w-5 h-5 text-primary" />,
    price: "From ₹4,999",
    timeline: "3–14 days",
  },
  {
    title: "UI/UX & Design Systems",
    description: "Pixel-perfect Figma designs converted into accessible, component-driven React & Tailwind frontend architectures.",
    icon: <Palette className="w-5 h-5 text-indigo-400" />,
    price: "From ₹2,499",
    timeline: "1–2 weeks",
  },
  {
    title: "Technical SEO & Speed Tuning",
    description: "95+ Google Lighthouse Core Web Vitals score, Rich Schema JSON-LD, semantic markup, and crawl optimization.",
    icon: <Search className="w-5 h-5 text-emerald-400" />,
    price: "From ₹1,499",
    timeline: "1–3 days",
  },
];

export function Services() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 text-[11px] uppercase tracking-wider border-primary/30 bg-primary/10 text-primary rounded-full font-semibold"
          >
            Engineering Services
          </Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Bespoke Web Development
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Direct collaboration with a senior full-stack developer to bring your digital vision to production.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} animation="fade-up" delay={i * 100}>
              <div className="group relative p-7 rounded-3xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between backdrop-blur-xl">
                {/* Number Watermark */}
                <div className="absolute top-4 right-5 text-5xl font-black text-foreground/[0.03] select-none group-hover:text-primary/[0.08] transition-colors duration-500 font-serif">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div>
                  {/* Icon */}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 mb-5">
                    {service.icon}
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-foreground">{service.price}</span>
                    <span className="text-[11px] text-muted-foreground/70">{service.timeline}</span>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group/link"
                  >
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-border/50 hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold">
              View Detailed Rates &amp; Calculator
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
