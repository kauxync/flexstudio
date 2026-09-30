import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...generatePageMetadata({ title: "Search — Find Templates & Source Code | FlexStudio", description: "Search across all FlexStudio products, templates, and source code. Find exactly what you need for your next project.", path: "/search" }),
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
