import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Source Code — SaaS Boilerplates, Starter Kits & Full Stack Projects | FlexStudio",
  description: "Buy production-ready source code, SaaS boilerplates, starter kits, and full-stack projects. Built with Next.js, React, Node.js, and modern technologies.",
  path: "/source-code",
});

export default function SourceCodeLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Source Code", url: "/source-code" },
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
