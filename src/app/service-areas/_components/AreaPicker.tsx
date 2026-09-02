"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { serviceAreas } from "@/config/site";
import type { ServiceCountyKey } from "@/data/long-island-map";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LongIslandMap } from "@/components/map/LongIslandMap";
import { MapFrame } from "@/components/map/MapFrame";
import { areaHref, countyEyebrow, countyKeyFor } from "@/components/map/county-keys";

/**
 * Full-width map with the three county cards beneath it, for /service-areas.
 * Each card is one link to its area page; hovering or focusing a card lights up
 * its county on the map, and hovering a county lights up its card.
 */
export function AreaPicker() {
  const [active, setActive] = useState<ServiceCountyKey | null>(null);

  return (
    <>
      <Reveal className="mx-auto mt-12 max-w-5xl md:mt-16" y={20}>
        <MapFrame>
          <LongIslandMap interactive active={active} onHover={setActive} />
        </MapFrame>
      </Reveal>

      <ul className="mt-8 grid gap-5 md:mt-10 md:grid-cols-3">
        {serviceAreas.map((area, i) => {
          const key = countyKeyFor(area);
          const isActive = active === key;
          return (
            <Reveal key={area.slug} as="li" delay={i * 0.08} y={20} className="flex">
              <Link
                href={areaHref(area)}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(key)}
                onBlur={() => setActive(null)}
                className={cn(
                  "group flex w-full flex-col rounded-3xl bg-white/5 p-6 shadow-card-dark ring-1 ring-white/10 sm:p-8",
                  // box-shadow stays in the transition list: there is no hover shadow here, it eases the
                  // active ring colour (a ring utility sharing box-shadow with shadow-card-dark's inset line).
                  "transition-[transform,translate,background-color,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:bg-white/8",
                  isActive && "bg-white/8 ring-electric-400/50",
                )}
              >
                <Eyebrow tone="dark">{countyEyebrow(area)}</Eyebrow>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white sm:text-2xl">{area.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{area.headline}</p>
                <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-white/80">
                  <Timer aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" />
                  {area.responseNote}
                </p>
                <span
                  className={cn(
                    "mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-white/80 transition-colors duration-300",
                    "group-hover:text-electric-300",
                    isActive && "text-electric-300",
                  )}
                >
                  Explore {area.name}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </>
  );
}
