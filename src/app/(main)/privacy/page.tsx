import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | FlexStudio",
  description:
    "FlexStudio privacy policy explaining how we collect, store, and protect user data in compliance with modern data protection regulations.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
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
              Legal & Compliance
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Privacy Policy
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
                1. Information We Collect
              </h2>
              <p>
                When you create an account, purchase digital assets, or interact with FlexStudio, we collect information necessary to fulfill our services:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Personal identity info (name, email address, optional contact number).</li>
                <li>Payment details: All sensitive payment data (card numbers, UPI credentials) are tokenized and processed exclusively by PCI-DSS Level 1 certified gateways (Cashfree). FlexStudio does not store raw credit card numbers.</li>
                <li>Technical logs: Device type, browser user-agent, and anonymized diagnostic data to improve service reliability.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                2. How We Use Your Data
              </h2>
              <p>
                Your data is utilized exclusively for generating your license keys, dispatching digital download links, notifying you of critical product updates, and providing developer support. We never sell or license your personal information to third-party data brokers.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                3. Cookies and Session State
              </h2>
              <p>
                We use secure, essential cookies to maintain user authentication sessions (NextAuth) and shopping cart persistence across browser tabs. You may disable cookies in your browser settings, though doing so will disable shopping cart and dashboard capabilities.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                4. Data Protection & Security
              </h2>
              <p>
                All data transmission across FlexStudio is protected with modern TLS 1.3 encryption. Database access is governed through secure connection pooling with least-privilege role separation.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">
                5. Contacting the Data Protection Officer
              </h2>
              <p>
                If you have inquiries concerning your personal information, or wish to request data deletion, please contact our compliance team at <span className="font-mono text-primary font-semibold">flexstudio@kauxync.in</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
