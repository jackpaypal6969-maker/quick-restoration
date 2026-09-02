import Image from "next/image";
import { BadgeCheck, FileCheck, Gauge, ShieldCheck, Timer, type LucideIcon } from "lucide-react";
import { getService, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { countyList } from "@/components/services/helpers";

type CredentialKey = (typeof siteConfig.credentials)[number]["key"];

interface Point {
  icon: LucideIcon;
  title: string;
  body: string;
}

function credential(key: CredentialKey) {
  return siteConfig.credentials.find((c) => c.key === key);
}

const FALLBACK_IMAGE = { src: "/images/services/water-damage.jpg", alt: "Technician setting up drying equipment in a flooded Long Island basement" };

/**
 * Dark differentiators section: four proof points on the left, a framed
 * photo with an overlapping glass stat card on the right.
 */
export function WhyUs() {
  const iicrc = credential("iicrc");
  const mold = credential("nys-mold");
  const billing = credential("insurance-billing");
  const water = getService("water-damage-restoration");
  const image = water?.image ? { src: water.image, alt: water.imageAlt } : FALLBACK_IMAGE;

  const points = [
    iicrc ? { icon: ShieldCheck, title: iicrc.label, body: iicrc.detail } : null,
    mold ? { icon: BadgeCheck, title: mold.label, body: mold.detail } : null,
    {
      icon: Timer,
      title: `On-site in ${siteConfig.responseTime.toLowerCase()}`,
      body: `Crews and equipment are staged across ${countyList}, so the closest team is moving while you are still on the phone.`,
    },
    billing ? { icon: FileCheck, title: "Direct insurance billing", body: billing.detail } : null,
  ].filter((point): point is Point => point !== null);

  return (
    <section className="surface-dark section-y relative isolate overflow-hidden bg-midnight-950 text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-20 mask-fade-x" />
      <div aria-hidden className="absolute -left-40 top-0 -z-10 size-[520px] rounded-full bg-royal-600/20 blur-3xl" />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow={`Why ${siteConfig.name}`}
              title="Certified, licensed and built for Long Island emergencies"
              description="Restoration is regulated work. These are the credentials that matter in New York, and they are on every proposal we write."
            />
            <ul className="mt-10 space-y-8">
              {points.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-5">
                  <span className="glass flex size-12 shrink-0 items-center justify-center rounded-2xl text-electric-300">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-[15px]">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="relative pb-8 lg:pb-0">
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-electric-400/10 blur-3xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-dark ring-1 ring-white/10 sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight-950/70 via-midnight-950/10 to-transparent" />
            </div>
            <div className="glass absolute -bottom-2 left-4 max-w-[17rem] rounded-2xl p-5 shadow-card-dark sm:-left-6 lg:-bottom-8 lg:-left-10">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-electric-400/15 text-electric-300">
                  <Gauge aria-hidden className="size-5" />
                </span>
                <p className="font-display text-lg font-bold leading-tight text-white">Dry-out started same day</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">Every job logged with moisture readings.</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
