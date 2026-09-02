import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query flag (false on the server and during hydration). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/** True once the window has scrolled past `threshold` px. Re-renders only when the flag flips. */
export function useScrolledPast(threshold: number) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe replacement for motion's useReducedMotion, which is null on the server but
 * seeded from matchMedia on the first client render (a hydration mismatch that leaves
 * server-rendered `opacity:0` styles behind). This returns false on the server AND on the
 * hydrating render, then the live value, so motion elements are swapped for plain ones
 * only after hydration.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery(REDUCE_MOTION_QUERY);
}

/**
 * True once the window has scrolled past `fraction` of the viewport height
 * (0.7 = 70vh). Re-evaluated on scroll and resize; false on the server.
 */
export function useScrolledPastViewport(fraction: number) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > window.innerHeight * fraction,
    () => false,
  );
}
