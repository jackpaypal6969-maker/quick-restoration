import { ArrowRight, Phone } from "lucide-react";
import { siteConfig, serviceAreas } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LongIslandWatermark } from "@/components/visuals/LongIslandWatermark";

/**
 * Pre-footer conversion band: one glow, one question, two ways to reach us,
 * with a faint Long Island silhouette behind the right half.
 */
export function CTABand() {
  const areas = serviceAreas.map((area) => area.name).join(", ");

  return (
    <section aria-labelledby="cta-heading" className="surface-dark section-y relative isolate overflow-hidden bg-midnight-900 bg-grain text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 mask-fade-x" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_33_214/0.5),rgb(34_211_238/0.14)_55%,transparent_72%)] blur-2xl md:size-[960px]"
      />
      {/* County silhouette, sized to the map's 1000x494 viewBox so the whole
          island shows, centred on the right half and running just off the edge.
          The mask fades its western end into plain midnight under the copy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[4%] top-1/2 -z-10 aspect-[1000/494] w-[92%] -translate-y-1/2 [mask-image:linear-gradient(to_right,transparent,black_35%,black_90%,transparent)] md:w-[68%] lg:w-[58%]"
      >
        <LongIslandWatermark tone="dark" />
      </div>

      <Container>
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Eyebrow tone="dark">Need help right now?</Eyebrow>
          <h2 id="cta-heading" className="font-display text-4xl font-bold leading-[1.02] text-white md:text-5xl">
            Crews are standing by, 24/7.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/70">
            Call now or request help online. We answer live, dispatch immediately and bill your insurance directly.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
              <Phone aria-hidden className="size-5" />
              Call {siteConfig.phone}
            </Button>
            <Button variant="outline-light" size="lg" href="/contact">
              Request help online
              <ArrowRight aria-hidden className="size-5" />
            </Button>
          </div>
          <p className="text-sm text-white/50">Serving {areas}.</p>
        </Reveal>
      </Container>
    </section>
  );
}
