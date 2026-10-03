import crypto from "crypto";

/**
 * Generate a clean, unique 8-character alphanumeric code for a template/product.
 * Example output: "FLX4B8C1" or "9A7F2D1E"
 */
export function generateTemplateCode(prefix: string = "FS"): string {
  // 6 random hex characters + prefix or 8 alphanumeric characters
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return randomHex.slice(0, 8);
}

/**
 * Validates whether a string is a valid 8-character template code.
 */
export function isValidTemplateCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/i.test(code);
}
