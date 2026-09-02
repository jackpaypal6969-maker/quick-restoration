"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LegalTocItem {
  id: string;
  heading: string;
}

interface LegalTocProps {
  items: LegalTocItem[];
}

/** Thin band near the top of the viewport; the section crossing it is the current one. */
const OBSERVER_MARGIN = "-20% 0px -70% 0px";

/**
 * "On this page" index for legal documents. Plain anchor links on the server;
 * once mounted, an IntersectionObserver marks the section under the reader
 * with aria-current. Nothing here is required for navigation to work.
 */
export function LegalToc({ items }: LegalTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // A stable key for the effect so re-renders from setActiveId do not rebuild the observer.
  const ids = items.map((item) => item.id).join(" ");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = ids
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive in document order; the first one inside the band wins.
        // Sections leaving the band are ignored so the last hit sticks between sections.
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: OBSERVER_MARGIN },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [ids]);

  return (
    <nav aria-label="On this page" className="sticky top-32">
      <p className="eyebrow text-ink-500">On this page</p>
      <ol className="mt-4 border-l border-ink-200">
        {items.map((item) => {
          const current = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px flex min-h-11 items-center border-l border-transparent py-2 pl-4 text-sm leading-snug text-ink-500",
                  "transition-colors duration-200 hover:border-royal-600 hover:text-ink-950",
                  current && "border-royal-600 font-semibold text-ink-950",
                )}
              >
                {item.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
