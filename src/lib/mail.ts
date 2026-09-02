/**
 * Lead notification email. Picks the first configured provider:
 *   1. RESEND_API_KEY  -> Resend
 *   2. SMTP_HOST       -> nodemailer SMTP
 *   3. neither         -> logs a warning and reports delivered: false
 * The route always writes the JSONL backup before calling this, so a failure
 * here loses the notification, not the lead.
 */
import { createTransport, type Transporter } from "nodemailer";
import { Resend } from "resend";
import { getService, siteConfig } from "@/config/site";
import { formatPhoneDisplay, URGENCY_LABELS, type ContactLead } from "@/lib/contact-schema";
import type { LeadMeta } from "@/lib/leads";

export type MailProvider = "resend" | "smtp" | "none";

export interface SendResult {
  delivered: boolean;
  provider: MailProvider;
  /** Provider message id when available. */
  id?: string;
}

const SEND_TIMEOUT_MS = 10_000;

/** Escape a user-supplied value for interpolation into HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse whitespace and strip line breaks so a value is safe inside a header. */
function oneLine(value: string, max = 60): string {
  const flat = value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function recipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL?.trim();
  const list = (raw ? raw.split(",") : [siteConfig.email]).map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : [siteConfig.email];
}

function sender(): string {
  const configured = process.env.CONTACT_FROM_EMAIL?.trim();
  if (configured) return configured;
  let host = "localhost";
  try {
    host = new URL(siteConfig.url).hostname;
  } catch {
    // keep fallback
  }
  return `${siteConfig.name} Website <no-reply@${host}>`;
}

function serviceLabel(slug: ContactLead["service"]): string {
  return getService(slug)?.shortName ?? "Not sure";
}

function urgencyLabel(urgency: ContactLead["urgency"]): string {
  return urgency === "emergency" ? "EMERGENCY" : URGENCY_LABELS[urgency];
}

export function buildSubject(lead: ContactLead): string {
  const parts = [urgencyLabel(lead.urgency), serviceLabel(lead.service)];
  if (lead.address) parts.push(oneLine(lead.address, 48));
  return `[${siteConfig.name}] ${parts.join(" - ")}`;
}

interface Row {
  label: string;
  value: string;
  href?: string;
}

function rows(lead: ContactLead, meta: LeadMeta): Row[] {
  const phone = formatPhoneDisplay(lead.phone);
  const list: Row[] = [
    { label: "Urgency", value: urgencyLabel(lead.urgency) },
    { label: "Service", value: serviceLabel(lead.service) },
    { label: "Name", value: lead.name },
    { label: "Phone", value: phone, href: `tel:+1${lead.phone}` },
    { label: "Email", value: lead.email ?? "(not provided)", href: lead.email ? `mailto:${lead.email}` : undefined },
    { label: "Property address", value: lead.address ?? "(not provided)" },
    { label: "Consent to call/text", value: "Yes" },
    { label: "Received", value: meta.receivedAt },
    { label: "Lead ID", value: meta.id },
    { label: "IP", value: meta.ip },
  ];
  if (meta.userAgent) list.push({ label: "Browser", value: meta.userAgent });
  if (meta.referer) list.push({ label: "Page", value: meta.referer });
  return list;
}

export function buildTextBody(lead: ContactLead, meta: LeadMeta): string {
  const lines = rows(lead, meta).map((r) => `${r.label}: ${r.value}`);
  return [
    `New website request for ${siteConfig.name}`,
    "",
    ...lines,
    "",
    "Message:",
    lead.message,
    "",
    `Reply to the client directly or call ${formatPhoneDisplay(lead.phone)}.`,
  ].join("\n");
}

