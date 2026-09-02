/**
 * Backup record of every submission, one JSON object per line, appended to
 * `${LEADS_DIR}/leads.jsonl` (LEADS_DIR defaults to ./data, git-ignored).
 * Email can fail; this file never should. Nothing here throws to the caller.
 *
 * Submissions the bot heuristics flag are written too, marked with
 * `suspectedBot`, because the heuristics have false positives (browser
 * autofill can populate the honeypot for a real person) and an emergency lead
 * is worth far more than a spam line in a log. Only the email is withheld.
 */
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { BotSignals, ContactLead } from "@/lib/contact-schema";

export interface LeadMeta {
  /** UUID assigned by the route; also printed in the email so the two can be matched. */
  id: string;
  /** ISO timestamp */
  receivedAt: string;
  ip: string;
  userAgent?: string;
  referer?: string;
}

export interface LeadRecord extends LeadMeta {
  lead: ContactLead;
  /** Set when the bot heuristics fired: the lead was saved here but not emailed. */
  suspectedBot?: BotSignals;
}

const LEADS_FILE = "leads.jsonl";

/** Absolute path of the JSONL file, resolved against the process working directory. */
export function leadsFilePath(): string {
  const dir = process.env.LEADS_DIR?.trim() || "./data";
  return path.resolve(process.cwd(), dir, LEADS_FILE);
}

/**
 * Append one lead. Resolves `true` on success, `false` on failure (already
 * logged). Never rejects.
 */
export async function appendLead(record: LeadRecord): Promise<boolean> {
  const file = leadsFilePath();
  try {
    await mkdir(path.dirname(file), { recursive: true });
    // JSON.stringify escapes \n inside strings, so each record stays on one line.
    await appendFile(file, `${JSON.stringify(record)}\n`, { encoding: "utf8", mode: 0o600 });
    return true;
  } catch (error) {
    console.error(`[contact] failed to append lead ${record.id} to ${file}:`, error);
    return false;
  }
}
