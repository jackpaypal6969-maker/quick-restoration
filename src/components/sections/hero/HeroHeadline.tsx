import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface HeadlineLine {
  /** Words are split on regular spaces; join two with a non-breaking space to keep them on one line. */
  text: string;
  /** Paint this line with the electric gradient (dark surfaces only). */
  gradient?: boolean;
}

interface HeroHeadlineProps {
  lines: HeadlineLine[];
  /**
   * Size overrides. Font-size classes also reset line-height, so pass the
   * size/leading form (e.g. `sm:text-6xl/[0.98]`) rather than a bare `text-*`.
   */
  className?: string;
  /** Seconds before the first word starts rising. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
}

/** Trim float noise (0.15 + 0.06 = 0.21000000000000002) so the inline style stays tidy. */
function seconds(value: number) {
  return `${Math.round(value * 1000) / 1000}s`;
}

/**
 * The home-page h1. Each word rises out of its own clipping mask with a short
 * stagger on load. The choreography is a CSS animation (see hero.css) so the
 * LCP text paints before hydration; `--hero-delay` carries the per-word stagger,
 * `data-motion` lets the global <noscript> rule force it visible, and the
 * reduced-motion media query in hero.css renders the final state at once.
 */
export function HeroHeadline({ lines, className, delay = 0.15, stagger = 0.06 }: HeroHeadlineProps) {
  let wordIndex = 0;

  return (
    <h1 className={cn("font-display text-[2.5rem]/[0.98] font-bold tracking-[-0.03em] text-white", className)}>
      {lines.map((line) => {
        const words = line.text.split(" ");
        const wordClass = cn("inline-block", line.gradient && "text-gradient-electric");
        return (
          <span key={line.text} className="block">
            {words.map((word, wi) => {
              const i = wordIndex++;
              return (
                <Fragment key={`${line.text}-${wi}`}>
                  {/* Mask: padding keeps descenders visible, the negative margin keeps the line box tight. */}
                  <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                    <span
                      data-motion
                      className={cn("hero-word", wordClass)}
                      style={{ "--hero-delay": seconds(delay + i * stagger) } as CSSProperties}
                    >
                      {word}
                    </span>
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
