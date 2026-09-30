import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | FlexStudio",
  description:
    "FlexStudio terms of service governing digital purchases, template licensing, user obligations, and intellectual property.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" },
  ]);

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="pt-28 pb-10 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-4 text-[10px] uppercase tracking-wider text-primary border-primary/30">
              User Agreement
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Terms of Service
            </h1>
            <p className="text-xs text-muted-foreground">
              Last updated: September 2026 · Effective immediately
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By browsing, registering, or acquiring digital assets on FlexStudio, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                2. Digital Goods License & Ownership
              </h2>
              <p>
                All web templates, source code packages, UI components, and Figma files available on FlexStudio remain the intellectual property of FlexStudio and its respective authors. When you purchase an item, you are granted a non-exclusive, non-transferable license based on the specific tier purchased (Personal, Commercial, or Extended).
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                3. Prohibition on Resale & Redistribution
              </h2>
              <p>
                You may not sub-license, resell, lease, donate, or distribute the raw template or source code as a standalone stock item or theme, whether modified or unmodified. You may only distribute the codebase when compiled into a distinct final client product or SaaS application.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                4. Payments and Deliveries
              </h2>
              <p>
                Prices are displayed in Indian Rupees (INR) or localized currencies. Delivery of products is digital and instantaneous upon transaction clearance. You will immediately receive access to download archives and unique cryptographic license keys in your dashboard.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                5. Limitation of Liability
              </h2>
              <p>
                In no event shall FlexStudio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the digital materials provided on this platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
