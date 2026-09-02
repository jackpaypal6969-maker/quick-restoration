import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { nav, serviceAreas, services, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { telHref } from "@/lib/utils";
import { CopyrightYear } from "./CopyrightYear";
import { Logo } from "./Logo";
import { badgeCredentials, getMoldLicenseLine } from "./brand-data";

const columnHeading = "eyebrow text-electric-300";
const columnLink =
  "inline-flex min-h-11 items-center text-[15px] text-white/70 transition-colors duration-200 hover:text-white";

type SocialKey = keyof typeof siteConfig.social;

const socialMeta: Record<SocialKey, { label: string }> = {
  facebook: { label: "Facebook" },
  instagram: { label: "Instagram" },
  google: { label: "Google Business Profile" },
  yelp: { label: "Yelp" },
};

/* lucide-react v1 no longer ships brand glyphs, so the two we need live here. */
function SocialGlyph({ name, className }: { name: SocialKey; className?: string }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <path d="M13.5 21v-7.2h2.4l.4-2.9h-2.8V9.1c0-.8.2-1.4 1.4-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.9h2.5V21h3Z" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  return <ExternalLink className={className} aria-hidden />;
}

/** Site footer. Server component: pulls every fact from siteConfig at render. */
export function Footer() {
  const buildYear = new Date().getFullYear();
  const phoneHref = telHref(siteConfig.phone);
  const licenseLine = getMoldLicenseLine();
  const socials = (Object.keys(siteConfig.social) as SocialKey[])
    .map((key) => ({ key, href: siteConfig.social[key] as string, label: socialMeta[key].label }))
    .filter((s) => s.href.trim().length > 0);
  const areaNames = serviceAreas.map((a) => a.shortName);
  const areaSentence =
    areaNames.length > 1 ? `${areaNames.slice(0, -1).join(", ")} and ${areaNames[areaNames.length - 1]}` : areaNames[0];

  return (
    <footer className="surface-dark relative overflow-hidden bg-midnight-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-electric-400/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 size-[520px] rounded-full bg-royal-600/20 blur-3xl"
      />

      {/* Emergency band */}
      <Container className="relative border-b border-white/10 py-14 md:py-18">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div>
              <Eyebrow tone="dark">24/7 emergency line</Eyebrow>
            </div>
            <a
              href={phoneHref}
              className="mt-3 inline-block py-1 font-display text-4xl font-bold leading-none tracking-[-0.03em] text-gradient-electric transition-opacity duration-200 hover:opacity-85 sm:text-5xl lg:text-6xl"
            >
              {siteConfig.phone}
            </a>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              A live dispatcher answers every call. Target on-site time is {siteConfig.responseTime.toLowerCase()}{" "}
              across {areaSentence}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Button href={phoneHref} variant="accent" size="lg">
              <Phone aria-hidden className="size-[18px]" />
              Call now
            </Button>
            <Button href={nav.cta.href} variant="outline-light" size="lg">
              {nav.cta.label}
              <ArrowRight aria-hidden className="size-[18px]" />
            </Button>
          </div>
        </div>
      </Container>

      {/* Link grid */}
      <Container className="relative py-16 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Logo tone="dark" size="md" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">{siteConfig.tagline}.</p>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Credentials">
              {badgeCredentials.map((c) => (
                <li
                  key={c.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/10"
                >
                  <ShieldCheck aria-hidden className="size-3.5 text-electric-300" />
                  {c.label}
                </li>
              ))}
            </ul>

            <address className="mt-8 not-italic">
              <ul className="flex flex-col gap-1 text-[15px] text-white/70">
                <li>
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-white transition-colors duration-200 hover:text-electric-300"
                  >
                    <Phone aria-hidden className="size-4 shrink-0 text-electric-300" />
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex min-h-11 items-center gap-3 transition-colors duration-200 hover:text-white [overflow-wrap:anywhere]"
                  >
                    <Mail aria-hidden className="size-4 shrink-0 text-electric-300" />
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex min-h-11 items-center gap-3">
                  <Clock aria-hidden className="size-4 shrink-0 text-electric-300" />
                  {siteConfig.hours}
                </li>
                <li className="flex min-h-11 items-center gap-3">
                  <MapPin aria-hidden className="size-4 shrink-0 text-electric-300" />
                  {siteConfig.address
                    ? `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`
                    : `Serving ${siteConfig.serviceRegion}`}
                </li>
              </ul>
            </address>
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className={columnHeading}>Services</h2>
            <ul className="mt-4 flex flex-col">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={columnLink}>
                    {service.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Service areas" className="lg:col-span-2">
            <h2 className={columnHeading}>Service areas</h2>
            <ul className="mt-4 flex flex-col">
              {serviceAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={`/service-areas/${area.slug}`} className={columnLink}>
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[14rem] text-xs leading-relaxed text-white/60">
              On-site target: {siteConfig.responseTime.toLowerCase()} anywhere in {siteConfig.serviceRegion}.
            </p>
          </nav>

          <nav aria-label="Company" className="lg:col-span-3">
            <h2 className={columnHeading}>Company</h2>
            <ul className="mt-4 flex flex-col">
              {nav.footer.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={columnLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs leading-relaxed text-white/50 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5">
            <p>
              &copy; <CopyrightYear fallback={buildYear} /> {siteConfig.legalName}. All rights reserved.
            </p>
            {licenseLine && <p>{licenseLine}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <ul className="flex flex-wrap items-center gap-x-5">
              {nav.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <ul className="flex items-center gap-1" aria-label="Social profiles">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${s.label}`}
                      className="inline-flex size-11 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                    >
                      <SocialGlyph name={s.key} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}
