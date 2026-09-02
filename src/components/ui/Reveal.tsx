"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
  /** Initial scale (1 = none) */
  scale?: number;
  once?: boolean;
  /** Render as a different element (defaults to div) */
  as?: "div" | "section" | "li" | "span" | "article";
}

/**
 * Scroll-triggered entrance. Respects prefers-reduced-motion by rendering a
 * plain element in its final state (swapped in after hydration, so the SSR
 * markup never strands `opacity:0`). `data-motion` lets the root layout's
 * <noscript> style force the element visible when JS is unavailable.
 * Use for section blocks and cards; do not nest deeply.
 */
export function Reveal({ children, className, delay = 0, y = 28, scale = 1, once = true, as = "div" }: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      data-motion
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Tag>
  );
}
