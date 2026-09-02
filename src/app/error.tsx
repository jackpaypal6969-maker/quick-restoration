"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, RotateCcw } from "lucide-react";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route error boundary. Renders inside the root layout, so it opens with a
 * midnight surface for the fixed header and keeps the phone line one tap away.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    // Move focus to the heading so keyboard and screen-reader users land on the
    // explanation and the "Try again" control, not wherever focus was before.
    headingRef.current?.focus();
  }, [error]);

  return (
    <section className="relative isolate flex min-h-[85svh] flex-col overflow-hidden bg-midnight-radial text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -right-32 top-1/3 -z-10 size-[520px] rounded-full bg-royal-500/15 blur-3xl"
      />

      <Container className="flex flex-1 flex-col justify-center pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="flex max-w-3xl flex-col gap-5">
          <Eyebrow tone="dark">Something went wrong</Eyebrow>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl"
          >
            We hit a snag loading this page.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/72">
            Try again in a moment. If you have water, fire or mold damage right now, do not wait on the website: call
            and a dispatcher will pick up.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button variant="accent" size="lg" onClick={reset}>
              <RotateCcw aria-hidden className="size-5" />
              Try again
            </Button>
            <Button variant="outline-light" size="lg" href={telHref(siteConfig.phone)}>
              <Phone aria-hidden className="size-5" />
              Call {siteConfig.phone}
            </Button>
          </div>
          <p className="text-sm text-white/50">
            Or go back to the{" "}
            <Link href="/" className="font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
              home page
            </Link>
            .
          </p>
          {error.digest && (
            <p className="mt-4 font-mono text-xs text-white/55">
              Reference: <span className="select-all">{error.digest}</span>
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
