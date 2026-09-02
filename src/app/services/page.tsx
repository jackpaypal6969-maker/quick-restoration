import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { services, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { cn, telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceIconTile } from "@/components/services/ServiceIconTile";
import { ServiceMedallion } from "@/components/services/ServiceMedallion";
import { ServiceCta } from "@/components/services/ServiceCta";
import { countyList, padIndex } from "@/components/services/helpers";
import { SealRow } from "@/components/visuals/Seal";

export const metadata: Metadata = buildMetadata({
  title: "Restoration Services on Long Island",
  description: `24/7 water, fire, mold, storm, sewage and puff back restoration plus reconstruction across ${countyList}. IICRC certified, NY State licensed mold contractor, direct insurance billing.`,
  path: "/services",
});

/** Decorative hero cluster for the overview: the first four service medallions, staggered inside a faint ring. */
function ServicesHeroArt() {
  return (
    <div className="relative grid size-64 grid-cols-2 place-items-center gap-4 motion-safe:animate-float xl:size-80">
      <div className="absolute inset-6 rounded-full bg-electric-400/12 blur-3xl" />
      <div className="absolute inset-0 rounded-full border border-white/10" />
      {services.slice(0, 4).map((service, i) => (
        <ServiceMedallion
          key={service.slug}
          icon={service.icon}
          size="md"
          className={cn("relative shadow-glow", i % 2 === 1 ? "translate-y-5" : "-translate-y-5")}
        />
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every kind of damage. One team, start to finish."
        description={`One IICRC certified crew for water, fire, mold, storm, sewage and puff back damage, plus the rebuild, across ${countyList}.`}
        breadcrumbs={[{ label: "Services", href: "/services" }]}
        art={<ServicesHeroArt />}
        hideSecondaryOnMobile
      >
        <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
          <Phone aria-hidden className="size-5" />
          Call {siteConfig.phone}
        </Button>
        <Button variant="outline-light" size="lg" href="/contact">
          Request help
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </PageHero>

      {/* Slim credential strip: the three seals on midnight, directly under the hero. */}
      <section className="surface-dark border-t border-white/10 bg-midnight-950 text-white">
        <Container>
          <Reveal
            y={16}
            className="flex flex-col items-center gap-6 py-10 md:flex-row md:justify-center md:gap-10 md:py-8"
          >
            <SealRow tone="dark" size={96} className="justify-center gap-4 sm:gap-6" />
            <p className="text-center text-sm font-medium leading-relaxed text-white/70 md:text-left">
              Certified, licensed and insured on every job.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we handle"
              title="Eight services, one point of contact"
              description="Most losses cross categories: a fire is also a water loss, a flood becomes a mold problem. We are set up for that, with one project manager from the first call to the final walkthrough."
            />
          </Reveal>

          <div className="mt-6 md:mt-10">
            {services.map((service, i) => {
              const flip = i % 2 === 1;
              const headingId = `${service.slug}-heading`;
              const topFeatures = service.features.slice(0, 3);
              return (
                <Reveal key={service.slug} y={24}>
                  <article
                    id={service.slug}
                    aria-labelledby={headingId}
                    className={cn(
                      "group grid items-center gap-8 border-t border-ink-900/8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-16 xl:gap-20",
                      i === 0 && "border-t-0",
                    )}
                  >
                    {/* Desktop: content-carrying tile. Below lg a 64px medallion beside the heading stands in for it. */}
                    <ServiceIconTile
                      icon={service.icon}
                      index={i}
                      size="lg"
                      title={service.shortName}
                      items={topFeatures}
                      className={cn(
                        "hidden aspect-[4/3] rounded-3xl shadow-card ring-1 ring-ink-900/5 lg:flex",
                        flip && "lg:order-2",
                      )}
                    />
                    <div className={cn("flex flex-col gap-5", flip && "lg:order-1")}>
                      <div className="flex items-center gap-4">
                        <ServiceMedallion icon={service.icon} tone="light" className="lg:hidden" />
                        <div className="flex flex-col gap-3">
                          <Eyebrow>Service {padIndex(i)}</Eyebrow>
                          <h2
                            id={headingId}
                            className="font-display text-2xl font-bold leading-[1.1] text-ink-950 sm:text-3xl lg:text-4xl"
                          >
                            {service.name}
                          </h2>
                        </div>
                      </div>
                      <p className="text-lg font-medium leading-relaxed text-ink-900">{service.tagline}</p>
                      <p className="leading-relaxed text-ink-700">{service.summary}</p>
                      <ul className="flex flex-col gap-2.5 lg:hidden">
                        {topFeatures.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-ink-700">
                            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-royal-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-1">
                        <Button
                          variant="outline"
                          href={`/services/${service.slug}`}
                          ariaLabel={`Learn more about ${service.shortName}`}
                          className="group/btn"
                        >
                          Learn more
                          <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-1"
                          />
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <ServiceCta />
    </>
  );
}
