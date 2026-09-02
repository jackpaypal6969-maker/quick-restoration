import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock, MapPin, Phone, Timer } from "lucide-react";
import { serviceAreas, siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { credentialShortLabels } from "@/components/layout/brand-data";

/** One-line hours for the side card; the full sentence is siteConfig.hours. */
const HOURS_SHORT = "24/7, 365 days a year";

/**
 * Midnight side card for service detail pages: phone, response time,
 * credentials and the three areas we serve. Sized to stay inside a 900px
 * viewport while sticky; the max-height/overflow pair is a safety net for
 * shorter screens (kept on the card itself so its drop shadow is not clipped).
 */
export function ServiceAside() {
  return (
    <aside
      aria-labelledby="service-aside-heading"
      className="surface-dark relative isolate overflow-hidden rounded-3xl bg-midnight-radial p-6 text-white shadow-card-dark ring-1 ring-white/10 sm:p-7 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:[scrollbar-width:thin]"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30" />
      <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-electric-400/15 blur-3xl" />

      <Eyebrow tone="dark">24/7 dispatch</Eyebrow>
      <h2 id="service-aside-heading" className="mt-3 font-display text-2xl font-bold leading-tight">
        Emergency? Call now.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        A live dispatcher answers and gets a crew moving while you are still on the phone.
      </p>

      <Button variant="accent" size="lg" href={telHref(siteConfig.phone)} className="mt-5 w-full">
        <Phone aria-hidden className="size-5" />
        Call {siteConfig.phone}
      </Button>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5">
          <Timer aria-hidden className="size-4 shrink-0 text-electric-300" />
          <dt className="text-white/50">Target arrival</dt>
          <dd className="ml-auto font-semibold text-white">{siteConfig.responseTime}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock aria-hidden className="size-4 shrink-0 text-electric-300" />
          <dt className="text-white/50">Hours</dt>
          <dd className="ml-auto font-semibold text-white">{HOURS_SHORT}</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-white/10 pt-5">
        <h3 className="eyebrow text-white/50">Credentials</h3>
        <ul className="mt-3 space-y-1.5 text-sm font-semibold text-white/85">
          {siteConfig.credentials.map((credential) => (
            <li key={credential.key} className="flex items-center gap-2.5">
              <BadgeCheck aria-hidden className="size-4 shrink-0 text-electric-300" />
              {credentialShortLabels[credential.key] ?? credential.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <h3 className="eyebrow text-white/50">Serving</h3>
        <ul className="-mx-3 mt-2">
          {serviceAreas.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/service-areas/${area.slug}`}
                className="group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/5 hover:text-white"
              >
                <MapPin aria-hidden className="size-4 shrink-0 text-electric-300" />
                <span className="flex-1">{area.name}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 text-white/40 transition-[transform,color] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-300"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
