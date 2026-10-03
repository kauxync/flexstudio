export interface LighthouseScores {
  enabled: boolean;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fcp?: string;
  lcp?: string;
  cls?: string;
}

export const DEFAULT_LIGHTHOUSE_SCORES: LighthouseScores = {
  enabled: true,
  performance: 99,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
  fcp: "0.4s",
  lcp: "0.8s",
  cls: "0.00",
};

/**
 * Extracts Lighthouse benchmark metadata embedded in product description.
 * Leaves the pure Markdown description clean for display/editing.
 */
export function extractLighthouseScores(rawDescription?: string): {
  scores: LighthouseScores;
  cleanDescription: string;
} {
  if (!rawDescription) {
    return { scores: DEFAULT_LIGHTHOUSE_SCORES, cleanDescription: "" };
  }

  const match = rawDescription.match(/<!--lighthouse:([\s\S]*?)-->/);
  if (!match) {
    return { scores: DEFAULT_LIGHTHOUSE_SCORES, cleanDescription: rawDescription.trim() };
  }

  try {
    const parsed = JSON.parse(match[1]);
    const scores: LighthouseScores = {
      enabled: parsed.enabled !== false,
      performance: typeof parsed.performance === "number" ? parsed.performance : 99,
      accessibility: typeof parsed.accessibility === "number" ? parsed.accessibility : 100,
      bestPractices: typeof parsed.bestPractices === "number" ? parsed.bestPractices : 100,
      seo: typeof parsed.seo === "number" ? parsed.seo : 100,
      fcp: parsed.fcp || "0.4s",
      lcp: parsed.lcp || "0.8s",
      cls: parsed.cls || "0.00",
    };
    const cleanDescription = rawDescription.replace(/<!--lighthouse:[\s\S]*?-->/g, "").trim();
    return { scores, cleanDescription };
  } catch {
    return { scores: DEFAULT_LIGHTHOUSE_SCORES, cleanDescription: rawDescription.trim() };
  }
}

/**
 * Embeds Lighthouse benchmark metadata safely inside product description as an HTML comment.
 * Zero database migration required, preserved across all database queries.
 */
export function injectLighthouseScores(cleanDescription: string, scores: LighthouseScores): string {
  const stripped = cleanDescription.replace(/<!--lighthouse:[\s\S]*?-->/g, "").trim();
  const comment = `<!--lighthouse:${JSON.stringify(scores)}-->`;
  return stripped ? `${stripped}\n\n${comment}` : comment;
}
