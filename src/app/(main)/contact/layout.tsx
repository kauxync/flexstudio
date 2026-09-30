import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Support & Engineering Studio | FlexStudioo",
  description:
    "Get in touch with the FlexStudioo engineering team. Fast developer support, custom template development inquiries, and enterprise licensing assistance.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
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
