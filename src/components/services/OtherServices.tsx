import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { services, type Service } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/services/ServiceIcon";

interface OtherServicesProps {
  /** The service currently being viewed; rendered as a non-link "You're here" card. */
  current: Service;
}

/** Row layout below lg (icon, copy, action); stacked card at lg where four share a row. */
const cardClass =
  "flex w-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 lg:flex-col lg:items-stretch lg:gap-5 lg:p-5";

/** All eight services, four per row on desktop, with the current one marked instead of dropped. */
export function OtherServices({ current }: OtherServicesProps) {
  return (
    <section aria-labelledby="other-services-heading" className="section-y bg-ice-50">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="All services"
            title={<span id="other-services-heading">Everything we restore</span>}
            description="Losses rarely stay in one category. A fire is also a water loss; a flood becomes a mold problem. The same crew and project manager cover all of it."
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {services.map((service, i) => {
            const isCurrent = service.slug === current.slug;
            const body = (
              <>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-midnight-900 text-electric-300">
                  <ServiceIcon icon={service.icon} size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold leading-tight text-ink-950">
                    {service.shortName}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm leading-snug text-ink-500">{service.tagline}</span>
                </span>
              </>
            );

            return (
              <Reveal key={service.slug} as="li" delay={i * 0.04} y={20} className="flex">
                {isCurrent ? (
                  <div aria-current="page" className={cn(cardClass, "bg-royal-100/40 ring-royal-600/30")}>
                    {body}
                    <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 self-center rounded-full bg-royal-600 px-2.5 py-1 text-xs font-bold text-white lg:ml-0 lg:mt-auto lg:self-start">
                      <MapPin aria-hidden className="size-3.5" />
                      You&apos;re here
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/services/${service.slug}`}
                    className={cn(
                      cardClass,
                      "group shadow-card ring-ink-900/5 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover",
                    )}
                  >
                    {body}
                    <span className="ml-auto inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-royal-600 lg:ml-0 lg:mt-auto">
                      <span className="hidden lg:inline">Learn more</span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
