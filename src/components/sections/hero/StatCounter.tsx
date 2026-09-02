"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

interface StatCounterProps {
  /** e.g. "<60", "3", "24/7", "IICRC" */
  value: string;
  /** e.g. "min" */
  suffix?: string;
}

/** Optional non-digit prefix followed by a whole number: "<60" → ["<", "60"]. */
const NUMERIC = /^(\D*)(\d+)$/;

const PREFIX_WORDS: Record<string, string> = {
  "<": "Under ",
  ">": "Over ",
  "~": "About ",
};

/** Same viewport window motion's useInView used: { once: true, margin: "0px 0px -10% 0px" }, amount "some". */
const IN_VIEW_OPTIONS: IntersectionObserverInit = { rootMargin: "0px 0px -10% 0px", threshold: 0 };

/**
 * Stat value for the trust bar. Numeric-looking values count up from 0 when
 * scrolled into view (keeping any prefix such as "<"); everything else renders
 * as-is. Reduced motion renders the final number immediately.
 */
export function StatCounter({ value, suffix }: StatCounterProps) {
  const match = NUMERIC.exec(value);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : 0;

  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const shouldAnimate = match !== null && !reduce;

  // Start on the final value so SSR / no-JS / reduced-motion all show the real number.
  const [current, setCurrent] = useState(target);
  // Flips to true on the first intersection and never back (motion's `once: true`).
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true);
        observer.disconnect();
      }
    }, IN_VIEW_OPTIONS);
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!shouldAnimate || !inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
  }, [shouldAnimate, inView, target]);

  const suffixNode = suffix ? (
    <span className="ml-1 font-display text-xl font-semibold text-ink-500 md:text-2xl">{suffix}</span>
  ) : null;

  if (!match) {
    return (
      <span ref={ref}>
        {value}
        {suffixNode}
      </span>
    );
  }

  const spoken = `${PREFIX_WORDS[prefix] ?? prefix}${target}${suffix ? ` ${suffix}` : ""}`;

  return (
    <span ref={ref}>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {current}
      </span>
      {suffixNode && <span aria-hidden>{suffixNode}</span>}
      <span className="sr-only">{spoken}</span>
    </span>
  );
}
