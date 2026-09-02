"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide motion runtime.
 *
 * `LazyMotion` + `domAnimation` ships only the animate / exit / variants /
 * gesture / in-view features; the layout-projection and drag code in the full
 * `motion` bundle never loads. Every component renders the lightweight `m.*`
 * element. `strict` throws in development if a full `motion.*` element renders
 * inside the tree, so a regression to the big bundle cannot slip in silently.
 *
 * `reducedMotion="user"` makes every motion element honour prefers-reduced-motion
 * (transforms are skipped, opacity still resolves) as a safety net beneath the
 * explicit usePrefersReducedMotion branches.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
