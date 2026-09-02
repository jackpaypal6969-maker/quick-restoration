"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide motion config. `reducedMotion="user"` makes every motion element
 * honour prefers-reduced-motion (transforms are skipped, opacity still resolves)
 * as a safety net beneath the explicit usePrefersReducedMotion branches.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
