import type { Metadata } from "next";
import { generateBreadcrumbJsonLd, generateProductJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { title: true, description: true, shortDesc: true, price: true, thumbnail: true, type: true, rating: true, reviewCount: true, category: true },
    });
    if (!product) return { title: "Product Not Found" };
    const pageTitle = `Buy ${product.title} — ₹${product.price} | FlexStudio`;
    const pageDesc = product.shortDesc || product.description?.slice(0, 160) || `Purchase ${product.title} on FlexStudio.`;
    return {
      title: pageTitle,
      description: pageDesc,
      openGraph: { title: pageTitle, description: pageDesc, url: `${siteConfig.url}/source-code/${slug}`, type: "website", images: [{ url: product.thumbnail || siteConfig.ogImage, width: 1200, height: 630, alt: product.title }] },
      twitter: { card: "summary_large_image", title: pageTitle, description: pageDesc },
      alternates: { canonical: `${siteConfig.url}/source-code/${slug}` },
    };
  } catch { return { title: "Source Code" }; }
}

export default async function SourceCodeSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let productJsonLd: any = null;
  let breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Source Code", url: "/source-code" },
    { name: "Product", url: `/source-code/${slug}` },
  ];

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        shortDesc: true,
        price: true,
        thumbnail: true,
        type: true,
        category: true,
        rating: true,
        reviewCount: true,
      },
    });

    if (product) {
      breadcrumbItems[2].name = product.title;
      productJsonLd = generateProductJsonLd({
        name: product.title,
        description: product.shortDesc || product.description,
        price: product.price,
        currency: "INR",
        image: product.thumbnail,
        slug,
        type: "source-code",
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
      });
    }
  } catch {}

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
