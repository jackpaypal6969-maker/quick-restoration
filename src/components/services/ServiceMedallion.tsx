import type { ServiceIconKey } from "@/config/site";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { padIndex } from "@/components/services/helpers";

type MedallionSize = "sm" | "md" | "lg";

interface ServiceMedallionProps {
  icon: ServiceIconKey;
  /** sm = 64px (beside a heading), md = 96px (clusters), lg = 160px (hero art). */
  size?: MedallionSize;
  /** "dark" = glass ring on midnight surfaces; "light" = solid midnight disc on white. */
  tone?: "dark" | "light";
  className?: string;
}

const sizes: Record<MedallionSize, { box: string; icon: number; stroke: number }> = {
  sm: { box: "size-16", icon: 28, stroke: 1.75 },
  md: { box: "size-24", icon: 40, stroke: 1.5 },
  lg: { box: "size-40", icon: 64, stroke: 1.25 },
};

/** Round icon badge shared by hero artwork and the /services feature rows. Decorative. */
export function ServiceMedallion({ icon, size = "sm", tone = "dark", className }: ServiceMedallionProps) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-electric-300",
        tone === "dark" ? "glass shadow-[0_0_0_1px_rgb(34_211_238/0.12)]" : "bg-midnight-900 shadow-glow",
        s.box,
        className,
      )}
    >
      <ServiceIcon icon={icon} size={s.icon} strokeWidth={s.stroke} />
    </span>
  );
}

interface ServiceHeroArtProps {
  icon: ServiceIconKey;
  /** 0-based position in the services list; rendered as the faint numeral watermark. */
  index: number;
}

/**
 * Hero artwork for photo-less service pages: a large glass medallion inside
 * two faint rings, a soft cyan glow and the Syne numeral watermark the cards
 * use. Decorative only; PageHero hides its `art` slot from assistive tech.
 */
export function ServiceHeroArt({ icon, index }: ServiceHeroArtProps) {
  return (
    <div className="relative flex size-64 items-center justify-center xl:size-80">
      <div className="absolute inset-6 rounded-full bg-electric-400/15 blur-3xl" />
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-8 rounded-full border border-electric-300/15" />
      <span className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-[9rem] font-bold leading-none tracking-tighter text-white/6 xl:text-[11rem]">
        {padIndex(index)}
      </span>
      <ServiceMedallion icon={icon} size="lg" className="relative shadow-glow motion-safe:animate-float" />
    </div>
  );
}
