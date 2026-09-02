import { ArrowRight, BadgeDollarSign, Camera, FileCheck, Handshake, Phone, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points: { icon: LucideIcon; text: string }[] = [
  { icon: BadgeDollarSign, text: "Direct billing to your carrier" },
  { icon: Camera, text: "Photo and moisture documentation on day one" },
  { icon: FileCheck, text: "Estimates in Xactimate, matching your adjuster" },
  { icon: Handshake, text: "One project manager for the whole claim" },
];

/**
 * Dark insurance block: how the claim is handled on the left, the carrier
 * roster in a glass panel on the right. Text pills only, no carrier logos.
 */
export function Insurance() {
  return (
    <section
      id="insurance"
      className="surface-dark section-y relative isolate overflow-hidden bg-midnight-900 text-white"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -left-40 top-1/4 -z-10 size-[560px] rounded-full bg-royal-600/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -right-32 -z-10 size-[520px] rounded-full bg-electric-400/10 blur-3xl"
      />

      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Insurance"
              title="We handle the claim so you can handle your family"
              description="We photograph, document and write the estimate in the same software your adjuster uses, then bill your carrier directly. For covered losses, most clients pay nothing beyond their deductible."
            />

            <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {points.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 py-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-electric-400/10 text-electric-300 ring-1 ring-electric-400/25">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <p className="text-[15px] font-medium leading-snug text-white/85 sm:text-base">{text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
                <Phone aria-hidden className="size-5" />
                Call {siteConfig.phone}
              </Button>
              <Button variant="outline-light" size="lg" href="/contact">
                Ask about your claim
                <ArrowRight aria-hidden className="size-5" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:pt-2">
            <div className="glass rounded-3xl p-7 shadow-card-dark sm:p-9">
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl">Carriers we bill directly</h3>
              <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {siteConfig.insurers.map((insurer) => (
                  <li
                    key={insurer}
                    className="flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-center text-sm font-medium text-white/85"
                  >
                    {insurer}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-sm leading-relaxed text-white/50">
                Not on the list? We work with every carrier and public adjuster.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
