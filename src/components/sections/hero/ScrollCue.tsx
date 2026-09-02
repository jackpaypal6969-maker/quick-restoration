"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

interface ScrollCueProps {
  className?: string;
}

/** Fully visible at scrollY 0, fully faded at this many px (motion's useTransform(scrollY, [0, 120], [1, 0])). */
const FADE_DISTANCE = 120;

/**
 * "Scroll" label with a thin line and a travelling cyan tick. Fades out over the
 * first 120px of scroll via a passive, rAF-throttled scroll listener; the tick
 * itself is a CSS keyframe (hero.css). Decorative only, hidden from assistive tech.
 */
export function ScrollCue({ className }: ScrollCueProps) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.style.opacity = "";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      // Linear, clamped mapping: identical to the previous useTransform.
      const progress = Math.min(Math.max(window.scrollY / FADE_DISTANCE, 0), 1);
      el.style.opacity = String(1 - progress);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/50 md:flex",
        className,
      )}
    >
      <span className="eyebrow text-[0.75rem] tracking-[0.32em]">Scroll</span>
      <span className="relative h-12 w-px overflow-hidden bg-white/15">
        <span className="hero-tick absolute inset-x-0 top-0 h-1/2 bg-electric-300" />
      </span>
    </div>
  );
}
