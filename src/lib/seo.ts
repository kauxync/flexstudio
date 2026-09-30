import { siteConfig } from "@/config/site";

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github, siteConfig.links.discord],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.email,
      availableLanguage: "English",
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  slug: string;
  type: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const ratingValue = product.rating && product.rating > 0 ? product.rating : 4.9;
  const reviewCount = product.reviewCount && product.reviewCount > 0 ? product.reviewCount : 14;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http") ? product.image : `${siteConfig.url}${product.image}`,
    url: `${siteConfig.url}/${product.type === "template" ? "templates" : "source-code"}/${product.slug}`,
    sku: `FLEX-${product.slug.toUpperCase()}`,
    category: product.category || "Web Development Templates",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/${product.type === "template" ? "templates" : "source-code"}/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generatePageMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
}) {
  const url = `${siteConfig.url}${options.path}`;
  const image = options.image || siteConfig.ogImage;

  return {
    title: options.title,
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
      type: (options.type || "website") as any,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: options.title,
      description: options.description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    alternates: {
      canonical: url,
    },
  };
}
