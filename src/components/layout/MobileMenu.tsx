"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { nav, services, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { telHref } from "@/lib/utils";
import { badgeCredentials } from "./brand-data";
import { usePrefersReducedMotion } from "./hooks";
import { serviceIcons } from "./service-icons";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Root element ref so the Header can trap focus between the toggle and the menu. */
  panelRef: RefObject<HTMLDivElement | null>;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Full-screen midnight overlay for < lg. The Header owns open state, scroll
 * lock, Escape handling and focus return; this component owns layout, entrance
 * motion and focusing the first link on open.
 */
export function MobileMenu({ id, open, onClose, panelRef }: MobileMenuProps) {
  const reduce = usePrefersReducedMotion();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const primary = nav.primary;
  const stagger = (index: number) => (reduce ? 0 : 0.08 + index * 0.05);

  const itemMotion = (index: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay: stagger(index) },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="surface-dark fixed inset-0 z-[45] overflow-x-hidden overflow-y-auto overscroll-contain bg-midnight-950 text-white lg:hidden"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-midnight-radial" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40 mask-fade-x" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-24 size-72 rounded-full bg-electric-400/15 blur-3xl"
          />

          {/* Top padding clears the solid header bar (72px; 36px strip + 80px bar from md). */}
          <Container className="relative flex min-h-full flex-col pt-[calc(72px+1.5rem)] pb-[calc(2rem+env(safe-area-inset-bottom))] md:pt-[calc(116px+1.5rem)]">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {primary.map((item, index) => {
                  const hasChildren = "children" in item && item.children;
                  return (
                    <motion.li key={item.href} className="border-b border-white/10" {...itemMotion(index)}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        className="group flex min-h-16 items-center justify-between gap-4 py-4 font-display text-[2rem] font-bold leading-none tracking-[-0.03em] text-white transition-colors duration-200 hover:text-electric-300 sm:text-[2.4rem]"
                      >
                        {item.label}
                        <ArrowUpRight
                          aria-hidden
                          className="size-6 shrink-0 text-white/40 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-300"
                        />
                      </Link>

                      {hasChildren && (
                        <ul className="-mt-1 mb-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                          {services.map((service) => {
                            const Icon = serviceIcons[service.icon];
                            return (
                              <li key={service.slug}>
                                <Link
                                  href={`/services/${service.slug}`}
                                  onClick={onClose}
                                  className="flex min-h-11 items-center gap-3 rounded-xl py-2 text-[15px] font-medium text-white/72 transition-colors duration-200 hover:text-white"
                                >
                                  <Icon aria-hidden className="size-4 shrink-0 text-electric-300" strokeWidth={2} />
                                  {service.shortName}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div className="mt-auto flex flex-col gap-3 pt-10" {...itemMotion(primary.length)}>
              <Button href={telHref(siteConfig.phone)} variant="accent" size="lg" className="w-full">
                <Phone aria-hidden className="size-[18px]" />
                Call {siteConfig.phone}
              </Button>
              <Button href={nav.cta.href} variant="outline-light" size="lg" className="w-full">
                {nav.cta.label}
                <ArrowRight aria-hidden className="size-[18px]" />
              </Button>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                {siteConfig.hours}.{" "}
                {badgeCredentials.map((c, i) => (
                  <span key={c.key}>
                    {i > 0 && (
                      <span aria-hidden className="mx-1.5 text-white/30">
                        &middot;
                      </span>
                    )}
                    {c.label}
                  </span>
                ))}
              </p>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
