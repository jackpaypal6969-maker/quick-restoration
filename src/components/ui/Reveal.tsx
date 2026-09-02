import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
  /** Initial scale (1 = none) */
  scale?: number;
  /** Accepted for API compatibility; reveals are always one-shot. */
  once?: boolean;
  /** Render as a different element (defaults to div) */
  as?: "div" | "section" | "li" | "span" | "article";
}

/**
 * Scroll-triggered entrance that does not wait for hydration. Server-renders a
 * plain element with class `reveal` (hidden via globals.css); the inline
 * IntersectionObserver script in the root layout sets `data-revealed` as the
 * element approaches the viewport and CSS transitions it in with the same
 * 0.9s / [0.16, 1, 0.3, 1] curve motion used before. prefers-reduced-motion
 * renders the final state via CSS; `data-motion` / `data-reveal` let the root
 * <noscript> rule force it visible when JS is unavailable.
 * Use for section blocks and cards; do not nest deeply.
 */
export function Reveal({ children, className, delay = 0, y = 28, scale = 1, as: Tag = "div" }: RevealProps) {
  return (
    <Tag
      data-reveal
      data-motion
      suppressHydrationWarning
      className={cn("reveal", className)}
      style={{ "--reveal-y": `${y}px`, "--reveal-scale": String(scale), "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
