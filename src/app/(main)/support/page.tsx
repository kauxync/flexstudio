import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo";
import { HelpCircle, BookOpen, ShieldCheck, Mail, MessageSquare, ArrowRight, Zap, Code2 } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Support & Help Center | FlexStudio",
  description:
    "Get rapid technical help, setup instructions, licensing clarification, and assistance with FlexStudio web templates and source code.",
  path: "/support",
});

const faqs = [
  {
    q: "How do I download my purchases?",
    a: "Immediately upon checkout, items are added to your User Dashboard under 'Downloads'. You can download the latest ZIP archive or access the repository anytime.",
  },
  {
    q: "What version of Node.js is required?",
    a: "All our Next.js and React templates are built with modern Node.js standards. We recommend Node.js 18.18.0 or 20.x+ (LTS). Detailed dependencies are listed in each product's README.",
  },
  {
    q: "Can I get help customizing a template?",
    a: "Yes! In addition to our comprehensive README and docs, you can hire our dedicated engineering team through our Custom Services page for tailor-made feature additions and branding.",
  },
  {
    q: "What is your response time for technical support tickets?",
    a: "Our core engineering team answers support inquiries within 24 hours on business days. Commercial and Extended license holders receive priority routing.",
  },
];

export default function SupportPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Support Center", url: "/support" },
  ]);

  const faqJsonLd = generateFAQJsonLd(
    faqs.map((f) => ({
      question: f.q,
      answer: f.a,
    }))
  );

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-4 text-[10px] uppercase tracking-wider text-primary border-primary/30">
              Developer Support
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground mb-4">
              How Can We Help You?
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground">
              Find instant setup guides, licensing answers, and direct technical assistance for all FlexStudio products.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/setup"
              className="group p-6 rounded-3xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-base text-foreground mb-1">Setup Guides</h2>
                <p className="text-xs text-muted-foreground">
                  Step-by-step instructions for environment config, OAuth setup, and deployment.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
                View Guides <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/license"
              className="group p-6 rounded-3xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-base text-foreground mb-1">Licensing Terms</h2>
                <p className="text-xs text-muted-foreground">
                  Understand your commercial, SaaS, and client rights across Personal and Extended tiers.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1">
                Read License <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/refunds"
              className="group p-6 rounded-3xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-base text-foreground mb-1">Refund Guarantee</h2>
                <p className="text-xs text-muted-foreground">
                  Learn about our 30-day technical money-back guarantee and dispute resolution.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-violet-400 gap-1">
                Refund Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/contact"
              className="group p-6 rounded-3xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-base text-foreground mb-1">Direct Support</h2>
                <p className="text-xs text-muted-foreground">
                  Need direct assistance with an order or bug? Submit a ticket to our engineering team.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
                Open Ticket <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Common Technical Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/30">
                  <h3 className="font-semibold text-sm text-foreground mb-1">{f.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
