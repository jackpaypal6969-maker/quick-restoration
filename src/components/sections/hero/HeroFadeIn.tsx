"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

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
 * with the headline. Renders the final state when motion is reduced (SSR-safe
 * hook, so the server-rendered opacity:0 never sticks); `data-motion` lets the
 * global <noscript> rule force it visible without JavaScript.
 */
export function HeroFadeIn({ children, className, delay = 0, y = 18 }: HeroFadeInProps) {
  const reduce = usePrefersReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      data-motion
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
