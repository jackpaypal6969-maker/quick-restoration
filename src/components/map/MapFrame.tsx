import type { ReactNode } from "react";
import { serviceAreas, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface MapFrameProps {
  children: ReactNode;
  className?: string;
  /** Replace the default legend row; pass null to hide it. */
  legend?: ReactNode | null;
}

/** Midnight panel that houses the map: grid texture, one violet glow, a quiet legend. */
export function MapFrame({ children, className, legend }: MapFrameProps) {
  const footer = legend === undefined ? <MapLegend /> : legend;
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-midnight-900/70 p-4 shadow-card-dark ring-1 ring-white/10 sm:p-6 lg:p-8",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_33_214/0.32),transparent_72%)] blur-2xl"
      />
      {children}
      {footer && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-white/50 sm:mt-7">
          {footer}
        </div>
      )}
    </div>
  );
}

function MapLegend() {
  return (
    <>
      <span className="inline-flex items-center gap-2.5">
        <span
          aria-hidden
          className="size-2 rounded-full bg-electric-300 shadow-[0_0_10px_2px_rgb(34_211_238/0.55)]"
        />
        Dispatch hubs
      </span>
      <span className="inline-flex items-center gap-2.5">
        <span aria-hidden className="h-2.5 w-4 rounded-sm bg-linear-to-r from-royal-500/60 to-electric-400/60" />
        Service area
      </span>
      <span>
        {serviceAreas.length} counties, target arrival {siteConfig.responseTime.toLowerCase()}
      </span>
    </>
  );
}
