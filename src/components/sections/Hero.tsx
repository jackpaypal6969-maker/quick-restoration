import Image from "next/image";
import { ArrowRight, BadgeCheck, FileCheck, Phone, ShieldCheck, type LucideIcon } from "lucide-react";
import { siteConfig, serviceAreas } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroHeadline } from "@/components/sections/hero/HeroHeadline";
import { HeroFadeIn } from "@/components/sections/hero/HeroFadeIn";
import { ResponsePulse } from "@/components/sections/hero/ResponsePulse";
import { ScrollCue } from "@/components/sections/hero/ScrollCue";

type CredentialKey = (typeof siteConfig.credentials)[number]["key"];

/** Short chip labels keyed to config credentials; a chip only renders if its credential exists. */
const PROOF_CHIPS: { key: CredentialKey; short: string; icon: LucideIcon }[] = [
  { key: "iicrc", short: "IICRC Certified Firm", icon: ShieldCheck },
  { key: "nys-mold", short: "NYS Licensed Mold Contractor", icon: BadgeCheck },
  { key: "insurance-billing", short: "Direct insurance billing", icon: FileCheck },
];

/**
 * Home-page opening section: full-viewport midnight hero with the brand photo,
 * staggered headline, CTAs, proof chips and the "response pulse" card.
 */
export function Hero() {
  const counties = serviceAreas.map((area) => area.county);
  const chips = PROOF_CHIPS.flatMap((chip) => {
    const credential = siteConfig.credentials.find((c) => c.key === chip.key);
    return credential ? [{ ...chip, label: credential.label }] : [];
  });

  return (
    <section className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-midnight-radial text-white">
      {/* Photo + legibility gradients */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-midnight-900 via-midnight-900/70 to-midnight-950/40" />
        <div className="absolute inset-0 bg-linear-to-r from-midnight-950/70 via-midnight-950/25 to-transparent" />
      </div>

      {/* Faint grid and a violet bloom at the top right */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -right-40 top-16 -z-10 size-[560px] rounded-full bg-royal-600/25 blur-3xl"
      />

      <Container className="relative flex flex-1 flex-col pb-24 pt-40 md:pb-32 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        <div className="max-w-3xl lg:min-w-0 lg:flex-1">
          <HeroFadeIn delay={0.05}>
            <Eyebrow tone="dark">
              24/7 emergency response{" · "}
              {counties.join(" · ")}
            </Eyebrow>
          </HeroFadeIn>

          {/* 2.25rem fits "Water. Fire. Mold." on one line from 375px up; the non-breaking space keeps the
              fallback break on narrower phones at "Water. Fire." / "Mold." rather than "Water." alone. */}
          <HeroHeadline
            className="mt-6 text-[2.25rem]/[1] sm:text-6xl/[0.98] xl:text-7xl/[0.98]"
            lines={[{ text: "Water.\u00a0Fire. Mold." }, { text: "Restored fast, done right.", gradient: true }]}
          />

          <HeroFadeIn delay={0.55}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75">
              IICRC certified crews and a NY State licensed mold contractor, on-site across {siteConfig.serviceRegion} in{" "}
              {siteConfig.responseTime.toLowerCase()}.
            </p>
          </HeroFadeIn>

          <HeroFadeIn delay={0.68}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
                <Phone aria-hidden className="size-5" />
                Call {siteConfig.phone}
              </Button>
              <Button variant="outline-light" size="lg" href="/contact">
                Request help online
                <ArrowRight aria-hidden className="size-5" />
              </Button>
            </div>
          </HeroFadeIn>

          <HeroFadeIn delay={0.8}>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Credentials">
              {chips.map(({ key, short, label, icon: Icon }) => (
                <li
                  key={key}
                  className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-white/85"
                >
                  <Icon aria-hidden className="size-4 text-electric-300" />
                  <span aria-hidden>{short}</span>
                  <span className="sr-only">{label}</span>
                </li>
              ))}
            </ul>
          </HeroFadeIn>
        </div>

        {/* Signature moment, lg+ only */}
        <HeroFadeIn delay={0.9} y={24} className="hidden shrink-0 lg:ml-auto lg:block">
          <ResponsePulse />
        </HeroFadeIn>
      </Container>

      <ScrollCue />
    </section>
  );
}
