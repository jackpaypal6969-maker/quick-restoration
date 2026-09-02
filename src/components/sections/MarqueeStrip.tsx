"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";

interface MarqueeStripProps {
  items: readonly string[];
  /** Sentence that introduces the screen-reader list of items. */
  srIntro: string;
  className?: string;
}

/** One pass of the marquee. Rendered twice for a seamless loop; hidden from AT. */
function MarqueeTrack({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center", className)}>
      {items.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className="flex items-center gap-x-8 whitespace-nowrap px-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-700"
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-royal-500" />
        </div>
      ))}
    </div>
  );
}

/**
 * Auto-scrolling strip of short labels (credentials, carriers). CSS-driven; it
 * pauses on hover and via a 44px pause/play toggle (WCAG 2.2.2). Under reduced
 * motion the labels render as a static wrapped list. The visible track is
 * decorative; the real list lives in an sr-only block for assistive tech.
 */
export function MarqueeStrip({ items, srIntro, className }: MarqueeStripProps) {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <div className={className}>
      {reduce ? (
        <div aria-hidden className="px-4">
          <MarqueeTrack items={items} className="w-full shrink flex-wrap justify-center gap-y-3" />
        </div>
      ) : (
        // `group` + `relative` wrap only the track and its toggle so hovering the
        // button pauses too and the button centres on the track, not the padding.
        <div className="group relative">
          {/* motion-reduce: classes cover the no-JS / pre-hydration window. */}
          <div
            aria-hidden
            className="overflow-hidden mask-fade-x motion-reduce:[mask-image:none] motion-reduce:[-webkit-mask-image:none]"
          >
            <div
              className={cn(
                "flex w-max animate-marquee group-hover:[animation-play-state:paused]",
                paused && "[animation-play-state:paused]",
                "motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center motion-reduce:px-4",
              )}
            >
              <MarqueeTrack
                items={items}
                className="motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3"
              />
              <MarqueeTrack items={items} className="motion-reduce:hidden" />
            </div>
          </div>
          <button
            type="button"
            aria-pressed={paused}
            aria-label="Pause scrolling carrier list"
            onClick={() => setPaused((value) => !value)}
            className={cn(
              "absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full",
              "bg-white text-ink-700 shadow-card ring-1 ring-ink-900/10 transition-colors duration-300",
              "hover:text-ink-950 hover:ring-ink-900/25 motion-reduce:hidden sm:right-6",
            )}
          >
            {paused ? (
              <Play aria-hidden className="ml-0.5 size-4 fill-current" />
            ) : (
              <Pause aria-hidden className="size-4 fill-current" />
            )}
          </button>
        </div>
      )}

      <div className="sr-only">
        <p>{srIntro}</p>
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
