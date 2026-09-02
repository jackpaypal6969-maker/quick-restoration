import { Droplets, Fan, Gauge, ShieldCheck, Thermometer, Wind, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export interface EquipmentItem {
  icon: LucideIcon;
  label: string;
  /** One short line of what it does. */
  detail: string;
}

/** "What arrives on the truck": the default six tiles. */
export const EQUIPMENT_ITEMS: readonly EquipmentItem[] = [
  { icon: Fan, label: "Air movers", detail: "High-velocity drying" },
  { icon: Droplets, label: "LGR dehumidifiers", detail: "Pull moisture from the air" },
  { icon: Wind, label: "HEPA air scrubbers", detail: "Capture spores and soot" },
  { icon: Thermometer, label: "Thermal imaging", detail: "Find hidden moisture" },
  { icon: Gauge, label: "Moisture meters", detail: "Measured, not guessed" },
  { icon: ShieldCheck, label: "Containment", detail: "Negative-air isolation" },
];

export interface EquipmentStripProps {
  /** Surface the strip sits on. Cyan accents are reserved for dark. */
  tone?: Tone;
  /** Override the default six tiles. */
  items?: readonly EquipmentItem[];
  /** Accessible name for the list. */
  label?: string;
  className?: string;
}

/**
 * Responsive grid of equipment tiles: 2 columns on mobile, 3 on sm, 6 on lg.
 * Tiles lift 2px on hover (transform only, motion-safe).
 */
export function EquipmentStrip({
  tone = "dark",
  items = EQUIPMENT_ITEMS,
  label = "What arrives on the truck",
  className,
}: EquipmentStripProps) {
  const dark = tone === "dark";

  return (
    <ul aria-label={label} className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6", className)}>
      {items.map(({ icon: Icon, label: name, detail }) => (
        <li
          key={name}
          className={cn(
            "flex flex-col rounded-2xl p-4 transition-transform duration-500 ease-out-expo sm:p-5 motion-safe:hover:-translate-y-0.5",
            dark ? "bg-white/5 ring-1 ring-white/10" : "bg-white shadow-card ring-1 ring-ink-900/10",
          )}
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              dark ? "glass text-electric-300" : "bg-royal-100 text-royal-600",
            )}
          >
            <Icon aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <p className={cn("mt-4 font-display text-[15px] font-bold leading-tight", dark ? "text-white" : "text-ink-950")}>
            {name}
          </p>
          <p className={cn("mt-1 text-[13px] leading-relaxed", dark ? "text-white/60" : "text-ink-500")}>{detail}</p>
        </li>
      ))}
    </ul>
  );
}
