import { Phone } from "lucide-react";
import { services, siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { countyList } from "@/components/services/helpers";

/** Home-page services grid: eight uniform icon-led cards on an ice surface (compact rows on phones). */
export function ServicesGrid() {
  return (
    <section id="services" className="section-y bg-ice-50">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we restore"
            title="Full-service restoration when it matters most"
            description={`Water, fire, mold, storm, sewage and puff back damage, plus the rebuild that follows. One IICRC certified team handles the emergency, the drying, the paperwork and the reconstruction across ${countyList}.`}
          />
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:mt-16 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.slug} as="li" delay={i * 0.06} y={24} className="flex">
              <ServiceCard service={service} index={i} className="w-full" />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-4 text-center md:mt-12">
          <p className="max-w-xl text-sm leading-relaxed text-ink-500">
            Not sure which service you need? Describe what happened and the dispatcher will know.
          </p>
          <Button variant="outline" size="sm" href={telHref(siteConfig.phone)}>
            <Phone aria-hidden className="size-4" />
            Call {siteConfig.phone}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
