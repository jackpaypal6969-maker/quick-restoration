"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import { services, siteConfig } from "@/config/site";
import { cn, telHref } from "@/lib/utils";
import { usePrefersReducedMotion } from "./hooks";
import { serviceIcons } from "./service-icons";

interface ServicesMenuProps {
  label: string;
  href: string;
  /** "dark" = transparent header over midnight; "light" = scrolled glass bar. */
  tone: "light" | "dark";
  active: boolean;
  triggerClassName: string;
}

const CLOSE_DELAY = 160;

/**
 * Desktop "Services" disclosure: opens on mouse hover (with a close delay),
 * click/tap and keyboard; closes on Escape, outside click and focus leaving
 * the menu. Hover handlers are pointer-type aware so a touch tap does not
 * open-then-toggle-closed.
 */
export function ServicesMenu({ label, href, tone, active, triggerClassName }: ServicesMenuProps) {
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  /** True while the panel is open because of hover (a first mouse click then keeps it open). */
  const hoverOpened = useRef(false);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Outside click + Escape while open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const getItems = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-menu-item]") ?? []);

  const focusItem = (index: number) => {
    const items = getItems();
    if (items.length === 0) return;
    const next = ((index % items.length) + items.length) % items.length;
    items[next]?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => focusItem(0));
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems();
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(items.length - 1);
        break;
      default:
        break;
    }
  };

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.current && !rootRef.current.contains(next)) setOpen(false);
  };

  const onPointerEnter = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    hoverOpened.current = true;
    setOpen(true);
  };

  const onPointerLeave = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return;
    hoverOpened.current = false;
    scheduleClose();
  };

  const onTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Click events are PointerEvents in modern browsers; keyboard activation reports "".
    const pointerType = (event.nativeEvent as globalThis.PointerEvent).pointerType;
    if (pointerType === "mouse" && hoverOpened.current) {
      // Hover already opened it: keep it open (a second click will close it).
      hoverOpened.current = false;
      cancelClose();
      setOpen(true);
      return;
    }
    hoverOpened.current = false;
    setOpen((v) => !v);
  };

  const dark = tone === "dark";

  return (
    <li
      ref={rootRef}
      className="contents"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        className={cn(triggerClassName, (open || active) && "after:scale-x-100")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-300 ease-out-expo", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="services-panel"
            id={panelId}
            ref={panelRef}
            className="absolute left-1/2 top-full z-10 w-[min(740px,calc(100vw-2.5rem))] origin-top pt-3"
            style={{ x: "-50%" }}
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onPanelKeyDown}
            onPointerEnter={cancelClose}
          >
            <div
              className={cn(
                "surface-light overflow-hidden rounded-3xl bg-white p-2.5 text-ink-950 shadow-card-hover ring-1 ring-ink-950/8",
                dark && "shadow-[0_32px_80px_-24px_rgb(0_0_0/0.6)]",
              )}
            >
              <ul className="grid grid-cols-2 gap-1">
                {services.map((service) => {
                  const Icon = serviceIcons[service.icon];
                  return (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        data-menu-item
                        onClick={() => setOpen(false)}
                        className="group flex min-h-11 items-start gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-ice-50 focus-visible:bg-ice-50"
                      >
                        <span
                          aria-hidden
                          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-royal-100 text-royal-600 transition-colors duration-200 group-hover:bg-royal-600 group-hover:text-white"
                        >
                          <Icon className="size-[18px]" strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold leading-tight text-ink-950">
                            {service.shortName}
                          </span>
                          <span className="mt-1 line-clamp-1 block text-[13px] leading-snug text-ink-500">
                            {service.tagline}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-4 border-t border-ink-950/8 px-3 pt-2.5 pb-1">
                <Link
                  href={href}
                  data-menu-item
                  onClick={() => setOpen(false)}
                  className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-royal-600 transition-colors duration-200 hover:text-royal-700"
                >
                  View all services
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href={telHref(siteConfig.phone)}
                  data-menu-item
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-700 transition-colors duration-200 hover:text-ink-950"
                >
                  <Phone aria-hidden className="size-4 text-royal-600" />
                  <span>
                    <span className="text-ink-500">24/7 line </span>
                    {siteConfig.phone}
                  </span>
                </a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}
