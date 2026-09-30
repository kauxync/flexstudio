import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "OAuth & Database Setup Guide | FlexStudio Docs",
  description:
    "Comprehensive setup guide for FlexStudio templates: configure GitHub & Google OAuth, PostgreSQL Neon database, NextAuth, and Stripe keys.",
  path: "/setup",
});

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Setup Guide", url: "/setup" },
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
