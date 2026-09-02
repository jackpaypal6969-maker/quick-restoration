"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { nav, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn, telHref } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { badgeCredentials } from "./brand-data";
import { useMediaQuery, useScrolledPast } from "./hooks";

const STRIP_HEIGHT = 36;
const MOBILE_MENU_ID = "mobile-menu";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed site header. Transparent with white text over the dark opening section,
 * a light glass bar once the page scrolls. The utility strip above the main bar
 * (md+) is scroll-linked so it rides away with the page; after it is gone the
 * fixed footprint is exactly the 80px main bar.
 */
export function Header() {
  const pathname = usePathname() ?? "/";
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const scrolled = useScrolledPast(isMd ? STRIP_HEIGHT : 24);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, (value) => (isMd ? -Math.min(Math.max(value, 0), STRIP_HEIGHT) : 0));

  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu when the route changes (back/forward included).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }
  // And when the viewport grows into the desktop layout.
  const [wasLg, setWasLg] = useState(isLg);
  if (isLg !== wasLg) {
    setWasLg(isLg);
    if (isLg) setMenuOpen(false);
  }

  const closeMenu = useCallback((returnFocus = true) => {
    setMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // While the menu is open: scroll lock, Escape, the rest of the page made inert,
  // and a focus trap over every visible focusable in the header plus the panel.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const outside = Array.from(document.querySelectorAll<HTMLElement>("main, footer, [data-mobile-call-bar]"));
    const previousInert = outside.map((el) => el.inert);
    outside.forEach((el) => {
      el.inert = true;
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const header = headerRef.current;
      const panel = menuRef.current;
      if (!header || !panel) return;
      const focusables = [
        ...Array.from(header.querySelectorAll<HTMLElement>(FOCUSABLE)),
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ].filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      outside.forEach((el, i) => {
        el.inert = previousInert[i];
      });
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const light = scrolled && !menuOpen;
  const tone: "light" | "dark" = light ? "light" : "dark";
  const phoneHref = telHref(siteConfig.phone);

  const navItemClass = cn(
    "relative inline-flex h-11 items-center gap-1 rounded-full px-3.5 text-[15px] font-semibold whitespace-nowrap",
    "transition-colors duration-200",
    "after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full",
    "after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100 focus-visible:after:scale-x-100",
    light
      ? "text-ink-700 hover:text-ink-950 after:bg-royal-600"
      : "text-white/80 hover:text-white after:bg-electric-400",
  );

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
        style={{ y: headerY }}
        data-tone={tone}
      >
        {/* Utility strip (md+). Rides away with the first 36px of scroll. */}
        <div className="surface-dark hidden h-9 border-b border-white/8 bg-midnight-950 text-white/70 md:block">
          <Container className="flex h-full items-center justify-between gap-6 text-[12.5px] font-medium tracking-wide">
            <ul className="flex items-center gap-4">
              <li className="flex items-center gap-2.5 text-white/85">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-electric-400 animate-pulse-ring" />
                  <span className="relative size-2 rounded-full bg-electric-400" />
                </span>
                24/7 Emergency Response
              </li>
              {badgeCredentials
                .filter((c) => c.key !== "insured")
                .map((c) => (
                  <li key={c.key} className="flex items-center gap-4">
                    <span aria-hidden className="h-3 w-px bg-white/15" />
                    {c.label}
                  </li>
                ))}
            </ul>
            {/* 44px target centred in the 36px strip (overflows 4px each side). */}
            <a
              href={phoneHref}
              className="-my-1 inline-flex min-h-11 items-center gap-2 font-semibold text-white transition-colors duration-200 hover:text-electric-300"
            >
              <Phone aria-hidden className="size-3.5 text-electric-300" />
              {siteConfig.phone}
            </a>
          </Container>
        </div>

        {/* Main bar: transparent over the dark opening, glass once scrolled, solid while the menu is open. */}
        <div
          className={cn(
            "h-[72px] border-b transition-[background-color,border-color,box-shadow,color] duration-300 ease-out-expo md:h-20",
            light
              ? "border-ink-950/8 bg-white/90 text-ink-900 shadow-[0_12px_40px_-24px_rgb(11_7_34/0.25)] backdrop-blur-xl"
              : menuOpen
                ? "surface-dark border-white/10 bg-midnight-950 text-white"
                : "surface-dark border-transparent bg-transparent text-white",
          )}
        >
          <Container className="flex h-full items-center justify-between gap-4">
            <Logo tone={tone} />

            <nav aria-label="Primary" className="relative hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {nav.primary.map((item) =>
                  "children" in item && item.children ? (
                    <ServicesMenu
                      key={item.href}
                      label={item.label}
                      href={item.href}
                      tone={tone}
                      active={isActivePath(pathname, item.href)}
                      triggerClassName={navItemClass}
                    />
                  ) : (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(navItemClass, isActivePath(pathname, item.href) && "after:scale-x-100")}
                        aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <a
                href={phoneHref}
                className={cn(
                  "hidden h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 md:inline-flex",
                  light ? "text-ink-900 hover:text-royal-600" : "text-white hover:text-electric-300",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors duration-300",
                    light ? "bg-royal-100 text-royal-600" : "bg-white/10 text-electric-300",
                  )}
                >
                  <Phone className="size-4" />
                </span>
                {siteConfig.phone}
              </a>

              <Button
                href={nav.cta.href}
                variant={light ? "primary" : "accent"}
                size="sm"
                className="hidden sm:inline-flex"
              >
                {nav.cta.label}
              </Button>

              <a
                href={phoneHref}
                aria-label={`Call ${siteConfig.phone}`}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200 md:hidden",
                  light ? "bg-royal-100 text-royal-600 hover:bg-royal-600 hover:text-white" : "bg-electric-400 text-midnight-950 hover:bg-electric-300",
                )}
              >
                <Phone aria-hidden className="size-[18px]" />
              </a>

              <button
                ref={toggleRef}
                type="button"
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200 lg:hidden",
                  light ? "text-ink-900 hover:bg-ink-900/5" : "text-white hover:bg-white/10",
                )}
                aria-label="Menu"
                aria-expanded={menuOpen}
                aria-controls={MOBILE_MENU_ID}
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              >
                <span className="relative block size-6">
                  <Menu
                    aria-hidden
                    className={cn(
                      "absolute inset-0 size-6 transition-[opacity,transform] duration-300 ease-out-expo",
                      menuOpen ? "scale-75 opacity-0" : "scale-100 opacity-100",
                    )}
                  />
                  <X
                    aria-hidden
                    className={cn(
                      "absolute inset-0 size-6 transition-[opacity,transform] duration-300 ease-out-expo",
                      menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-45 scale-75 opacity-0",
                    )}
                  />
                </span>
              </button>
            </div>
          </Container>
        </div>
      </motion.header>

      <MobileMenu id={MOBILE_MENU_ID} open={menuOpen} onClose={() => closeMenu(false)} panelRef={menuRef} />
    </>
  );
}
