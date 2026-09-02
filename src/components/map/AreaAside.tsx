import { BadgeCheck, Clock, Phone, Timer } from "lucide-react";
import { siteConfig, type ServiceArea } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface AreaAsideProps {
  area: ServiceArea;
}

/** Sticky midnight card for area pages: response note, phone, hours, credentials. */
export function AreaAside({ area }: AreaAsideProps) {
  return (
    <aside
      aria-labelledby="area-aside-heading"
      className="relative isolate overflow-hidden rounded-3xl bg-midnight-radial p-6 text-white shadow-card-dark ring-1 ring-white/10 sm:p-8"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30" />
      <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-electric-400/15 blur-3xl" />

      <Eyebrow tone="dark">{area.shortName} dispatch</Eyebrow>
      <h2 id="area-aside-heading" className="mt-3 font-display text-2xl font-bold leading-tight">
        Crews staged in {area.shortName}, 24/7.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{area.responseNote}</p>

      <Button variant="accent" size="lg" href={telHref(siteConfig.phone)} className="mt-6 w-full">
        <Phone aria-hidden className="size-5" />
        Call {siteConfig.phone}
      </Button>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Timer aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" />
          <div>
            <dt className="text-white/50">Target arrival</dt>
            <dd className="font-semibold text-white">{siteConfig.responseTime}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" />
          <div>
            <dt className="text-white/50">Hours</dt>
            <dd className="font-semibold text-white">{siteConfig.hours}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="eyebrow text-white/50">Credentials</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {siteConfig.credentials.map((credential) => (
            <li
              key={credential.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/10"
            >
              <BadgeCheck aria-hidden className="size-3.5 text-electric-300" />
              {credential.label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
