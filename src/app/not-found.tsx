import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { services, siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Next adds the noindex robots tag to not-found pages itself, so none is declared here.
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist. Find a service, go home, or call the 24/7 line.",
};

/**
 * 404. Opens with a midnight surface so the fixed header renders in its
 * transparent, white-text state, then offers the three ways forward.
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[85svh] flex-col overflow-hidden bg-midnight-radial text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -right-32 top-1/3 -z-10 size-[520px] rounded-full bg-electric-400/10 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[2%] top-1/2 -z-10 hidden -translate-y-1/2 select-none font-display text-[22rem] font-bold leading-none tracking-tighter text-white/[0.04] lg:block"
      >
        404
      </span>

      <Container className="flex flex-1 flex-col justify-center pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="flex max-w-3xl flex-col gap-5">
          <Eyebrow tone="dark">Error 404</Eyebrow>
          <h1 className="font-display text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">This page dried up.</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/72">
            The link may be old or mistyped. Everything we do is one click away, and the phone is answered around the
            clock.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button variant="accent" size="lg" href="/">
              Back to home
              <ArrowRight aria-hidden className="size-5" />
            </Button>
            <Button variant="outline-light" size="lg" href="/services">
              Browse services
            </Button>
            <Button variant="outline-light" size="lg" href={telHref(siteConfig.phone)}>
              <Phone aria-hidden className="size-5" />
              Call {siteConfig.phone}
            </Button>
          </div>
        </div>

        <nav aria-label="Find a service" className="mt-16 border-t border-white/10 pt-8">
          <p className="text-sm text-white/50">Looking for a service?</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-white/80 ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
