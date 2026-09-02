"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn, telHref } from "@/lib/utils";
import { usePrefersReducedMotion, useScrolledPastViewport } from "./hooks";

const HIDDEN_ON = "/contact";
/** Fraction of the viewport the user must scroll before the bar slides in. */
const REVEAL_AFTER = 0.7;

/**
 * Sticky two-button bar for phones (< md). Stays off-screen until the user has
 * scrolled past most of the first viewport (so it never stacks on the hero
 * CTAs), then slides up. A permanent spacer keeps the footer clear of it, and
 * it stays out of the way on the contact page.
 */
export function MobileCallBar() {
  const pathname = usePathname() ?? "/";
  const visible = useScrolledPastViewport(REVEAL_AFTER);
  const reduce = usePrefersReducedMotion();

  if (pathname === HIDDEN_ON || pathname.startsWith(`${HIDDEN_ON}/`)) return null;

  return (
    <>
      <div aria-hidden className="h-[calc(72px+env(safe-area-inset-bottom))] md:hidden" />
      <div
        data-mobile-call-bar
        className={cn(
          "surface-dark fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-midnight-950/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden",
          reduce ? "transition-none" : "transition-[transform,visibility] duration-300 ease-out-expo",
          visible ? "visible translate-y-0" : "invisible translate-y-full",
        )}
      >
        <div className="grid grid-cols-2 gap-3 p-3">
          <Button
            href={telHref(siteConfig.phone)}
            variant="accent"
            size="md"
            className="w-full shadow-none"
            ariaLabel={`Call now, ${siteConfig.phone}`}
          >
            <Phone aria-hidden className="size-[18px]" />
            Call now
          </Button>
          <Button href="/contact" variant="primary" size="md" className="w-full shadow-none">
            Request help
            <ArrowRight aria-hidden className="size-[18px]" />
          </Button>
        </div>
      </div>
    </>
  );
}
