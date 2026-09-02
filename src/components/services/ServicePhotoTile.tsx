import Image from "next/image";
import { Check } from "lucide-react";
import type { ServiceIconKey } from "@/config/site";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/services/ServiceIcon";

interface ServicePhotoTileProps {
  image: string;
  imageAlt: string;
  icon: ServiceIconKey;
  title: string;
  items?: readonly string[];
  /** Load eagerly for the first tile on the page. */
  priority?: boolean;
  className?: string;
}

/**
 * Photograph tile for the /services feature rows: the service photo under a
 * midnight gradient, a small glass icon bubble top-left, the service name and
 * up to three features bottom-left. Features are hidden below lg (the row
 * lists them separately there). Place inside a `group`: the photo eases in
 * slightly on hover.
 */
export function ServicePhotoTile({ image, imageAlt, icon, title, items, priority, className }: ServicePhotoTileProps) {
  return (
    <div
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden bg-midnight-900 p-6 text-white sm:p-7 xl:p-8",
        className,
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 48vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      {/* Legibility gradient: clear at the top, midnight at the bottom where the copy sits. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-midnight-950/92 via-midnight-950/45 to-midnight-950/10"
      />
      <div aria-hidden className="absolute inset-0 bg-grid-faint opacity-20" />
      <span
        aria-hidden
        className="glass absolute left-6 top-6 flex size-12 items-center justify-center rounded-full text-electric-300 shadow-[0_0_0_1px_rgb(34_211_238/0.15)] sm:left-7 sm:top-7 xl:left-8 xl:top-8"
      >
        <ServiceIcon icon={icon} className="size-5" />
      </span>
      <div className="relative flex flex-col gap-4">
        <p className="font-display text-2xl font-bold leading-tight xl:text-3xl">{title}</p>
        {items && items.length > 0 && (
          <ul className="hidden flex-col gap-2 lg:flex">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
