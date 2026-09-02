/**
 * POST /api/contact - lead intake.
 *
 * Order of operations: content-type and origin guard -> streaming size guard
 * -> JSON parse -> client IP -> rate limit -> Zod validation -> JSONL backup
 * (always) -> bot heuristics -> email (clean submissions only).
 * Internal errors are logged, never echoed to the client. A real lead gets the
 * same `{ ok: true }` body as a suspected bot, so the response reveals nothing.
 */
import { z } from "zod";
import { contactSchema, detectBot } from "@/lib/contact-schema";
import { appendLead, type LeadMeta } from "@/lib/leads";
import { sendLeadEmail } from "@/lib/mail";
import { limit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 10 * 1024;

const BASE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { ...BASE_HEADERS, ...extraHeaders } });
}

/**
 * Nginx (deploy/nginx.conf.template) sets X-Real-IP from $remote_addr, which
 * a client cannot forge. X-Forwarded-For's first entry is client-supplied when
 * the proxy appends rather than replaces, so it is only the second choice.
 */
function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const forwarded = req.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first.slice(0, 64);
  return "unknown";
}

type BodyRead = { ok: true; text: string } | { ok: false; status: 400 | 413 };

/**
 * Read the body as UTF-8 without ever buffering more than `maxBytes`.
 * Content-Length is advisory (a chunked upload has none), so the cap is
 * enforced on the bytes actually received and the stream is cancelled the
 * moment it is exceeded.
 */
async function readBodyCapped(req: Request, maxBytes: number): Promise<BodyRead> {
  const reader = req.body?.getReader();
  if (!reader) return { ok: true, text: "" };

  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400 };
  }
  return { ok: true, text: Buffer.concat(chunks).toString("utf8") };
}

export async function GET() {
  return json({ ok: false, error: "Method not allowed. Use POST." }, 405, { Allow: "POST" });
}

export async function POST(req: Request) {
  try {
    // Exact MIME essence: "application/json" (a charset parameter is fine),
    // nothing looser such as "text/json" or "+json" suffixes.
    const essence = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (essence !== "application/json") {
      return json({ ok: false, error: "Send the request as application/json." }, 415);
    }

    // Browsers stamp Sec-Fetch-Site on every request. Only our own pages
    // ("same-origin") or a direct user action ("none") may post here; a page on
    // another site gets a 403. Non-browser clients omit the header entirely.
    const fetchSite = req.headers.get("sec-fetch-site")?.trim().toLowerCase();
    if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
      return json({ ok: false, error: "Cross-site submissions are not accepted." }, 403);
    }

    const declared = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return json({ ok: false, error: "Request is too large." }, 413);
    }

    const read = await readBodyCapped(req, MAX_BODY_BYTES);
    if (!read.ok) {
      return read.status === 413
        ? json({ ok: false, error: "Request is too large." }, 413)
        : json({ ok: false, error: "Could not read the request body." }, 400);
    }

    let body: unknown;
    try {
      body = JSON.parse(read.text);
    } catch {
      return json({ ok: false, error: "Malformed JSON." }, 400);
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return json({ ok: false, error: "Expected a JSON object." }, 400);
    }

    const ip = clientIp(req);
    const gate = limit(rateLimitKey(ip));
    if (!gate.ok) {
      return json(
        { ok: false, error: "Too many requests from this connection. Please call us instead." },
        429,
        { "Retry-After": String(gate.retryAfterSeconds) },
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return json({ ok: false, errors: fieldErrors }, 400);
    }

    const lead = parsed.data;
    const signals = detectBot(lead);
    const suspectedBot = signals.honeypot || signals.tooFast;

    const meta: LeadMeta = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      ip,
      userAgent: req.headers.get("user-agent")?.slice(0, 300) || undefined,
      referer: req.headers.get("referer")?.slice(0, 300) || undefined,
    };

    // Every valid submission is written to leads.jsonl, flagged or not. The bot
    // heuristics have false positives (browser autofill can fill the off-screen
    // honeypot for a real person), and an emergency lead is worth far more than
    // a spam line in a log file. Flagged records carry their signals so the
    // office can triage them; only the email is withheld.
    await appendLead(suspectedBot ? { ...meta, lead, suspectedBot: signals } : { ...meta, lead });

    if (suspectedBot) {
      // Look like success so automated senders learn nothing.
      console.warn(`[contact] lead ${meta.id} flagged as suspected bot from ${ip}; saved to leads.jsonl, not emailed`, signals);
      return json({ ok: true });
    }

    const result = await sendLeadEmail(lead, meta);
    if (result.delivered) {
      console.info(`[contact] lead ${meta.id} emailed via ${result.provider}${result.id ? ` (${result.id})` : ""}`);
    } else {
      console.error(`[contact] lead ${meta.id} NOT emailed (provider: ${result.provider}); check leads.jsonl`);
    }

    // Identical to the bot branch above: delivery status is logged, never
    // returned, so the client cannot tell accepted, flagged and unmailed apart.
    return json({ ok: true });
  } catch (error) {
    console.error("[contact] unhandled error:", error);
    return json({ ok: false, error: "Something went wrong on our side. Please call us." }, 500);
  }
}
