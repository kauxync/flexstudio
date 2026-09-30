import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { CheckCircle2, AlertTriangle, Clock, RefreshCw, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Refund Policy | FlexStudio Guarantee",
  description:
    "FlexStudio 30-day digital goods money-back policy. Learn our refund eligibility criteria, dispute resolution, and buyer protection guidelines.",
  path: "/refunds",
});

export default function RefundsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Refund Policy", url: "/refunds" },
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
              Buyer Protection
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Refund & Money-Back Policy
            </h1>
            <p className="text-xs text-muted-foreground">
              Last updated: September 2026 · Committed to developer trust & satisfaction
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Highlight Banner */}
          <div className="mb-8 p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">
                30-Day Technical Quality Guarantee
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                If a template or source code package has critical technical defects or doesn&apos;t match its live demo specifications, and our engineering team cannot resolve it within 72 hours, you are entitled to a full 100% refund.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {/* 1. Overview */}
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                1. Nature of Digital Goods
              </h2>
              <p>
                Due to the immediate digital delivery and irrevocable nature of downloadable software, source code, and design files (ZIP archives, Git repositories, Figma files), transactions are generally final once the download link or repository access is accessed. However, we uphold developer-first standards and honor refunds under the clear eligibility criteria detailed below.
              </p>
            </div>

            {/* 2. Eligible scenarios */}
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                2. When You Are Eligible for a Full Refund
              </h2>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Defective or Broken Code:</strong> The template contains fatal build errors, broken critical dependencies, or cannot compile under the documented Node.js / environment prerequisites, and our support team cannot provide a fix within 72 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Material Misrepresentation:</strong> The delivered source code is fundamentally different from the live preview or product description (e.g., advertised full backend integration is missing or dummy).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Accidental Duplicate Purchase:</strong> You inadvertently purchased the exact same template or source code twice within a 48-hour window on the same user account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Non-Delivery of Access:</strong> Payment was successfully charged, but automated access/download was not provisioned and could not be restored by support within 24 hours.</span>
                </li>
              </ul>
            </div>

            {/* 3. Ineligible scenarios */}
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                3. When Refunds Cannot Be Granted
              </h2>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✗</span>
                  <span><strong>Change of Mind:</strong> Requesting a refund simply because you decided not to pursue your project or no longer need the product after downloading it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✗</span>
                  <span><strong>Missing Technical Prerequisites:</strong> Inability to configure or customize the code due to a lack of basic familiarity with the advertised technology stack (e.g. Next.js, TypeScript, PostgreSQL, or Docker).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✗</span>
                  <span><strong>Third-Party Service Restrictions:</strong> Inability to acquire external API credentials (e.g. OpenAI API limits, Stripe account verification delays in your country) not within FlexStudio control.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✗</span>
                  <span><strong>Custom Development Services:</strong> Tailored agency or bespoke engineering services that have already been contracted, scheduled, or delivered.</span>
                </li>
              </ul>
            </div>

            {/* 4. How to Request */}
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                4. Refund Claim Procedure
              </h2>
              <p className="mb-3">
                To submit a claim under our 30-day technical guarantee:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Locate your <strong>Order ID</strong> from your <Link href="/dashboard/orders" className="text-primary hover:underline">User Dashboard</Link> or payment confirmation email.</li>
                <li>Submit a request via our <Link href="/contact" className="text-primary hover:underline">Contact Center</Link> or email directly to <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">flexstudio@kauxync.in</code>.</li>
                <li>Include your environment details (Node version, OS) and terminal screenshots/logs demonstrating the technical defect.</li>
                <li>Our engineering team will review the ticket within 24 business hours. If unresolvable within 72 hours, the refund is initiated automatically.</li>
              </ol>
            </div>

            {/* 5. Processing & Payout */}
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                5. Payment Processing Timelines
              </h2>
              <p>
                Approved refunds are processed back to the original method of payment (Stripe, Credit Card, or Razorpay). Payouts typically appear on your billing statement within <strong>3 to 7 business days</strong> depending on your financial institution. Once refunded, your download license key and repository access are permanently revoked.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
