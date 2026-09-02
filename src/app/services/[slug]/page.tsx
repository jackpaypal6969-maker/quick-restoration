import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { getService, services, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { OtherServices } from "@/components/services/OtherServices";
import { ServiceAside } from "@/components/services/ServiceAside";
import { ServiceCta } from "@/components/services/ServiceCta";
import { ServiceFaqs } from "@/components/services/ServiceFaqs";
import { ServiceHeroArt } from "@/components/services/ServiceMedallion";
import { ServiceJsonLd } from "@/components/services/ServiceJsonLd";
import { ServiceSteps } from "@/components/services/ServiceSteps";
import { countyList } from "@/components/services/helpers";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false, follow: false } };

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

const h2 = "font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl";

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const index = services.findIndex((s) => s.slug === service.slug);

  return (
    <>
      <ServiceJsonLd service={service} />

      <PageHero
        eyebrow="24/7 emergency service"
        title={service.name}
        description={service.tagline}
        image={service.image || undefined}
        imageAlt={service.imageAlt}
        art={service.image ? undefined : <ServiceHeroArt icon={service.icon} index={index} />}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.shortName, href: `/services/${service.slug}` },
        ]}
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

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="max-w-2xl">
              <Reveal className="space-y-6">
                {service.description.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-ink-700">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              <Reveal className="mt-14" y={20}>
                <h2 id="included" className={h2}>
                  What&apos;s included
                </h2>
                <ul aria-labelledby="included" className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-ink-700">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-royal-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14" y={20}>
                <h2 id="how-it-works" className={h2}>
                  How it works
                </h2>
                <ServiceSteps steps={service.steps} />
              </Reveal>

              <Reveal className="mt-14" y={20}>
                <h2 id="questions" className={h2}>
                  Common questions
                </h2>
                <ServiceFaqs faqs={service.faqs} className="mt-6" />
              </Reveal>
            </div>

            <Reveal delay={0.1} y={20} className="lg:sticky lg:top-28 lg:self-start">
              <ServiceAside />
            </Reveal>
          </div>
        </Container>
      </section>

      <OtherServices current={service} />

      <ServiceCta
        title="Crews are ready right now."
        description={`Call ${siteConfig.phone} any hour, describe what happened, and a certified crew is dispatched immediately with a target arrival of ${siteConfig.responseTime.toLowerCase()} anywhere in ${countyList}.`}
      />
    </>
  );
}
