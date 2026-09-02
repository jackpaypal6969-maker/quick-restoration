"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/layout/hooks";
import { cn } from "@/lib/utils";

export type AccordionTone = "light" | "dark";

interface AccordionContextValue {
  tone: AccordionTone;
  openValues: readonly string[];
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  children: ReactNode;
  className?: string;
  /** "light" on white / ice surfaces, "dark" on midnight surfaces. */
  tone?: AccordionTone;
  /** "single" keeps at most one item open; "multiple" lets any number stay open. */
  type?: "single" | "multiple";
  /** Item values that start open. In "single" mode only the first is honoured. */
  defaultOpen?: string[];
}

const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

/**
 * Accessible disclosure group. Each <AccordionItem> renders a native button
 * (Enter / Space toggle for free) with aria-expanded + aria-controls; the
 * group handles ArrowUp / ArrowDown / Home / End between headers.
 */
export function Accordion({
  children,
  className,
  tone = "light",
  type = "single",
  defaultOpen = [],
}: AccordionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openValues, setOpenValues] = useState<string[]>(() =>
    type === "single" ? defaultOpen.slice(0, 1) : defaultOpen,
  );

  const toggle = useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        const isOpen = prev.includes(value);
        if (type === "single") return isOpen ? [] : [value];
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      });
    },
    [type],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.has(event.key)) return;
    const root = rootRef.current;
    if (!root) return;
    // Only this accordion's headers, so a nested accordion keeps its own ring.
    const headers = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-accordion-header]")).filter(
      (el) => el.closest("[data-accordion-root]") === root,
    );
    const current = headers.indexOf(event.target as HTMLButtonElement);
    if (current === -1) return; // key came from panel content, let it scroll
    event.preventDefault();
    const last = headers.length - 1;
    let next = current;
    if (event.key === "ArrowDown") next = current === last ? 0 : current + 1;
    else if (event.key === "ArrowUp") next = current === 0 ? last : current - 1;
    else if (event.key === "Home") next = 0;
    else next = last;
    headers[next]?.focus();
  };

  const ctx = useMemo<AccordionContextValue>(() => ({ tone, openValues, toggle }), [tone, openValues, toggle]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-accordion-root
        className={cn("flex flex-col gap-3", className)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  /** Unique within the parent <Accordion>. */
  value: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  /** Heading level wrapping the trigger so items sit correctly in the outline. */
  headingLevel?: 2 | 3 | 4;
}

export function AccordionItem({ value, title, children, className, headingLevel = 3 }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("<AccordionItem> must be rendered inside <Accordion>.");
  const { tone, openValues, toggle } = ctx;

  const open = openValues.includes(value);
  const reduce = usePrefersReducedMotion();
  const baseId = useId();
  const headerId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;
  const dark = tone === "dark";
  const Heading: "h2" | "h3" | "h4" = `h${headingLevel}`;

  const body = (
    <div
      className={cn(
        "px-5 pb-5 text-[15px] leading-relaxed sm:px-6 sm:pb-6",
        dark ? "text-white/70" : "text-ink-700",
      )}
    >
      {children}
    </div>
  );

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors duration-300",
        dark ? "border-white/10 bg-white/[0.03]" : "border-ink-900/10 bg-white",
        open && (dark ? "border-electric-400/30 bg-white/5" : "border-royal-500/30 bg-ice-50"),
        className,
      )}
    >
      <Heading className="m-0">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          data-accordion-header
          onClick={() => toggle(value)}
          className={cn(
            "flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left sm:px-6",
            dark ? "text-white" : "text-ink-950",
          )}
        >
          <span className="font-display text-base font-bold leading-snug tracking-tight sm:text-[17px]">{title}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-5 shrink-0 transition-transform duration-300 ease-out-expo",
              dark ? "text-electric-300" : "text-royal-600",
              open && "rotate-180",
            )}
          />
        </button>
      </Heading>

      {reduce ? (
        open && (
          <div id={panelId} role="region" aria-labelledby={headerId}>
            {body}
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="panel"
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.3, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              {body}
            </m.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
