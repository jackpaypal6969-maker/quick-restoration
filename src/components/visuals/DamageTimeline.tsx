import { Biohazard, Clock, Droplets, Hammer, Timer, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export interface DamageStage {
  /** Elapsed time since the loss; rendered as the eyebrow over the node. */
  time: string;
  /** Short display heading (Syne). */
  title: string;
  /** One-line consequence. */
  body: string;
  icon: LucideIcon;
}

/**
 * "What happens if water waits": the four stages of an untreated water loss.
 * Exported so pages can reuse the copy (e.g. in a service FAQ or a stat row).
 * The layout below assumes exactly four stages (md grid columns, rail fade stop).
 */
export const DAMAGE_STAGES: readonly DamageStage[] = [
  { time: "First hour", title: "Water spreads", body: "Water wicks into drywall, subfloor and framing.", icon: Droplets },
  { time: "24 hours", title: "Materials swell", body: "Drywall swells, finishes stain, odors start.", icon: Clock },
  { time: "48 hours", title: "Mold takes hold", body: "Mold can begin colonizing wet materials.", icon: Biohazard },
  { time: "72 hours +", title: "Costs climb", body: "Structural drying gets harder and rebuild costs climb.", icon: Hammer },
];

const DEFAULT_NOTE = "Our target is on-site in under an hour, and drying starts the same visit.";

export interface DamageTimelineProps {
  /** Surface the timeline sits on. Cyan accents are reserved for dark. */
  tone?: Tone;
  /** Closing line under the rail. */
  note?: string;
  /** Accessible name for the list. */
  label?: string;
  className?: string;
}

/**
 * Illustrated escalation timeline. Vertical rail with the copy beside each
 * node on small screens; one column per stage with a horizontal rail on md+.
 * The rail is a single gradient (electric → royal on dark, royal-300 → royal-600
 * on light) that fades out past the last node, since "72 hours +" keeps going.
 * The first node carries a slow pulse (transform/opacity only, motion-safe).
 */
export function DamageTimeline({
  tone = "light",
  note = DEFAULT_NOTE,
  label = "What happens if water waits",
  className,
}: DamageTimelineProps) {
  const dark = tone === "dark";

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {/* Rail. Mobile: from the first marker's centre (top-5) down through the list.
            md+: label row (h-5) + mt-3 + half marker (1.25rem) = 3.25rem → top-13.
            The colour reaches its end at 75% (the last of four nodes) then fades. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-0 left-5 top-5 w-0.5 -translate-x-1/2 bg-linear-to-b via-75% to-transparent",
            "md:bottom-auto md:right-0 md:top-13 md:h-0.5 md:w-auto md:translate-x-0 md:-translate-y-1/2 md:bg-linear-to-r",
            dark ? "from-electric-400 via-royal-500" : "from-royal-300 via-royal-600",
          )}
        />

        <ol aria-label={label} className="relative grid gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
          {DAMAGE_STAGES.map(({ time, title, body, icon: Icon }, i) => (
            <li key={time} className="relative pl-14 pt-2.5 md:pl-0 md:pt-0">
              <p className={cn("eyebrow h-5 leading-5", dark ? "text-electric-300" : "text-royal-600")}>{time}</p>

              {/* Node. Absolute beside the copy on mobile, in-flow under the label on md+. */}
              <span
                aria-hidden
                className="absolute left-0 top-0 flex size-10 items-center justify-center md:relative md:mt-3"
              >
                {i === 0 && (
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full motion-safe:animate-pulse-ring",
                      dark ? "bg-electric-400/30" : "bg-royal-500/20",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full ring-1",
                    dark ? "bg-midnight-800 ring-white/15" : "bg-white shadow-card ring-royal-600/20",
                  )}
                />
                <Icon
                  className={cn("relative size-[18px]", dark ? "text-electric-300" : "text-royal-600")}
                  strokeWidth={1.75}
                />
              </span>

              <h3 className={cn("mt-3 font-display text-base font-bold leading-snug md:mt-5", dark ? "text-white" : "text-ink-950")}>
                {title}
              </h3>
              <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-white/65" : "text-ink-700")}>{body}</p>
            </li>
          ))}
        </ol>
      </div>

      <p
        className={cn(
          "mt-10 flex items-start gap-3 border-t pt-5 text-sm leading-relaxed",
          dark ? "border-white/10 text-white/70" : "border-ink-900/10 text-ink-700",
        )}
      >
        <Timer aria-hidden className={cn("mt-0.5 size-4 shrink-0", dark ? "text-electric-300" : "text-royal-600")} strokeWidth={1.75} />
        <span>{note}</span>
      </p>
    </div>
  );
}
