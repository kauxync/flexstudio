import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Web Development Services — Website Development, UI/UX Design, SEO | FlexStudio",
  description: "Professional web development services including website development, UI/UX design, SEO optimization, and custom web applications. Expert team, fast delivery.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
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
