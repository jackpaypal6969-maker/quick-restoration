import { Check, Hexagon, ShieldCheck, Umbrella } from "lucide-react";
import { useId } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type SealKind = "iicrc" | "nys-mold" | "insured";
export type SealTone = "dark" | "light";

export interface SealProps {
  kind: SealKind;
  /** "dark" = cyan on midnight surfaces, "light" = violet on white/ice surfaces. */
  tone?: SealTone;
  /** Rendered width and height in px. The artwork scales from a 200x200 viewBox. */
  size?: number;
  className?: string;
  /** Accessible name. Defaults to the matching `siteConfig.credentials` label. */
  label?: string;
  /**
   * Hide the seal from assistive tech. Use when a sibling already carries the
   * text (SealRow does this with a visually-hidden label).
   */
  decorative?: boolean;
}

/* Geometry (SVG user units, viewBox 0 0 200 200) */
const VIEW = 200;
const CENTER = VIEW / 2;
const R_OUTER = 97;
const R_OUTER_INNER = 93;
const R_TICKS = 90.5;
const TICK_COUNT = 72;
/* Top text stands on its baseline and rises outward (78 -> ~86). Bottom text is
   set on a counter-clockwise arc so it stays upright, which makes it rise inward
   (86 -> ~78). Different radii keep both arcs in the same visual band. */
const R_TEXT_TOP = 78;
const R_TEXT_BOTTOM = 86;
const R_DIVIDER = 82;
const R_INNER = 66;

const TICK_PERIOD = (2 * Math.PI * R_TICKS) / TICK_COUNT;
const TICK_DASH = `0.9 ${(TICK_PERIOD - 0.9).toFixed(3)}`;

/* 9 o'clock -> 12 -> 3 o'clock, clockwise on screen. */
const ARC_TOP = `M ${CENTER - R_TEXT_TOP},${CENTER} A ${R_TEXT_TOP},${R_TEXT_TOP} 0 1 1 ${CENTER + R_TEXT_TOP},${CENTER}`;
/* 3 o'clock -> 6 -> 9 o'clock, counter-clockwise on screen. */
const ARC_BOTTOM = `M ${CENTER + R_TEXT_BOTTOM},${CENTER} A ${R_TEXT_BOTTOM},${R_TEXT_BOTTOM} 0 0 0 ${CENTER - R_TEXT_BOTTOM},${CENTER}`;

function diamond(cx: number, cy: number, r: number) {
  return `M ${cx - r},${cy} L ${cx},${cy - r} L ${cx + r},${cy} L ${cx},${cy + r} Z`;
}

const RING_TEXT_STYLE = {
  fontFamily: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontFeatureSettings: "normal",
} as const;

/** Ring and centre copy. This is design copy, not business data. */
const COPY: Record<SealKind, { top: string; bottom: string; caption: string }> = {
  iicrc: { top: "IICRC CERTIFIED FIRM", bottom: "WATER · FIRE · MOLD", caption: "24/7" },
  "nys-mold": { top: "NEW YORK STATE LICENSED", bottom: "MOLD REMEDIATION CONTRACTOR", caption: "ART. 32" },
  insured: { top: "FULLY LICENSED & INSURED", bottom: "NASSAU · SUFFOLK · QUEENS", caption: "NY" },
};

const TONE: Record<SealTone, { wrapper: string; discFrom: string; discTo: string }> = {
  dark: {
    wrapper: "text-electric-300 drop-shadow-[0_0_12px_rgb(34_211_238/0.3)]",
    discFrom: "rgb(255 255 255 / 0.09)",
    discTo: "rgb(255 255 255 / 0.03)",
  },
  light: {
    wrapper: "text-royal-600 drop-shadow-[0_10px_24px_rgb(11_7_34/0.1)]",
    discFrom: "#ffffff",
    discTo: "#f5fbfd", // ice-50
  },
};

function credentialLabel(kind: SealKind): string | undefined {
  return siteConfig.credentials.find((c) => c.key === kind)?.label;
}

/** Centre glyph, rendered as HTML over the SVG so lucide strokes stay crisp at every size. */
function SealIcon({ kind, size }: { kind: SealKind; size: number }) {
  if (kind === "nys-mold") {
    return (
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <Hexagon aria-hidden size={size} strokeWidth={1.5} className="absolute inset-0" />
        <Check aria-hidden size={size * 0.46} strokeWidth={2.75} />
      </span>
    );
  }
  const Icon = kind === "iicrc" ? ShieldCheck : Umbrella;
  return <Icon aria-hidden size={size} strokeWidth={1.6} />;
}

