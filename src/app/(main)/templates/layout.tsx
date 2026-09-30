import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Premium Web Templates — Next.js, React, Vue, Tailwind CSS | FlexStudio",
  description: "Browse 500+ premium web templates, UI kits, and starter kits. Built with Next.js, React, Vue.js, Tailwind CSS, and TypeScript. Lifetime updates, commercial licenses, and fast support.",
  path: "/templates",
});

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Templates", url: "/templates" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
