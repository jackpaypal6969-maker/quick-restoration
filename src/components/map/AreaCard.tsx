import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import type { ServiceArea } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { areaHref, countyEyebrow } from "./county-keys";

interface AreaCardProps {
  area: ServiceArea;
}

/**
 * Light card linking to an area page: county, name, headline, response note.
 * The hover shadow crossfades in on an `after:` pseudo-element so only
 * opacity animates (no box-shadow repaint).
 */
export function AreaCard({ area }: AreaCardProps) {
  return (
    <Link
      href={areaHref(area)}
      className="group relative isolate flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/5 transition-transform duration-300 ease-out-expo after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:shadow-card-hover after:opacity-0 after:transition-opacity after:duration-300 after:ease-out-expo hover:-translate-y-1 hover:after:opacity-100 sm:p-8"
    >
      <Eyebrow>{countyEyebrow(area)}</Eyebrow>
      <span className="mt-3 block font-display text-2xl font-bold leading-tight text-ink-950">{area.name}</span>
      <span className="mt-2 block text-base leading-relaxed text-ink-700">{area.headline}</span>
      <span className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-ink-500">
        <Timer aria-hidden className="mt-0.5 size-4 shrink-0 text-royal-600" />
        {area.responseNote}
      </span>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-royal-600">
        Explore {area.shortName}
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
