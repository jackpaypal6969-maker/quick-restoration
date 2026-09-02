import type { Metadata } from "next";
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
import { AreaPicker } from "./_components/AreaPicker";

const areaNames = serviceAreas.map((area) => area.name);
const areaSentence = `${areaNames.slice(0, -1).join(", ")} and ${areaNames[areaNames.length - 1]}`;

export const metadata: Metadata = buildMetadata({
  title: `Service Areas: ${areaSentence}`,
  description: `24/7 emergency restoration across ${areaSentence}. IICRC certified crews, NY State licensed mold contractor, target arrival ${siteConfig.responseTime.toLowerCase()}.`,
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title="Serving all of Long Island and Queens"
        description={`${areaSentence}, from Great Neck to Montauk, with a target arrival of ${siteConfig.responseTime.toLowerCase()} at any hour.`}
        breadcrumbs={[{ label: "Service Areas", href: "/service-areas" }]}
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

      <section
        aria-labelledby="coverage-heading"
        className="surface-dark section-y relative isolate overflow-hidden bg-midnight-950 text-white"
      >
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-10 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-600/25 blur-3xl"
        />

        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              align="center"
              eyebrow="Coverage"
              title={<span id="coverage-heading">Three counties, one dispatch</span>}
              description="Crews are staged in each county so the nearest one rolls, not the one that happens to be free. Select a county to see towns, arrival times and how we work there."
            />
          </Reveal>

          <AreaPicker />
        </Container>
      </section>

      <CompactCta
        tone="light"
        eyebrow="Not sure we reach you?"
        title="Don't see your town? If it's on Long Island or in Queens, we cover it."
        description="Call any hour and the dispatcher will confirm coverage and give you a real arrival window before a truck moves."
      />
    </>
  );
}
