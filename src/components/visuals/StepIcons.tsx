import { ClipboardCheck, Handshake, PhoneCall, Truck, Wrench, type LucideIcon } from "lucide-react";
import type { processSteps } from "@/config/site";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

/**
 * One lucide icon per entry of `processSteps` (src/config/site.ts), in order:
 * call → dispatch → assess/document → mitigate/restore → insurance/walkthrough.
 * The `length` constraint is type-only (erased at runtime) and fails `tsc` if
 * the two lists ever drift apart.
 */
export const PROCESS_STEP_ICONS = [PhoneCall, Truck, ClipboardCheck, Wrench, Handshake] as const satisfies readonly LucideIcon[] & {
  readonly length: (typeof processSteps)["length"];
};

export interface StepMedallionProps {
  /** Zero-based index into `processSteps` / `PROCESS_STEP_ICONS`. Out-of-range values are clamped. */
  index: number;
  /** Surface the medallion sits on. Cyan accents are reserved for dark. */
  tone?: Tone;
  size?: "md" | "lg";
  /** Accessible name. Omit when a visible step title sits next to it (rendered aria-hidden). */
  label?: string;
  className?: string;
}

const SIZES = {
  md: { medallion: "size-12 md:size-14", icon: "size-5 md:size-6", badge: "size-5" },
  lg: { medallion: "size-16 md:size-20", icon: "size-7 md:size-8", badge: "size-6" },
} as const;

/**
 * Circular step icon with a thin ring and the step number as a tiny badge at
 * the bottom-right. Decorative by default; pass `label` for a standalone use.
 */
export function StepMedallion({ index, tone = "light", size = "md", label, className }: StepMedallionProps) {
  const dark = tone === "dark";
  const i = Math.min(Math.max(Math.trunc(index), 0), PROCESS_STEP_ICONS.length - 1);
  const Icon = PROCESS_STEP_ICONS[i];
  const s = SIZES[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full ring-1",
        s.medallion,
        dark
          ? "glass text-electric-300 shadow-[0_0_28px_-6px_rgb(34_211_238/0.45)] ring-white/15"
          : "bg-white text-royal-600 shadow-card ring-royal-600/20",
        className,
      )}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <Icon aria-hidden className={s.icon} strokeWidth={1.75} />
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full font-display text-[0.7rem] font-bold leading-none tabular-nums ring-2",
          s.badge,
          dark ? "bg-electric-400 text-midnight-950 ring-midnight-900" : "bg-royal-600 text-white ring-white",
        )}
      >
        {i + 1}
      </span>
    </span>
  );
}
