/**
 * Contact-form contract shared by the client (ContactForm) and the server
 * (/api/contact). Keep this file free of Node-only imports so it can be
 * bundled into the browser.
 */
import { z } from "zod";
import { services } from "@/config/site";

/** Minimum time between the form rendering and a submission we treat as human. */
export const MIN_FILL_MS = 3000;

/** Name of the honeypot field. Real browsers never fill it; naive bots do. */
export const HONEYPOT_FIELD = "website" as const;

export const URGENCY_VALUES = ["emergency", "soon", "quote"] as const;
export type Urgency = (typeof URGENCY_VALUES)[number];

/** "Not sure" is appended to the real service slugs so the select never forces a guess. */
export const NOT_SURE_SERVICE = "not-sure" as const;
export const SERVICE_CHOICES = [...services.map((s) => s.slug), NOT_SURE_SERVICE];

/**
 * Reduce any US phone format ("(631) 555-0199", "631.555.0199", "+1 631 555 0199")
 * to ten digits. Returns null when it is not a plausible US number.
 */
export function normalizeUsPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  // NANP: area code and exchange cannot start with 0 or 1.
  if (digits[0] === "0" || digits[0] === "1" || digits[3] === "0" || digits[3] === "1") return null;
  return digits;
}

/** "6315550199" → "(631) 555-0199". Anything that is not ten digits is returned untouched. */
export function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const emailCheck = z.email();

/**
 * Strip control (Cc) and format (Cf) code points - zero-width spaces, bidi
 * overrides, soft hyphens, stray line breaks - from single-line fields so
 * nothing invisible rides along into the lead email or the JSONL log.
 */
const stripInvisible = (s: string) => s.replace(/[\p{Cc}\p{Cf}]/gu, "").trim();

export const contactSchema = z.object({
  name: z
    .string({ error: "Enter your name" })
    .trim()
    .transform(stripInvisible)
    // Length checks run on the cleaned value (pipe), so the messages stay accurate.
    .pipe(z.string().min(2, "Enter your full name").max(80, "Name must be 80 characters or fewer")),
  phone: z
    .string({ error: "Enter a phone number" })
    .trim()
    .min(1, "Enter a phone number")
    .max(40, "Enter a 10-digit US phone number")
    .transform((value, ctx) => {
      const digits = normalizeUsPhone(value);
      if (!digits) {
        ctx.addIssue({ code: "custom", message: "Enter a 10-digit US phone number" });
        return z.NEVER;
      }
      return digits;
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Email must be 120 characters or fewer")
    .refine((value) => value === "" || emailCheck.safeParse(value).success, "Enter a valid email address")
    .optional()
    .transform((value) => value || undefined),
  address: z
    .string()
    .trim()
    .transform(stripInvisible)
    .pipe(z.string().max(160, "Address must be 160 characters or fewer"))
    .optional()
    .transform((value) => value || undefined),
  service: z.enum(SERVICE_CHOICES, { error: "Choose the closest match" }),
  urgency: z.enum(URGENCY_VALUES, { error: "Tell us how urgent this is" }),
  message: z
    .string({ error: "Tell us what happened" })
    .trim()
    .min(10, "Add a little more detail (at least 10 characters)")
    .max(2000, "Message must be 2000 characters or fewer"),
  consent: z.literal(true, { error: "Please confirm we may contact you about this request" }),
  /**
   * Honeypot. Validated loosely here on purpose: a filled honeypot must NOT
   * produce a 400 (that tells the bot what went wrong). A non-string or
   * oversized value is coerced to "bot" (catch) so it counts as a hit too;
   * the route calls detectBot() on any non-empty value and answers a silent 200.
   */
  [HONEYPOT_FIELD]: z.string().max(200).catch("bot").default(""),
  /** Epoch ms captured when the form mounted; the route compares it to MIN_FILL_MS. */
  startedAt: z.number({ error: "Form timing is missing" }).int().nonnegative(),
});

/** Parsed, normalised lead (server-side shape: phone is ten digits, email lowercase). */
export type ContactLead = z.infer<typeof contactSchema>;
/** What the client sends before parsing. */
export type ContactInput = z.input<typeof contactSchema>;

export interface BotSignals {
  honeypot: boolean;
  tooFast: boolean;
}

/**
 * Cheap spam heuristics. The timing check tolerates client clocks that run
 * ahead of the server (a negative delta is not flagged) so a real person with
 * a skewed clock is never silently dropped; it only catches submissions that
 * arrive within MIN_FILL_MS of the render they claim to come from.
 */
export function detectBot(lead: Pick<ContactLead, "website" | "startedAt">, now = Date.now()): BotSignals {
  const elapsed = now - lead.startedAt;
  return {
    honeypot: lead.website.trim() !== "",
    tooFast: elapsed >= 0 && elapsed < MIN_FILL_MS,
  };
}

export const URGENCY_LABELS: Record<Urgency, string> = {
  emergency: "Emergency - happening now",
  soon: "Needs attention soon",
  quote: "Estimate / question",
};
