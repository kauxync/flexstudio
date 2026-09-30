import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { Check, X, Shield, Sparkles, Building2, User } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Commercial & Extended Licensing | FlexStudio",
  description:
    "FlexStudio digital licensing explained. Compare Personal, Commercial, and Extended licenses for web templates, UI kits, and production source code.",
  path: "/license",
});

export default function LicensePage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "License Agreement", url: "/license" },
  ]);

  const tiers = [
    {
      name: "Personal License",
      icon: User,
      badge: "Indie & Learning",
      description: "Ideal for solo developers, students, and personal non-commercial projects.",
      features: [
        { text: "1 Personal Project or Website", allowed: true },
        { text: "Full Source Code Access & Modification", allowed: true },
        { text: "Lifetime Updates & Bug Fixes", allowed: true },
        { text: "Community Discord Support", allowed: true },
        { text: "Commercial Client Projects", allowed: false },
        { text: "Monetized SaaS or Web Application", allowed: false },
        { text: "Reselling / Sub-licensing Template", allowed: false },
      ],
    },
    {
      name: "Commercial License",
      icon: Sparkles,
      badge: "Most Popular",
      description: "For freelance developers and startups deploying revenue-generating client work or single SaaS.",
      popular: true,
      features: [
        { text: "1 Commercial Project or Client Website", allowed: true },
        { text: "Commercial SaaS (Charge end users)", allowed: true },
        { text: "Full Source Code Access & Customization", allowed: true },
        { text: "Lifetime Updates & Version Bumps", allowed: true },
        { text: "Priority Email Technical Support (24h SLA)", allowed: true },
        { text: "Unlimited Client Websites", allowed: false },
        { text: "Reselling Template or Codebase Standalone", allowed: false },
      ],
    },
    {
      name: "Extended / Agency",
      icon: Building2,
      badge: "Agencies & Enterprise",
      description: "For digital agencies, dev shops, and enterprises shipping multiple client solutions.",
      features: [
        { text: "Unlimited Client Projects & Deliverables", allowed: true },
        { text: "Multiple Commercial SaaS Deployments", allowed: true },
        { text: "Full Source Code Modification & Git Sync", allowed: true },
        { text: "Lifetime Updates for Entire Team", allowed: true },
        { text: "VIP Dedicated Support & Private Discord Channel", allowed: true },
        { text: "Custom Architecture Review on Request", allowed: true },
        { text: "Standalone Resale as Competing Template", allowed: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-4 text-[10px] uppercase tracking-wider text-primary border-primary/30">
              Clear & Simple Rights
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground mb-4">
              Digital Licensing Agreement
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground">
              Straightforward, developer-friendly licenses designed to give you peace of mind while building products, client deliverables, and SaaS applications.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    tier.popular
                      ? "border-2 border-primary bg-card/90 shadow-2xl shadow-primary/10"
                      : "border border-border/50 bg-card/50 backdrop-blur-xl"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-indigo-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Recommended
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {tier.badge}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold font-serif text-foreground mb-2">
                      {tier.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="h-px bg-border/40 mb-6" />

                    <ul className="space-y-3 text-xs">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          {f.allowed ? (
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              f.allowed ? "text-foreground/90 font-medium" : "text-muted-foreground/60 line-through"
                            }
                          >
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/templates"
                      className={`block w-full py-2.5 px-4 text-center rounded-xl text-xs font-semibold transition-all ${
                        tier.popular
                          ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                          : "bg-muted/60 text-foreground hover:bg-muted"
                      }`}
                    >
                      Browse Eligible Items
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common FAQ / Questions */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-6 text-xs sm:text-sm text-muted-foreground">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Frequently Asked Licensing Questions
            </h2>

            <div>
              <h3 className="font-bold text-foreground mb-1">
                Can I build a commercial SaaS that charges end users subscription fees?
              </h3>
              <p>
                Yes! With the <strong>Commercial License</strong> or <strong>Extended License</strong>, you are completely authorized to deploy SaaS applications, web apps, and eCommerce portals that charge your end users subscription or usage fees.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-1">
                Can I resell the template or UI kit on another marketplace?
              </h3>
              <p>
                No. You cannot redistribute, re-license, open-source, or resell any FlexStudioo template or source code package as a standalone template or UI kit, even if modified.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-1">
                Are licenses perpetual or subscription-based?
              </h3>
              <p>
                All template and source code purchases grant <strong>perpetual, lifetime access</strong>. There are no recurring fees or annual renewal requirements for the code you download.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-1">
                Need enterprise licensing or bespoke agreement?
              </h3>
              <p>
                For custom legal riders, bulk seat licenses, or enterprise white-labeling, please contact our team via{" "}
                <Link href="/contact" className="text-primary hover:underline font-semibold">
                  flexstudio@kauxync.in
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
