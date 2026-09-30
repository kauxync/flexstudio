import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/templates`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/source-code`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/setup`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/refunds`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/license`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Dynamic template pages
  let templatePages: MetadataRoute.Sitemap = [];
  try {
    const templates = await prisma.product.findMany({
      where: { type: "template", status: "active" },
      select: { slug: true, updatedAt: true },
    });
    templatePages = templates.map((t) => ({
      url: `${BASE_URL}/templates/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  // Dynamic source code pages
  let sourceCodePages: MetadataRoute.Sitemap = [];
  try {
    const sourceCodes = await prisma.product.findMany({
      where: { type: "source-code", status: "active" },
      select: { slug: true, updatedAt: true },
    });
    sourceCodePages = sourceCodes.map((s) => ({
      url: `${BASE_URL}/source-code/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  return [...staticPages, ...templatePages, ...sourceCodePages];
}
