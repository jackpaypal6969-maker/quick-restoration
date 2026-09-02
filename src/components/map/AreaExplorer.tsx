"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { serviceAreas } from "@/config/site";
import type { ServiceCountyKey } from "@/data/long-island-map";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { LongIslandMap } from "./LongIslandMap";
import { MapFrame } from "./MapFrame";
import { areaHref, countyKeyFor } from "./county-keys";

interface AreaExplorerProps {
  /** Section heading (server-rendered) placed above the cards. */
  heading: ReactNode;
}

const TOWN_PREVIEW = 6;

/**
 * Pairs the interactive map with three area cards. Hovering or focusing a card
 * lights up its county; hovering a county lights up its card.
 */
export function AreaExplorer({ heading }: AreaExplorerProps) {
  const [active, setActive] = useState<ServiceCountyKey | null>(null);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">{heading}</div>

      <Reveal className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center" y={20}>
        <MapFrame>
          <LongIslandMap interactive active={active} onHover={setActive} />
        </MapFrame>
      </Reveal>

      <ul className="flex flex-col gap-3 lg:col-span-5 lg:col-start-8 lg:row-start-2">
        {serviceAreas.map((area, i) => {
          const key = countyKeyFor(area);
          const isActive = active === key;
          const towns = area.towns.slice(0, TOWN_PREVIEW).join(", ");
          return (
            <Reveal key={area.slug} as="li" delay={0.08 + i * 0.08} y={16}>
              <Link
                href={areaHref(area)}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(key)}
                onBlur={() => setActive(null)}
                className={cn(
                  "group flex items-start gap-4 rounded-3xl bg-white/5 p-5 shadow-card-dark ring-1 ring-white/10 backdrop-blur-sm",
                  "transition-[transform,background-color,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:bg-white/8 sm:p-6",
                  isActive && "bg-white/8 ring-electric-400/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-electric-400/10 text-electric-300 ring-1 ring-electric-400/20 transition-colors duration-300",
                    isActive && "bg-electric-400/20",
                  )}
                >
                  <MapPin aria-hidden className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-display text-xl font-bold leading-tight text-white">{area.name}</span>
                    <ArrowUpRight
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 text-white/40 transition-[transform,color] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-300",
                        isActive && "text-electric-300",
                      )}
                    />
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-white/70">{area.responseNote}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-white/50">{towns} and more</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
