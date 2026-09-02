/**
 * In-memory sliding-window rate limiter keyed by client address.
 *
 * Limits: 5 requests per 10 minutes and 20 per 24 hours. Rejected attempts are
 * not recorded, so hammering the endpoint does not extend the lock-out.
 *
 * Callers should key on `rateLimitKey(ip)` rather than the raw address: it
 * collapses IPv4-mapped IPv6 and buckets IPv6 clients by /64 so one
 * subscriber cannot dodge the limit by rotating through their own prefix.
 *
 * SCOPE: state lives in this Node process. That is exactly right behind the
 * single PM2 instance in deploy/ecosystem.config.cjs (exec_mode "fork",
 * instances 1). In PM2 cluster mode or across several servers every worker
 * keeps its own counters, so the effective limit multiplies by the worker
 * count. If you ever scale out, move the store to Redis or lean on the
 * Nginx `limit_req` zone that already fronts /api/contact.
 */
import { isIPv6 } from "node:net";

interface Window {
  ms: number;
  max: number;
}

const WINDOWS: readonly Window[] = [
  { ms: 10 * 60 * 1000, max: 5 },
  { ms: 24 * 60 * 60 * 1000, max: 20 },
];

const LONGEST_WINDOW_MS = Math.max(...WINDOWS.map((w) => w.ms));
const PRUNE_EVERY_MS = 10 * 60 * 1000;
/** Hard cap so a flood of spoofed IPs cannot grow memory without bound. */
const MAX_TRACKED_IPS = 10_000;

const V4_MAPPED_PREFIX = "::ffff:";

/** key -> ascending list of accepted request timestamps (ms). */
const store = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  /** Seconds the caller should wait before retrying; 0 when ok. */
  retryAfterSeconds: number;
}

/**
 * Expand an IPv6 address into its eight zero-padded hextets. Handles "::"
 * compression and an embedded dotted IPv4 tail ("64:ff9b::203.0.113.5").
 * Only called on strings net.isIPv6() has already accepted.
 */
function expandIPv6(addr: string): string[] {
  const [head, tail = ""] = addr.split("::");
  const toHextets = (part: string): string[] => {
    const groups = part ? part.split(":") : [];
    const last = groups[groups.length - 1];
    if (last && last.includes(".")) {
      const o = last.split(".").map(Number);
      groups.splice(-1, 1, ((o[0] << 8) | o[1]).toString(16), ((o[2] << 8) | o[3]).toString(16));
    }
    return groups;
  };
  const h = toHextets(head);
  const t = toHextets(tail);
  const zeros = addr.includes("::") ? Array<string>(Math.max(8 - h.length - t.length, 0)).fill("0") : [];
  return [...h, ...zeros, ...t].map((g) => g.padStart(4, "0"));
}

/**
 * Normalise a client address into the string the limiter is keyed on.
 *  - IPv4-mapped IPv6 ("::ffff:203.0.113.5") collapses to the IPv4 address so a
 *    dual-stack listener does not split one client into two buckets.
 *  - IPv6 is keyed on its /64 (first four hextets + "::/64"): a subscriber
 *    normally controls a whole /64 and could otherwise rotate through it.
 *  - Anything else (plain IPv4, "unknown") is lower-cased and used as-is.
 * Pure; no state.
 */
export function rateLimitKey(ip: string): string {
  let addr = ip.trim().toLowerCase();
  if (addr.startsWith(V4_MAPPED_PREFIX)) addr = addr.slice(V4_MAPPED_PREFIX.length);
  const zoneless = addr.split("%")[0]; // drop a link-local zone id ("fe80::1%eth0")
  if (isIPv6(zoneless)) return `${expandIPv6(zoneless).slice(0, 4).join(":")}::/64`;
  return addr;
}

function prune(now = Date.now()) {
  const cutoff = now - LONGEST_WINDOW_MS;
  for (const [key, stamps] of store) {
    const kept = stamps.filter((t) => t > cutoff);
    if (kept.length === 0) store.delete(key);
    else store.set(key, kept);
  }
}

/** Periodic sweep; unref'd so it never keeps the process alive. */
let pruneTimer: ReturnType<typeof setInterval> | undefined;
function ensurePruner() {
  if (pruneTimer || typeof setInterval !== "function") return;
  pruneTimer = setInterval(() => prune(), PRUNE_EVERY_MS);
  if (typeof pruneTimer === "object" && "unref" in pruneTimer) pruneTimer.unref();
}

/**
 * Check and record a request for `key` (see `rateLimitKey`). Returns
 * `{ ok: true }` and records the hit, or `{ ok: false, retryAfterSeconds }`
 * without recording it.
 */
export function limit(key: string, now = Date.now()): RateLimitResult {
  ensurePruner();

  if (store.size >= MAX_TRACKED_IPS && !store.has(key)) {
    prune(now);
    // Still full after dropping expired entries: evict the oldest-inserted
    // keys (Map iterates in insertion order) so MAX_TRACKED_IPS is a hard cap.
    while (store.size >= MAX_TRACKED_IPS) {
      const oldest = store.keys().next().value;
      if (oldest === undefined) break;
      store.delete(oldest);
    }
  }

  const cutoff = now - LONGEST_WINDOW_MS;
  const stamps = (store.get(key) ?? []).filter((t) => t > cutoff);

  let retryAfterMs = 0;
  for (const { ms, max } of WINDOWS) {
    const inWindow = stamps.filter((t) => t > now - ms);
    if (inWindow.length >= max) {
      // The window opens again when its oldest hit ages out.
      const oldest = inWindow[0];
      retryAfterMs = Math.max(retryAfterMs, oldest + ms - now);
    }
  }

  if (retryAfterMs > 0) {
    store.set(key, stamps);
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  stamps.push(now);
  store.set(key, stamps);
  return { ok: true, retryAfterSeconds: 0 };
}

/** Clear all counters. Intended for tests. */
export function resetRateLimits() {
  store.clear();
}
