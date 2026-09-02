import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/sections/hero/StatCounter";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";

const marqueeItems: string[] = [...siteConfig.credentials.map((c) => c.label), ...siteConfig.insurers];

/**
 * Light proof strip under the hero: four stats (count-up where numeric) and a
 * marquee of credentials and insurers we bill directly.
 */
export function TrustBar() {
  return (
    <section aria-labelledby="trust-heading" className="border-y border-ink-900/5 bg-white py-10 md:py-14">
      <h2 id="trust-heading" className="sr-only">
        Why Long Island calls {siteConfig.name}
      </h2>

      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
          {siteConfig.stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              as="li"
              delay={i * 0.08}
              y={16}
              className="flex flex-col gap-2 border-l border-ink-900/10 pl-5 md:pl-6"
            >
              <p className="font-display text-4xl font-bold leading-none tracking-tight text-ink-950 md:text-5xl">
                <StatCounter value={stat.value} suffix={"suffix" in stat ? stat.suffix : undefined} />
              </p>
              <p className="text-sm leading-snug text-ink-500">{stat.label}</p>
            </Reveal>
          ))}
        </ul>
      </Container>

      {/* Credential / insurer marquee with a pause control; static list under reduced motion. */}
      <MarqueeStrip
        items={marqueeItems}
        srIntro="Credentials and insurance carriers we bill directly:"
        className="mt-10 border-t border-ink-900/5 pt-8 md:mt-14 md:pt-10"
      />
    </section>
  );
}
