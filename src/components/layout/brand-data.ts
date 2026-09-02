import { siteConfig } from "@/config/site";

type CredentialKey = (typeof siteConfig.credentials)[number]["key"];

/** Short badge/strip labels for credentials that live in siteConfig. */
export const credentialShortLabels: Partial<Record<CredentialKey, string>> = {
  iicrc: "IICRC Certified",
  "nys-mold": "NYS Licensed Mold Contractor",
  insured: "Licensed & Insured",
};

/** Credentials shown as pills (in this order) wherever the chrome needs them. */
export const badgeCredentials = (["iicrc", "nys-mold", "insured"] as const)
  .map((key) => {
    const credential = siteConfig.credentials.find((c) => c.key === key);
    return credential ? { key, label: credentialShortLabels[key] ?? credential.label, detail: credential.detail } : null;
  })
  .filter((c): c is NonNullable<typeof c> => c !== null);

/**
 * "NYS DOL Mold Remediation Contractor License #MRC-00000", derived from the
 * nys-mold credential detail. Falls back to the credential label when no number
 * is present in the detail text.
 */
export function getMoldLicenseLine() {
  const mold = siteConfig.credentials.find((c) => c.key === "nys-mold");
  if (!mold) return null;
  // The hash is required (and the match is case-sensitive) so "Licensed by…" never matches.
  const match = mold.detail.match(/License\s*#\s*([A-Z0-9-]+)/);
  return match ? `NYS DOL Mold Remediation Contractor License #${match[1]}` : mold.label;
}
