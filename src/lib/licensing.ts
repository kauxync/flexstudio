export type LicenseType = "personal" | "commercial" | "extended";

export interface LicenseTier {
  id: LicenseType;
  name: string;
  badge: string;
  multiplier: number;
  description: string;
  shortDesc: string;
  rights: string[];
  restrictions: string[];
  support: string;
  updates: string;
}

export const LICENSE_TIERS: Record<LicenseType, LicenseTier> = {
  personal: {
    id: "personal",
    name: "Personal License",
    badge: "1 Project",
    multiplier: 1.0,
    description: "Ideal for solo developers, freelancers, students, or personal side projects.",
    shortDesc: "Single personal project, non-commercial use",
    rights: [
      "Use for 1 personal project",
      "Full source code access",
      "6 months of community support",
      "Lifetime updates for this version",
    ],
    restrictions: [
      "No client work or resale",
      "Cannot use in paid commercial SaaS",
    ],
    support: "6 Months",
    updates: "Lifetime",
  },
  commercial: {
    id: "commercial",
    name: "Commercial License",
    badge: "1 Client Site",
    multiplier: 1.6,
    description: "Best for freelance client projects, commercial websites, and small businesses.",
    shortDesc: "Single commercial client project, monetization allowed",
    rights: [
      "Use for 1 commercial or client site",
      "Monetized website / product rights",
      "Full source code & Figma assets",
      "12 months of priority developer support",
      "Lifetime updates",
    ],
    restrictions: [
      "Cannot redistribute as a template or theme",
    ],
    support: "12 Months Priority",
    updates: "Lifetime",
  },
  extended: {
    id: "extended",
    name: "Extended / Agency",
    badge: "Unlimited Sites",
    multiplier: 3.2,
    description: "For agencies, software teams, and SaaS builders requiring unlimited installations.",
    shortDesc: "Unlimited client projects, SaaS end-products, resale rights",
    rights: [
      "Unlimited personal & commercial projects",
      "Use in end-product SaaS with paying users",
      "Multi-developer team usage rights",
      "Lifetime VIP priority support & direct author access",
      "Priority feature requests & early beta releases",
    ],
    restrictions: [
      "Cannot redistribute source code as standalone stock asset",
    ],
    support: "Lifetime VIP",
    updates: "Lifetime",
  },
};

/**
 * Calculates license price based on base price and tier
 */
export function calculateLicensePrice(basePrice: number, license: LicenseType = "personal"): number {
  const tier = LICENSE_TIERS[license] || LICENSE_TIERS.personal;
  return Math.round(basePrice * tier.multiplier);
}

/**
 * Generates an authentic cryptographically unique license key:
 * Format: FLEX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(prefix = "FLEX"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = (len = 4) => {
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
}