export function buildHtmlBody(lead: ContactLead, meta: LeadMeta): string {
  const emergency = lead.urgency === "emergency";
  const banner = emergency
    ? `<p style="margin:0 0 16px;padding:12px 16px;border-radius:12px;background:#fee2e2;color:#7f1d1d;font-weight:700;">EMERGENCY - the client says damage is happening now. Call ${escapeHtml(formatPhoneDisplay(lead.phone))} first.</p>`
    : "";
  const table = rows(lead, meta)
    .map((r) => {
      const value = r.href
        ? `<a href="${escapeHtml(r.href)}" style="color:#5b21d6;">${escapeHtml(r.value)}</a>`
        : escapeHtml(r.value);
      return `<tr><td style="padding:6px 12px 6px 0;color:#6c678a;white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td><td style="padding:6px 0;color:#0b0722;">${value}</td></tr>`;
    })
    .join("");
  const message = escapeHtml(lead.message).replace(/\r?\n/g, "<br>");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5fbfd;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#0b0722;">
<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px 28px;border:1px solid rgba(11,7,34,0.08);">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#5b21d6;font-weight:700;">${escapeHtml(siteConfig.name)} website</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.2;">New request: ${escapeHtml(urgencyLabel(lead.urgency))} - ${escapeHtml(serviceLabel(lead.service))}</h1>
${banner}
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">${table}</table>
<h2 style="margin:20px 0 8px;font-size:16px;">Message</h2>
<p style="margin:0;padding:14px 16px;background:#f5fbfd;border-radius:12px;white-space:normal;">${message}</p>
<p style="margin:20px 0 0;font-size:13px;color:#6c678a;">Reply to this email to answer the client${lead.email ? "" : " (no email given - call them)"}. A copy of this lead is in leads.jsonl on the server.</p>
</div></body></html>`;
}

let resendClient: Resend | undefined;
let smtpTransport: Transporter | undefined;

function getResend(apiKey: string): Resend {
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function getSmtp(host: string): Transporter {
  if (!smtpTransport) {
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS ?? "";
    smtpTransport = createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // implicit TLS (port 465)
      requireTLS: process.env.SMTP_SECURE !== "true", // otherwise STARTTLS is mandatory (587): never fall back to plaintext
      auth: user ? { user, pass } : undefined,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: SEND_TIMEOUT_MS,
    });
  }
  return smtpTransport;
}

/**
 * Send the lead notification. Never throws; failures are logged and reported
 * as `delivered: false` so the route can still answer the client.
 */
export async function sendLeadEmail(lead: ContactLead, meta: LeadMeta): Promise<SendResult> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const smtpHost = process.env.SMTP_HOST?.trim();

  if (!resendKey && !smtpHost) {
    console.warn(`[contact] no email provider configured; lead ${meta.id} saved to leads.jsonl only`);
    return { delivered: false, provider: "none" };
  }

  const subject = buildSubject(lead);
  const text = buildTextBody(lead, meta);
  const html = buildHtmlBody(lead, meta);
  const from = sender();
  const to = recipients();
  const replyTo = lead.email;

  if (resendKey) {
    try {
      const { data, error } = await withTimeout(
        getResend(resendKey).emails.send({ from, to, subject, text, html, replyTo }),
        SEND_TIMEOUT_MS,
        "Resend send",
      );
      if (error) {
        console.error(`[contact] Resend rejected lead ${meta.id}: ${error.name} ${error.message}`);
        return { delivered: false, provider: "resend" };
      }
      return { delivered: true, provider: "resend", id: data?.id };
    } catch (error) {
      console.error(`[contact] Resend send failed for lead ${meta.id}:`, error);
      return { delivered: false, provider: "resend" };
    }
  }

  if (smtpHost) {
    try {
      const info = await withTimeout(
        getSmtp(smtpHost).sendMail({ from, to, subject, text, html, replyTo }),
        SEND_TIMEOUT_MS,
        "SMTP send",
      );
      return { delivered: true, provider: "smtp", id: info.messageId };
    } catch (error) {
      console.error(`[contact] SMTP send failed for lead ${meta.id}:`, error);
      return { delivered: false, provider: "smtp" };
    }
  }

  return { delivered: false, provider: "none" };
}
