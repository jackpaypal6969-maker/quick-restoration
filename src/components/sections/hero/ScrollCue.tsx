"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

interface ScrollCueProps {
  className?: string;
}

/**
 * "Scroll" label with a thin line and a travelling cyan tick. Fades out over the
 * first 120px of scroll. Decorative only, hidden from assistive tech.
 */
export function ScrollCue({ className }: ScrollCueProps) {
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity: reduce ? 1 : opacity }}
      className={cn(
        "pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/50 md:flex",
        className,
      )}
    >
      <span className="eyebrow text-[0.75rem] tracking-[0.32em]">Scroll</span>
      <span className="relative h-12 w-px overflow-hidden bg-white/15">
        {!reduce && (
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-electric-300"
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
          />
        )}
      </span>
    </motion.div>
  );
}