/**
 * Circular certification seal: fine double outer ring, tick band, ring copy on
 * circular text paths, and a lucide glyph with a short Syne caption in the
 * centre. Text-based by design; no third-party marks are reproduced.
 *
 * Meant for the trust bar, the About credentials block and the footer. Colour
 * is inherited from `currentColor`, so `tone` only picks cyan (dark) or violet
 * (light). Server component; no client JS.
 */
export function Seal({ kind, tone = "dark", size = 132, className, label, decorative = false }: SealProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const topId = `seal-top-${uid}`;
  const bottomId = `seal-bottom-${uid}`;
  const discId = `seal-disc-${uid}`;

  const copy = COPY[kind];
  const palette = TONE[tone];
  const name = label ?? credentialLabel(kind) ?? `${copy.top}, ${copy.bottom}`;
  const iconSize = Math.round(size * 0.22);
  const captionSize = size * 0.075;

  const a11y = decorative ? ({ "aria-hidden": true } as const) : ({ role: "img", "aria-label": name } as const);

  return (
    <div
      className={cn("relative inline-block shrink-0 select-none", palette.wrapper, className)}
      style={{ width: size, height: size }}
      {...a11y}
    >
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="size-full" aria-hidden focusable="false">
        <defs>
          <radialGradient id={discId} cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor={palette.discFrom} />
            <stop offset="100%" stopColor={palette.discTo} />
          </radialGradient>
        </defs>

        {/* Disc */}
        <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill={`url(#${discId})`} />

        {/* Outer double ring + tick band */}
        <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx={CENTER} cy={CENTER} r={R_OUTER_INNER} fill="none" stroke="currentColor" strokeWidth={0.5} opacity={0.8} />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R_TICKS}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray={TICK_DASH}
          opacity={0.45}
        />

        {/* Inner ring framing the glyph */}
        <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="none" stroke="currentColor" strokeWidth={0.75} opacity={0.75} />

        {/* Dividers between the two arcs of text */}
        <path d={diamond(CENTER - R_DIVIDER, CENTER, 2.4)} fill="currentColor" />
        <path d={diamond(CENTER + R_DIVIDER, CENTER, 2.4)} fill="currentColor" />

        {/* Ring copy */}
        <path id={topId} d={ARC_TOP} fill="none" />
        <path id={bottomId} d={ARC_BOTTOM} fill="none" />
        <text fill="currentColor" fontSize={10} textAnchor="middle" style={RING_TEXT_STYLE}>
          <textPath href={`#${topId}`} startOffset="50%">
            {copy.top}
          </textPath>
        </text>
        <text fill="currentColor" fontSize={10} textAnchor="middle" style={RING_TEXT_STYLE}>
          <textPath href={`#${bottomId}`} startOffset="50%">
            {copy.bottom}
          </textPath>
        </text>
      </svg>

      {/* Centre glyph and caption */}
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <SealIcon kind={kind} size={iconSize} />
        <span
          className="font-display font-extrabold leading-none tracking-[0.14em]"
          style={{ fontSize: captionSize, marginTop: size * 0.035 }}
        >
          {copy.caption}
        </span>
      </div>
    </div>
  );
}

export interface SealRowProps {
  tone?: SealTone;
  /** Size of each seal in px. */
  size?: number;
  className?: string;
}

const ROW_KINDS: SealKind[] = ["iicrc", "nys-mold", "insured"];

/**
 * The three seals in a responsive wrapping row. Each seal is decorative here;
 * a visually-hidden label from `siteConfig.credentials` carries the meaning.
 */
export function SealRow({ tone = "dark", size = 132, className }: SealRowProps) {
  return (
    <ul aria-label="Credentials" className={cn("flex flex-wrap items-center gap-6", className)}>
      {ROW_KINDS.map((kind) => (
        <li key={kind} className="flex items-center">
          <Seal kind={kind} tone={tone} size={size} decorative />
          <span className="sr-only">{credentialLabel(kind) ?? `${COPY[kind].top}, ${COPY[kind].bottom}`}</span>
        </li>
      ))}
    </ul>
  );
}
