import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { countyList } from "@/components/services/helpers";

interface ServiceCtaProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

/** Compact midnight conversion band for service pages: one line, two ways to reach us. */
export function ServiceCta({
  eyebrow = "24/7 dispatch",
  title = "Not sure what you're dealing with? Call and describe it.",
  description,
}: ServiceCtaProps) {
  const body =
    description ??
    `A live dispatcher answers around the clock, gives you a real arrival window and sends the closest certified crew anywhere in ${countyList}.`;

  return (
    <section
      aria-labelledby="service-cta-heading"
      className="surface-dark relative isolate overflow-hidden bg-midnight-900 py-16 text-white md:py-20"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -right-24 top-1/2 -z-10 size-[480px] -translate-y-1/2 rounded-full bg-royal-600/30 blur-3xl"
      />
      <Container>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex max-w-2xl flex-col gap-4">
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            <h2 id="service-cta-heading" className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">
              {title}
            </h2>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">{body}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button variant="accent" size="lg" href={telHref(siteConfig.phone)}>
              <Phone aria-hidden className="size-5" />
              Call {siteConfig.phone}
            </Button>
            <Button variant="outline-light" size="lg" href="/contact">
              Request help online
              <ArrowRight aria-hidden className="size-5" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
