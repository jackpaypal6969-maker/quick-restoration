import { LI_COUNTY_PATHS, LI_MAP_VIEWBOX, SERVICE_COUNTIES } from "@/data/long-island-map";
import { cn } from "@/lib/utils";

export interface LongIslandWatermarkProps {
  className?: string;
  /** "dark" = faint white on midnight surfaces, "light" = faint ink on white/ice. */
  tone?: "dark" | "light";
}

const TONE: Record<NonNullable<LongIslandWatermarkProps["tone"]>, { fill: string; stroke: string }> = {
  dark: {
    fill: "rgb(255 255 255 / 0.03)",
    stroke: "rgb(255 255 255 / 0.1)",
  },
  light: {
    // ink-900 (#14102b)
    fill: "rgb(20 16 43 / 0.03)",
    stroke: "rgb(20 16 43 / 0.1)",
  },
};

/**
 * Purely decorative outline of the three service counties (Queens, Nassau,
 * Suffolk), meant to sit behind content in the CTA band and footer. Fills its
 * parent (`absolute inset-0`, cropped with `xMidYMid slice`), so the parent
 * should be `relative isolate`. No text, no hubs, no interaction; hidden from
 * assistive tech. Override placement or size through `className`.
 */
export function LongIslandWatermark({ className, tone = "dark" }: LongIslandWatermarkProps) {
  const { fill, stroke } = TONE[tone];
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={LI_MAP_VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full select-none", className)}
    >
      {SERVICE_COUNTIES.map((key) => (
        <path
          key={key}
          d={LI_COUNTY_PATHS[key]}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
