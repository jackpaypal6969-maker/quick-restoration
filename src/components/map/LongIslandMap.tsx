"use client";

import { useId, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { m } from "motion/react";
import { siteConfig } from "@/config/site";
import {
  CONTEXT_COUNTIES,
  LI_COUNTY_LABELS,
  LI_COUNTY_PATHS,
  LI_MAP_HEIGHT,
  LI_MAP_VIEWBOX,
  LI_MAP_WIDTH,
  SERVICE_COUNTIES,
  type ServiceCountyKey,
} from "@/data/long-island-map";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";
import { COUNTY_META } from "./county-keys";

export interface LongIslandMapProps {
  /** County to hold in the highlighted state (e.g. the page's own county). */
  active?: ServiceCountyKey | null;
  /** Fires with the hovered/focused county, or null when the pointer leaves. */
  onHover?: (county: ServiceCountyKey | null) => void;
  /**
   * When provided, counties render as keyboard-operable buttons that call this
   * instead of navigating. Omit it and counties render as links to their area page.
   */
  onSelect?: (county: ServiceCountyKey) => void;
  /** Enables hover, focus and click on the highlighted counties. */
  interactive?: boolean;
  className?: string;
  /** Accessible name for the whole map. */
  label?: string;
}

/** Where each county label sits relative to its dispatch hub so it never covers the coast. */
const LABEL_PLACEMENT: Record<ServiceCountyKey, "right" | "below-left"> = {
  suffolk: "right",
  nassau: "right",
  queens: "below-left",
};

/**
 * Radius (SVG user units) of the invisible hit circle centred on each dispatch hub,
 * so small counties still offer a 44px tap target on phones (the map is ~290px wide
 * at 360px viewports, i.e. 0.29px per unit; r=76 gives a 44px circle). A later
 * county's circle sits above an earlier county's shape, so each radius must stay
 * clear of the counties drawn before it in SERVICE_COUNTIES order (queens, nassau,
 * suffolk): Nassau's hub is ~42 units from Queens' coastline, hence its smaller value.
 */
const HIT_RADIUS: Record<ServiceCountyKey, number> = {
  queens: 76,
  nassau: 36,
  suffolk: 76,
};

const STROKE_BASE = "#67e8f9"; // electric-300
const STROKE_HIGH = "#d9fbff"; // electric-100

const DEFAULT_LABEL = `Map of Long Island highlighting ${siteConfig.name}'s service area: ${SERVICE_COUNTIES.map(
  (key) => COUNTY_META[key].name,
).join(", ")}.`;

/** True for an unmodified left click, i.e. one the router should handle client-side. */
function isPlainLeftClick(event: MouseEvent) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Inline SVG of Long Island with the three service counties drawn as a glowing
 * violet-to-cyan highlight over faint neighbouring boroughs. Dispatch hubs pulse
 * at each county's label anchor. Scales to its container; nothing overflows.
 */
export function LongIslandMap({
  active = null,
  onHover,
  onSelect,
  interactive = false,
  className,
  label = DEFAULT_LABEL,
}: LongIslandMapProps) {
  const router = useRouter();
  const reduce = usePrefersReducedMotion();
  // useId output contains punctuation; strip it so url(#id) references stay unambiguous.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `li-fill-${uid}`;
  const glowId = `li-glow-${uid}`;
  const [hovered, setHovered] = useState<ServiceCountyKey | null>(null);

  const highlight = hovered ?? active;

  const setHover = (county: ServiceCountyKey | null) => {
    setHovered(county);
    onHover?.(county);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={LI_MAP_VIEWBOX}
        className="h-auto w-full overflow-visible"
        role={interactive ? "group" : "img"}
        aria-label={label}
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={LI_MAP_HEIGHT}
            x2={LI_MAP_WIDTH}
            y2="0"
          >
            <stop offset="0%" stopColor="#6d32f0" />
            <stop offset="55%" stopColor="#3f7fe8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id={glowId} x="-15%" y="-25%" width="130%" height="150%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Neighbouring boroughs and Westchester: quiet context only. */}
        <g aria-hidden>
          {CONTEXT_COUNTIES.map((key) => (
            <path
              key={key}
              d={LI_COUNTY_PATHS[key]}
              fill="rgb(255 255 255 / 0.06)"
              stroke="rgb(255 255 255 / 0.1)"
              strokeWidth={1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Soft outer glow: blurred duplicates under the service counties. */}
        <g aria-hidden filter={`url(#${glowId})`}>
          {SERVICE_COUNTIES.map((key) => (
            <path
              key={key}
              d={LI_COUNTY_PATHS[key]}
              fill="#22d3ee"
              className="transition-opacity duration-500 ease-out-expo"
              style={{ opacity: highlight === key ? 0.55 : highlight ? 0.14 : 0.24 }}
            />
          ))}
        </g>

        {/* Service counties. */}
        {SERVICE_COUNTIES.map((key) => {
          const meta = COUNTY_META[key];
          const isHigh = highlight === key;
          const dimmed = highlight !== null && !isHigh;
          const shape = (
            <path
              d={LI_COUNTY_PATHS[key]}
              fill={`url(#${gradientId})`}
              stroke={isHigh ? STROKE_HIGH : STROKE_BASE}
              strokeWidth={isHigh ? 1.5 : 1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="transition-[fill-opacity,stroke-opacity,stroke] duration-500 ease-out-expo"
              style={{
                fillOpacity: isHigh ? 0.72 : dimmed ? 0.3 : 0.45,
                strokeOpacity: isHigh ? 1 : 0.6,
              }}
            />
          );

          if (!interactive) return <g key={key}>{shape}</g>;

          // Invisible, pointer-active circle around the hub: enlarges the tap target.
          const hitArea = (
            <circle
              cx={LI_COUNTY_LABELS[key].x}
              cy={LI_COUNTY_LABELS[key].y}
              r={HIT_RADIUS[key]}
              fill="transparent"
              stroke="none"
              pointerEvents="all"
            />
          );

          const a11yLabel = `${meta.name} - view service area`;
          const pointer = {
            onMouseEnter: () => setHover(key),
            onMouseLeave: () => setHover(null),
            onFocus: () => setHover(key),
            onBlur: () => setHover(null),
          };

          if (onSelect) {
            const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(key);
              }
            };
            return (
              <g
                key={key}
                role="button"
                tabIndex={0}
                aria-label={a11yLabel}
                aria-pressed={active === key}
                className="cursor-pointer"
                onClick={() => onSelect(key)}
                onKeyDown={onKeyDown}
                {...pointer}
              >
                {hitArea}
                {shape}
              </g>
            );
          }

          // Real href for no-JS, middle-click and "open in new tab"; plain left
          // clicks go through the router so the page does not fully reload.
          const onClick = (event: MouseEvent) => {
            if (!isPlainLeftClick(event)) return;
            event.preventDefault();
            router.push(meta.href);
          };

          return (
            <a
              key={key}
              href={meta.href}
              aria-label={a11yLabel}
              aria-current={active === key ? "page" : undefined}
              className="cursor-pointer"
              onClick={onClick}
              {...pointer}
            >
              {hitArea}
              {shape}
            </a>
          );
        })}
      </svg>

      {/* Dispatch hubs + labels live in HTML so they stay crisp at every map size. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SERVICE_COUNTIES.map((key, index) => {
          const { x, y } = LI_COUNTY_LABELS[key];
          const isHigh = highlight === key;
          const placement = LABEL_PLACEMENT[key];
          return (
            <div
              key={key}
              className="absolute size-0"
              style={{ left: `${(x / LI_MAP_WIDTH) * 100}%`, top: `${(y / LI_MAP_HEIGHT) * 100}%` }}
            >
              <HubRings index={index} reduce={reduce} />
              <span
                className={cn(
                  "absolute -left-[5px] -top-[5px] size-2.5 rounded-full bg-electric-300 transition-transform duration-300 ease-out-expo",
                  "shadow-[0_0_0_3px_rgb(34_211_238/0.22),0_0_18px_4px_rgb(34_211_238/0.55)]",
                  isHigh && "scale-125",
                )}
              />
              <span
                className={cn(
                  "absolute whitespace-nowrap font-sans text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300",
                  "[font-feature-settings:normal] [text-shadow:0_1px_10px_rgb(7_4_26/0.9)]",
                  placement === "right" ? "left-4 top-0 -translate-y-1/2" : "-left-2 top-4",
                  isHigh ? "text-white" : "text-white/80",
                )}
              >
                {COUNTY_META[key].shortName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RING_COUNT = 3;
const RING_CLASS = "absolute -left-5 -top-5 size-10 rounded-full border border-electric-300";

/** Concentric static rings for reduced motion: one element per animated ring so the DOM shape matches. */
const STATIC_RINGS = [
  "absolute -left-3 -top-3 size-6 rounded-full border border-electric-300/45",
  "absolute -left-5 -top-5 size-10 rounded-full border border-electric-300/25",
  "absolute -left-7 -top-7 size-14 rounded-full border border-electric-300/10",
] as const;

function HubRings({ index, reduce }: { index: number; reduce: boolean }) {
  if (reduce) {
    return (
      <>
        {STATIC_RINGS.map((ringClass) => (
          <span key={ringClass} className={ringClass} />
        ))}
      </>
    );
  }
  return (
    <>
      {Array.from({ length: RING_COUNT }, (_, ring) => (
        <m.span
          key={ring}
          className={RING_CLASS}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 2.2], opacity: [0.7, 0] }}
          transition={{
            duration: 2.8,
            ease: "easeOut",
            repeat: Infinity,
            delay: index * 0.45 + ring * 0.95,
          }}
        />
      ))}
    </>
  );
}
