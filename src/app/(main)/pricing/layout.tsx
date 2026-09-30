import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Freelance Web Development Pricing & Hourly Rates | FlexStudio",
  description:
    "Transparent freelance web development rates: Starter MVP from ₹4,999, Full-Stack Next.js Web Apps from ₹14,999, and hourly tasks at ₹999/hr. Milestone payments and 100% code ownership.",
  path: "/pricing",
});

const pricingFaqs = [
  {
    question: "How do milestone payments and escrow work for freelance web development?",
    answer: "We operate on a 50/50 milestone structure: 50% deposit to initiate the development sprint, and the remaining 50% upon final staging review and approval before full GitHub repository handover.",
  },
  {
    question: "Do I get full ownership of the source code and intellectual property?",
    answer: "Yes, 100%. All repository commits, database schemas, and documentation created for your project belong entirely to you with unrestricted commercial rights upon project completion.",
  },
  {
    question: "What is your hourly rate for quick bug fixes or feature additions?",
    answer: "Our ad-hoc hourly rate is ₹999/hour (~$12/hr) with a minimum 2-hour engagement for quick bug fixes, API integrations, and Figma slicing.",
  },
  {
    question: "What technologies and frameworks do you use for development?",
    answer: "We specialize in modern full-stack web engineering: Next.js 16 (App Router), TypeScript, Tailwind CSS, PostgreSQL (Neon/Supabase), Prisma ORM, NextAuth, Cashfree, and Stripe.",
  },
  {
    question: "Is there a warranty after the website or web app goes live?",
    answer: "Yes, every fixed-scope project includes a complimentary post-launch bug warranty (14 to 60 days) where any unexpected defects are resolved within 24 hours at no additional cost.",
  },
];

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" },
  ]);
  const faqJsonLd = generateFAQJsonLd(pricingFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
