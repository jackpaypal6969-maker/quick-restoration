import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { serviceAreas, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { CompactCta } from "@/components/about/CompactCta";
import { CredentialsList } from "@/components/about/CredentialsList";
import { Pillars } from "@/components/about/Pillars";
import { EquipmentStrip } from "@/components/visuals/EquipmentStrip";
import { SealRow } from "@/components/visuals/Seal";

const counties = serviceAreas.map((area) => area.shortName);
const countySentence = `${counties.slice(0, -1).join(", ")} and ${counties[counties.length - 1]}`;

/** Team photo (1600x1067): dim under the hero gradient, full in the "How we work" figure. */
const TEAM_PHOTO = {
  src: "/images/team.jpg",
  alt: `The ${siteConfig.name} crew with their service vans at dawn`,
} as const;

export const metadata: Metadata = buildMetadata({
  title: "About Our Long Island Restoration Team",
  description: `${siteConfig.name} is a Long Island restoration company: IICRC certified crews, a New York State mold remediation license and 24/7 dispatch built around ${countySentence}.`,
  path: "/about",
});

const HOW_WE_WORK = [
  "Most calls come in at the worst possible time: a pipe lets go at 2 a.m., a sump pump quits in the middle of a nor'easter, a furnace puffs back the week before Thanksgiving. The person who answers is a dispatcher, not a call center. They take the address, ask what is wet or burned, and have a crew moving before you hang up.",
  "On site, the first hour is measurement, not guesswork. Moisture readings, thermal imaging, photographs of every affected room and a written scope you can actually read. That same documentation goes to your adjuster, in the estimating software they already use, so the claim moves as fast as the drying does.",
  "We stay until the job is finished, not until the equipment is picked up. The project manager who met you at the door runs the drying, the demolition and the rebuild, then walks the finished work with you before the final invoice goes out. If something is not right, you call one person, and that person fixes it.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for the worst day of your year"
        description={`${siteConfig.name} is a Long Island restoration company: IICRC certified crews, a New York State mold remediation license, and dispatch built around ${countySentence}.`}
        image={TEAM_PHOTO.src}
        imageAlt={TEAM_PHOTO.alt}
        breadcrumbs={[{ label: "About", href: "/about" }]}
        hideSecondaryOnMobile
      >
        <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
          <Phone aria-hidden className="size-5" />
          Call {siteConfig.phone}
        </Button>
        <Button variant="outline-light" size="lg" href="/service-areas">
          Where we work
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </PageHero>

      <section aria-labelledby="standard-heading" className="section-y bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our standard"
              title={<span id="standard-heading">Three things every job gets, no exceptions</span>}
              description="Anyone with a truck and a dehumidifier can call themselves a restoration pro. These are the lines we hold so you do not have to take our word for it."
            />
          </Reveal>
          <div className="mt-10 md:mt-14">
            <Pillars />
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="credentials-heading"
        className="section-y relative isolate overflow-hidden bg-midnight-950 text-white"
      >
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
        <div
          aria-hidden
          className="absolute -right-32 top-0 -z-10 size-[520px] rounded-full bg-royal-600/25 blur-3xl"
        />
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Credentials"
              title={<span id="credentials-heading">Credentials you can verify</span>}
              description="Certifications and licenses are only worth something if you can check them. Here is what we hold, and what each one actually covers."
            />
          </Reveal>
          <Reveal className="mt-10 md:mt-12" y={16}>
            <SealRow tone="dark" size={120} />
          </Reveal>
          <div className="mt-10 md:mt-14">
            <CredentialsList />
          </div>
          <Reveal y={12} className="mt-8 max-w-2xl text-sm leading-relaxed text-white/55">
            Our mold remediation license number appears on every proposal we write, and you are welcome to verify it
            with the New York State Department of Labor before work begins.
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="how-heading" className="section-y overflow-hidden bg-ice-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <SectionHeading
                  eyebrow="How we work"
                  title={<span id="how-heading">One call, one crew, one person who answers for it</span>}
                />
              </Reveal>
              <Reveal className="mt-8 space-y-5" delay={0.08}>
                {HOW_WE_WORK.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-ink-700">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </div>

            <Reveal className="lg:col-span-6" delay={0.12} y={24}>
              <figure className="relative isolate">
                <div
                  aria-hidden
                  className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-royal-600/25 via-transparent to-electric-400/25 sm:-inset-4"
                />
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-midnight-900 shadow-card-hover ring-1 ring-ink-900/10">
                  <Image
                    src={TEAM_PHOTO.src}
                    alt={TEAM_PHOTO.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight-950/70 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-white/85 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="font-semibold">{siteConfig.tagline}</span>
                  <span className="text-white/60">Same crew, first call to final coat</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="equipment-heading" className="section-y bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Equipment"
              title={<span id="equipment-heading">What arrives with the crew</span>}
              description="Extraction, drying, filtration and measurement gear rides on every truck, not on order, so work starts on the first visit."
            />
          </Reveal>
          <Reveal className="mt-10 md:mt-14" y={20}>
            <EquipmentStrip tone="light" />
          </Reveal>
        </Container>
      </section>

      <CompactCta
        id="about-cta"
        title="Talk to a dispatcher, not a call center."
        description={`Call ${siteConfig.phone} any hour and describe what happened. You will get a real arrival window and the closest certified crew in ${countySentence}.`}
      />
    </>
  );
}
