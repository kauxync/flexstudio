import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { Features } from "@/components/sections/features";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";
import { CTA } from "@/components/sections/cta";
import { generatePageMetadata, generateFAQJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "FlexStudioo — Premium Digital Marketplace & Web Development Services",
  description: "Buy high-quality web templates, UI kits, production source code, and hire expert freelance full-stack web development services. Built with Next.js 16, React, and Tailwind CSS.",
  path: "/",
});

const faqs = [
  { question: "What digital products and services does FlexStudioo offer?", answer: "FlexStudioo offers premium web templates, source code, SaaS boilerplates, and custom freelance full-stack web development services. All products and services are built with Next.js, React, TypeScript, and Tailwind CSS." },
  { question: "Can I hire a developer for a custom project or MVP?", answer: "Yes! We offer transparent freelance web development packages starting from ₹4,999 for landing pages and ₹14,999 for full-stack web apps, as well as hourly tasks at ₹999/hr." },
  { question: "Do I get full source code and intellectual property ownership?", answer: "Yes, 100%. Upon project completion, all source code, database schemas, and assets are transferred directly to your organization's GitHub repository." },
  { question: "Do template purchases include lifetime updates?", answer: "Yes, all products on FlexStudioo come with perpetual licenses and lifetime updates at no extra cost." },
];

export default function Home() {
  const faqJsonLd = generateFAQJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Categories />
      <Features />
      <Services />
      <Pricing />
      <Testimonials />
      <Newsletter />
      <CTA />
    </>
  );
}
