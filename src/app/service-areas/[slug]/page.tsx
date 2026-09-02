import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { getServiceArea, serviceAreas, services, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { AreaAside } from "@/components/map/AreaAside";
import { AreaCard } from "@/components/map/AreaCard";
import { LongIslandMap } from "@/components/map/LongIslandMap";
import { MapFrame } from "@/components/map/MapFrame";
import { areaHref, countyEyebrow, countyKeyFor } from "@/components/map/county-keys";
import { CompactCta } from "@/components/about/CompactCta";

interface AreaPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return { title: "Service area not found" };

  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: areaHref(area),
  });
}

const h2 = "font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl";

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();

  const countyKey = countyKeyFor(area);
  const others = serviceAreas.filter((other) => other.slug !== area.slug);

  return (
    <>
      <PageHero
        eyebrow={countyEyebrow(area)}
        title={`Emergency restoration in ${area.name}`}
        titleSize="compact"
        description={area.headline}
        breadcrumbs={[
          { label: "Service Areas", href: "/service-areas" },
          { label: area.name, href: areaHref(area) },
        ]}
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

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="max-w-3xl">
              <Reveal className="space-y-6">
                {area.description.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-ink-700">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              <Reveal className="mt-14" y={20}>
                <h2 id="towns" className={h2}>
                  Towns and neighborhoods we serve
                </h2>
                <p className="mt-3 max-w-2xl text-ink-500">
                  {area.towns.length} places listed here, and every one in between. If yours is missing, call; the
                  answer is almost always yes.
                </p>
                <ul aria-labelledby="towns" className="mt-6 flex flex-wrap gap-2">
                  {area.towns.map((town) => (
                    <li
                      key={town}
                      className="rounded-full bg-ice-100 px-3.5 py-1.5 text-sm font-medium leading-snug text-ink-700"
                    >
                      {town}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14" y={20}>
                <h2 id="area-services" className={h2}>
                  Services available in {area.name}
                </h2>
                <ul aria-labelledby="area-services" className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex h-full items-start gap-3.5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-900/5 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-midnight-900 text-electric-300">
                          <ServiceIcon icon={service.icon} size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-base font-bold leading-tight text-ink-950">
                            {service.name}
                          </span>
                          <span className="mt-1 block text-sm leading-snug text-ink-500">{service.tagline}</span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="mt-1 size-4 shrink-0 text-royal-600 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Phone, hours and credentials come first on small screens instead of ~3,000px down. */}
            <Reveal delay={0.1} y={20} className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
              <AreaAside area={area} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="area-map-heading"
        className="surface-dark section-y relative isolate overflow-hidden bg-midnight-950 text-white"
      >
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
        <div
          aria-hidden
          className="absolute -left-32 top-1/2 -z-10 size-[520px] -translate-y-1/2 rounded-full bg-royal-600/25 blur-3xl"
        />
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <Reveal className="lg:col-span-4">
              <SectionHeading
                tone="dark"
                eyebrow="Coverage"
                title={<span id="area-map-heading">Where {area.shortName} sits in our coverage</span>}
                description={`Crews are staged in all three counties, so the closest one is dispatched to ${area.name}. Select a county to explore the rest of the island.`}
              />
            </Reveal>
            <Reveal className="lg:col-span-8" delay={0.1} y={20}>
              <MapFrame>
                <LongIslandMap interactive active={countyKey} />
              </MapFrame>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="other-areas-heading" className="section-y bg-ice-50">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Also serving"
              title={<span id="other-areas-heading">The rest of our coverage</span>}
              description="Same crews, same standards, same 24/7 dispatch in every county we serve."
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 md:mt-14">
            {others.map((other, i) => (
              <Reveal key={other.slug} as="li" delay={i * 0.08} y={20} className="flex">
                <AreaCard area={other} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CompactCta
        title={`Emergency in ${area.name}? Crews are ready right now.`}
        description={`Call ${siteConfig.phone} any hour, tell the dispatcher what happened and where, and the closest certified crew is on its way. ${area.responseNote}`}
      />
    </>
  );
}
