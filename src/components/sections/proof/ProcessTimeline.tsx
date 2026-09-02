"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

export interface ProcessStep {
  title: string;
  body: string;
}

interface ProcessTimelineProps {
  steps: ReadonlyArray<ProcessStep>;
  className?: string;
}

/**
 * Ordered timeline. Vertical rail with dots on small screens; one equal
 * column per step with a connecting line on lg. Each segment of the line
 * (and each dot) fills as the list scrolls through the viewport. Reduced
 * motion renders the line fully drawn.
 */
export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = usePrefersReducedMotion();
  // Starts as the list enters the bottom 10% of the viewport and completes once
  // its bottom edge passes 80%, so the whole line is drawn while the section is
  // still comfortably in view (the lg row is ~220px tall; at 1440x900 it finishes
  // with the list's top edge around 500px from the top of the viewport).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.8"] });

  return (
    // gap-10 (mobile) and gap-8 (lg) are mirrored by the segment overhangs below.
    <ol ref={ref} className={cn("grid gap-10 lg:auto-cols-fr lg:grid-flow-col lg:gap-8", className)}>
      {steps.map((step, i) => (
        <TimelineStep
          key={step.title}
          index={i}
          count={steps.length}
          step={step}
          progress={scrollYProgress}
          reduce={reduce}
        />
      ))}
    </ol>
  );
}

interface TimelineStepProps {
  index: number;
  count: number;
  step: ProcessStep;
  progress: MotionValue<number>;
  reduce: boolean;
}

function TimelineStep({ index, count, step, progress, reduce }: TimelineStepProps) {
  const segments = Math.max(count - 1, 1);
  const start = index / segments; // progress at which the line reaches this dot
  const end = (index + 1) / segments; // ...and the next one
  const segment = useTransform(progress, [start, end], [0, 1]);
  const dot = useTransform(progress, [Math.max(start - 0.04, 0), start + 0.01], [0, 1]);
  const last = index === count - 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="relative pl-12 lg:pl-0 lg:pt-12">
      {/* Dot: hollow ring that fills violet when the line reaches it.
          Reduced motion gets explicit final values so the SSR'd scale(0) never sticks;
          data-motion lets the global <noscript> rule draw everything without JS. */}
      <span aria-hidden className="absolute left-0 top-0 flex size-6 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-ink-900/15 bg-white" />
        <m.span
          data-motion
          style={reduce ? { scale: 1, opacity: 1 } : { scale: dot, opacity: dot }}
          className="relative size-2.5 rounded-full bg-royal-600 shadow-[0_0_0_4px_rgb(91_33_214/0.16)]"
        />
      </span>

      {!last && (
        <>
          {/* Vertical segment (mobile): from the dot's base across the row gap to the next dot */}
          <span aria-hidden className="absolute -bottom-10 left-3 top-6 w-px -translate-x-1/2 bg-ink-900/10 lg:hidden">
            <m.span
              data-motion
              style={reduce ? { scaleY: 1 } : { scaleY: segment }}
              className="absolute inset-0 origin-top bg-royal-600"
            />
          </span>
          {/* Horizontal segment (lg): from the dot's edge across the column gap to the next dot */}
          <span aria-hidden className="absolute -right-8 left-6 top-3 hidden h-px -translate-y-1/2 bg-ink-900/10 lg:block">
            <m.span
              data-motion
              style={reduce ? { scaleX: 1 } : { scaleX: segment }}
              className="absolute inset-0 origin-left bg-linear-to-r from-royal-600 to-royal-500"
            />
          </span>
        </>
      )}

      <Reveal delay={index * 0.08} y={16}>
        {/* The <ol> already conveys order to assistive tech; the number is visual. */}
        <p aria-hidden className="font-display text-4xl font-bold leading-none tracking-tight text-royal-600 tabular-nums lg:text-5xl">
          {number}
        </p>
        <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink-950">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{step.body}</p>
      </Reveal>
    </li>
  );
}
