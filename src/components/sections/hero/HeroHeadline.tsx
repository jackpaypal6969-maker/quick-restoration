"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

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

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * The home-page h1. Each word rises out of its own clipping mask with a short
 * stagger on load. With prefers-reduced-motion the final state renders at once.
 */
export function HeroHeadline({ lines, className, delay = 0.15, stagger = 0.06 }: HeroHeadlineProps) {
  const reduce = usePrefersReducedMotion();
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
                    {reduce ? (
                      <span className={wordClass}>{word}</span>
                    ) : (
                      <motion.span
                        data-motion
                        className={wordClass}
                        initial={{ y: "125%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: delay + i * stagger }}
                      >
                        {word}
                      </motion.span>
                    )}
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
