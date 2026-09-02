import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Service } from "@/config/site";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { ServiceIconTile } from "@/components/services/ServiceIconTile";

interface ServiceCardProps {
  service: Service;
  /** 0-based index in the services list; passed through to the tile (the bubble tile shows no numeral). */
  index: number;
  className?: string;
}

/**
 * Icon-led service card; the whole card is one link (keyboard focus shows the
 * surface-scoped ring from globals.css). Below `sm` it is a compact
 * horizontal row (small glowing icon tile, title, tagline, chevron) so eight
 * services fit on a phone screen or two; from `sm` up it is the tall tile card
 * with one large centred icon bubble. Uniform for all eight services (no
 * photos here).
 *
 * Hover shadow: from `sm` up it crossfades in on an `after:` pseudo-element so
 * only opacity animates (no box-shadow repaint). Below `sm` the row clips
 * overflow (it trims the compact tile's glow), which would clip that
 * pseudo-element too, so the mobile row keeps its box-shadow transition as is.
 */
export function ServiceCard({ service, index, className }: ServiceCardProps) {
  const titleId = `service-card-${service.slug}-title`;
  const taglineId = `service-card-${service.slug}-tagline`;

  return (
    <Link
      href={`/services/${service.slug}`}
      aria-labelledby={titleId}
      aria-describedby={taglineId}
      className={cn(
        "group relative isolate flex h-full items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-900/5",
        "sm:flex-col sm:items-stretch sm:gap-0 sm:overflow-visible sm:rounded-3xl sm:p-0",
        "transition-transform duration-300 ease-out-expo hover:-translate-y-1",
        "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:shadow-card-hover after:opacity-0 after:transition-opacity after:duration-300 after:ease-out-expo hover:after:opacity-100",
        "max-sm:transition-[transform,translate,box-shadow] max-sm:hover:shadow-card-hover",
        className,
      )}
    >
      {/* Compact tile (below sm): midnight square with a cyan glow. */}
      <span
        aria-hidden
        className={cn(
          "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-midnight-900 text-electric-300",
          "shadow-[0_0_0_1px_rgb(34_211_238/0.25),0_10px_24px_-10px_rgb(34_211_238/0.6)] transition-shadow duration-300 ease-out-expo group-hover:shadow-glow",
          "sm:hidden",
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(70%_65%_at_88%_8%,rgb(91_33_214/0.62),transparent_70%),radial-gradient(60%_60%_at_8%_100%,rgb(34_211_238/0.3),transparent_70%)]" />
        <ServiceIcon icon={service.icon} size={26} className="relative" />
      </span>

      {/* Tall tile (sm and up). The card no longer clips overflow at sm, so the tile rounds its own top corners. */}
      <ServiceIconTile
        icon={service.icon}
        index={index}
        variant="bubble"
        className="hidden aspect-[16/10] sm:block sm:rounded-t-3xl"
      />

      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-3 sm:p-6">
        <h3
          id={titleId}
          className="font-display text-lg font-bold leading-tight text-ink-950 sm:min-h-[2.5em] sm:text-xl"
        >
          {service.shortName}
        </h3>
        <p id={taglineId} className="text-sm leading-snug text-ink-700 sm:leading-relaxed">
          {service.tagline}
        </p>
        <span className="mt-auto hidden items-center gap-2 pt-2 text-sm font-semibold text-royal-600 sm:inline-flex">
          Learn more
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
          />
        </span>
      </span>

      <ChevronRight
        aria-hidden
        className="size-5 shrink-0 text-royal-600 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 sm:hidden"
      />
    </Link>
  );
}
