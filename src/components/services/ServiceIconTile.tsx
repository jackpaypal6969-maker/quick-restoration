import { Check } from "lucide-react";
import type { ServiceIconKey } from "@/config/site";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { padIndex } from "@/components/services/helpers";

export type ServiceIconTileVariant = "medallion" | "bubble";

interface ServiceIconTileProps {
  icon: ServiceIconKey;
  /** 0-based position in the services list; rendered as a faint "01" watermark (medallion variant only). */
  index: number;
  /**
   * "medallion" (default): small glass medallion bottom-left ("md") or centred ("lg") over the
   * numeral watermark; carries `title`/`items` on the /services feature rows.
   * "bubble": one large centred glass bubble with a cyan glow and an outer ring, no numeral;
   * the home-page ServiceCard tile. `size`, `title` and `items` are ignored.
   */
  variant?: ServiceIconTileVariant;
  /** "md" = card header (icon bottom-left); "lg" = feature row (icon centred). */
  size?: "md" | "lg";
  /**
   * Content for feature-row tiles: the service name (set in Syne) and a short
   * list, typically the first three features. When `title` is set the medallion
   * moves to the top-left and the copy sits bottom-left over the bloom.
   */
  title?: string;
  items?: readonly string[];
  /** Aspect ratio, rounding, ring: supplied by the caller. */
  className?: string;
}

const medallionClass =
  "glass flex items-center justify-center rounded-full text-electric-300 " +
  "shadow-[0_0_0_1px_rgb(34_211_238/0.12)] transition-shadow duration-500 ease-out-expo group-hover:shadow-glow";

/**
 * Midnight tile with a violet/cyan bloom and a faint grid, carrying either the
 * service icon in a glass medallion over a numeral watermark (default) or one
 * large centred glass bubble (variant="bubble"). Every service gets this
 * treatment so grids stay uniform whether or not a photo exists. Place inside
 * a `group` and the bloom (and the bubble's glow) brighten on hover.
 */
export function ServiceIconTile({
  icon,
  index,
  variant = "medallion",
  size = "md",
  title,
  items,
  className,
}: ServiceIconTileProps) {
  const bubble = variant === "bubble";
  const large = size === "lg";
  const withContent = !bubble && Boolean(title);
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-midnight-900 text-white",
        withContent && "flex flex-col justify-between gap-8 p-7 xl:p-8",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30" />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 opacity-70 transition-[opacity,transform] duration-500 ease-out-expo",
          "bg-[radial-gradient(70%_65%_at_88%_8%,rgb(91_33_214/0.62),transparent_70%),radial-gradient(60%_60%_at_8%_100%,rgb(34_211_238/0.3),transparent_70%)]",
          "group-hover:scale-110 group-hover:opacity-100",
        )}
      />
      {!bubble && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-2 -z-10 select-none font-display font-bold leading-none tracking-tighter text-white/6",
            large || withContent ? "-bottom-5 text-[7rem] sm:text-[11rem]" : "-bottom-3 text-[6.5rem]",
          )}
        >
          {padIndex(index)}
        </span>
      )}
      {bubble ? (
        /* Centred stage; absolute so the caller's display (hidden / sm:block) is untouched. */
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-24 md:size-28">
            {/* Soft cyan glow behind the bubble (≈18% at rest); brightens on card hover, opacity only. */}
            <span
              aria-hidden
              className="absolute -inset-[20%] rounded-full bg-electric-400/22 opacity-80 blur-2xl transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
            />
            {/* Faint outer ring, 20% larger than the bubble, for depth. */}
            <span aria-hidden className="absolute -inset-[10%] rounded-full ring-1 ring-white/5" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/5 text-electric-300 ring-1 ring-white/15 backdrop-blur-md">
              <ServiceIcon icon={icon} className="size-10 md:size-11" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      ) : withContent ? (
        <>
          <span className={cn(medallionClass, "size-16")}>
            <ServiceIcon icon={icon} size={28} strokeWidth={1.75} />
          </span>
          <div className="max-w-sm">
            <p className="font-display text-2xl font-bold leading-tight xl:text-3xl">{title}</p>
            {items && items.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2 text-sm leading-snug text-white/75">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div
          className={cn(
            medallionClass,
            "absolute",
            large ? "left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2" : "bottom-5 left-5 size-14",
          )}
        >
          <ServiceIcon icon={icon} size={large ? 40 : 26} strokeWidth={large ? 1.5 : 1.75} />
        </div>
      )}
    </div>
  );
}
