import { siteConfig, serviceAreas } from "@/config/site";
import { cn } from "@/lib/utils";

interface ResponsePulseProps {
  className?: string;
}

/** "Nassau, Suffolk & Queens" from the configured service areas. */
function countyList() {
  const names = serviceAreas.map((area) => area.county);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

/**
 * The hero's signature moment: a floating glass card with a cyan dot emitting
 * staggered rings. Pure CSS animation (theme keyframes), so it stays a server
 * component and is neutralised automatically under prefers-reduced-motion.
 */
export function ResponsePulse({ className }: ResponsePulseProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Soft glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-electric-400/15 blur-3xl"
      />
      <div className="animate-float">
        <div className="glass w-[320px] rounded-3xl p-6 shadow-card-dark">
          <div className="flex items-center gap-3.5">
            <span aria-hidden className="relative flex size-5 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-electric-400/50" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-electric-400/40 [animation-delay:0.85s]" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-electric-400/30 [animation-delay:1.7s]" />
              <span className="relative size-2.5 rounded-full bg-electric-400 shadow-[0_0_14px_3px_rgb(34_211_238/0.65)]" />
            </span>
            <span className="eyebrow text-white/60">Target arrival</span>
          </div>
          <p className="mt-5 font-display text-3xl font-bold leading-none tracking-tight text-white">
            {siteConfig.responseTime}
          </p>
          <p className="mt-3 text-sm leading-snug text-white/60">Crews staged across {countyList()}</p>
        </div>
      </div>
    </div>
  );
}
