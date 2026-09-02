import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AreaExplorer } from "@/components/map/AreaExplorer";
import { countyList } from "@/components/services/helpers";

/**
 * Home-page coverage section: the interactive Long Island map paired with the
 * three area cards. Hover a card, light up a county; hover a county, light up a card.
 */
export function ServiceAreaMap() {
  return (
    <section
      id="areas"
      aria-labelledby="areas-heading"
      className="surface-dark section-y relative isolate scroll-mt-20 overflow-hidden bg-midnight-950 text-white"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 -z-10 size-[560px] rounded-full bg-royal-600/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 -z-10 size-[420px] rounded-full bg-electric-400/10 blur-3xl"
      />

      <Container>
        <AreaExplorer
          heading={
            <Reveal>
              <SectionHeading
                tone="dark"
                eyebrow="Where we work"
                title={
                  <span id="areas-heading">
                    {countyList}, {siteConfig.responseTime.toLowerCase()} away
                  </span>
                }
                description="Crews are staged across the island, not dispatched from one yard. When you call, we send the closest one."
              />
            </Reveal>
          }
        />

        <Reveal
          y={16}
          className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-16"
        >
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            <span className="font-semibold text-white">Don&apos;t see your town?</span> If it&apos;s on Long Island or
            in Queens, we cover it.
          </p>
          <a
            href={telHref(siteConfig.phone)}
            className="inline-flex min-h-11 items-center gap-2.5 self-start font-semibold text-electric-300 transition-colors hover:text-electric-200 sm:self-auto"
          >
            <Phone aria-hidden className="size-4" />
            Call {siteConfig.phone}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
