import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroFadeInProps {
  children: ReactNode;
  className?: string;
  /** Seconds */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
}

/**
 * Load-time entrance for the hero's supporting blocks (eyebrow, lede, CTAs, chips).
 * Unlike <Reveal> it runs on mount rather than on scroll, so it can be sequenced
 * with the headline. It is a CSS animation (see hero.css) driven by `--hero-delay`
 * and `--hero-y`, so it needs no JavaScript: the reduced-motion media query
 * renders the final state at once and `data-motion` lets the global <noscript>
 * rule force it visible.
 */
export function HeroFadeIn({ children, className, delay = 0, y = 18 }: HeroFadeInProps) {
  return (
    <div
      data-motion
      className={cn("hero-fade", className)}
      style={{ "--hero-delay": `${delay}s`, "--hero-y": `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
