"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Renders the current year on the client. The statically prerendered footer
 * would otherwise freeze the year at build time; `fallback` (the build year) is
 * the server/hydration snapshot so markup matches, then the live year wins.
 */
export function CopyrightYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}
