import { BadgeDollarSign, Camera, ChevronRight, FileText, Phone, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ClaimFlowProps {
  /** "dark" = glass nodes with cyan on midnight, "light" = frosted white with violet. */
  tone?: "dark" | "light";
  className?: string;
}

interface FlowStep {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

const STEPS: FlowStep[] = [
  { icon: Phone, label: "Call", sublabel: "Live dispatcher, 24/7" },
  { icon: Camera, label: "Document", sublabel: "Photos + moisture map, day one" },
  { icon: FileText, label: "Estimate", sublabel: "Written in your adjuster's software" },
  { icon: BadgeDollarSign, label: "Direct bill", sublabel: "Most covered losses: $0 beyond deductible" },
];

/* One pulse crosses the whole flow every 6s: each connector animates for a third
   of the loop, offset by its index, so the dot appears to hand off node to node.
   Transform/opacity only; removed entirely under reduced motion. */
const DOT_LOOP_SECONDS = 6;
const DOT_CSS = `
@keyframes qr-claim-dot {
  0% { transform: translateX(-100%); opacity: 0; }
  4% { opacity: 1; }
  29% { opacity: 1; }
  33.333%, 100% { transform: translateX(0); opacity: 0; }
}
.qr-claim-dot {
  animation: qr-claim-dot ${DOT_LOOP_SECONDS}s linear infinite;
  animation-delay: var(--qr-claim-delay, 0s);
}
@media (prefers-reduced-motion: reduce) {
  .qr-claim-dot { animation: none; opacity: 0; }
}
`;

const TONE = {
  dark: {
    node: "glass text-electric-300 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
    label: "text-white",
    sub: "text-white/55",
    line: "bg-linear-to-r from-electric-400 to-royal-400 opacity-40",
    rail: "bg-linear-to-b from-electric-400 to-royal-400 opacity-30",
    chevron: "text-royal-300/70",
    dot: "bg-electric-300 shadow-[0_0_10px_2px_rgb(34_211_238/0.55)]",
  },
  light: {
    node: "glass-light text-royal-600 shadow-card",
    label: "text-ink-900",
    sub: "text-ink-500",
    line: "bg-ink-200",
    rail: "bg-ink-200",
    chevron: "text-ink-300",
    dot: "bg-royal-500 shadow-[0_0_8px_1px_rgb(109_50_240/0.35)]",
  },
} as const;

/**
 * Compact four-node flow showing how a claim moves: Call -> Document ->
 * Estimate -> Direct bill. Horizontal from the `sm` breakpoint with thin
 * connectors and a slow travelling dot; a stacked list with a hairline rail on
 * phones. Meant for the Insurance section and the insurance FAQ/contact
 * pages. Rendered as an ordered list so the sequence is meaningful to screen
 * readers. Server component; the only CSS is a hoisted, deduplicated
 * `<style>` for the dot keyframes.
 */
export function ClaimFlow({ tone = "dark", className }: ClaimFlowProps) {
  const t = TONE[tone];

  return (
    <>
      <style href="qr-claim-flow" precedence="default">
        {DOT_CSS}
      </style>
      <ol
        aria-label="How your insurance claim moves"
        className={cn("flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0", className)}
      >
        {STEPS.map(({ icon: Icon, label, sublabel }, index) => {
          const last = index === STEPS.length - 1;
          const delay = { "--qr-claim-delay": `${(index * DOT_LOOP_SECONDS) / (STEPS.length - 1)}s` } as CSSProperties;

          return (
            <li
              key={label}
              className="relative flex min-w-0 flex-1 items-start gap-4 sm:flex-col sm:items-center sm:gap-0 sm:px-2 sm:text-center"
            >
              <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-full", t.node)}>
                <Icon aria-hidden className="size-6" strokeWidth={1.75} />
              </span>

              <span className="min-w-0 pt-2 sm:pt-4">
                <span className={cn("block font-display text-sm font-semibold", t.label)}>{label}</span>
                <span className={cn("mt-1 block text-xs leading-snug", t.sub)}>{sublabel}</span>
              </span>

              {!last && (
                <>
                  {/* Stacked layout: hairline rail from this node down to the next one. */}
                  <span
                    aria-hidden
                    className={cn("pointer-events-none absolute -bottom-6 left-7 top-14 w-px sm:hidden", t.rail)}
                  />

                  {/* Row layout: connector from this node's edge to the next node's edge. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[calc(50%+2.25rem)] right-[calc(-50%+2.25rem)] top-7 hidden h-px sm:block"
                  >
                    <span className={cn("absolute inset-0", t.line)} />
                    <ChevronRight
                      aria-hidden
                      className={cn("absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2", t.chevron)}
                      strokeWidth={2.5}
                    />
                    <span className="qr-claim-dot absolute inset-0" style={delay}>
                      <span className={cn("absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full", t.dot)} />
                    </span>
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
