import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn, telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

interface CompactCtaProps {
  eyebrow?: string;
  title: string;
  description: string;
  /** "dark" = midnight band with cyan CTA; "light" = ice band with violet CTA. */
  tone?: "dark" | "light";
  id?: string;
}

/** Short conversion band: one line, phone plus contact. Alternates tone with its neighbours. */
export function CompactCta({ eyebrow = "24/7 dispatch", title, description, tone = "dark", id }: CompactCtaProps) {
  const dark = tone === "dark";
  const headingId = id ? `${id}-heading` : "compact-cta-heading";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative isolate overflow-hidden py-16 md:py-20",
        dark ? "surface-dark bg-midnight-900 text-white" : "bg-ice-50 text-ink-950",
      )}
    >
      {dark && (
        <>
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
          <div
            aria-hidden
            className="absolute -right-24 top-1/2 -z-10 size-[480px] -translate-y-1/2 rounded-full bg-royal-600/30 blur-3xl"
          />
        </>
      )}
      <Container>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex max-w-2xl flex-col gap-4">
            <Eyebrow tone={dark ? "dark" : "light"}>{eyebrow}</Eyebrow>
            <h2 id={headingId} className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">
              {title}
            </h2>
            <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-ink-700")}>
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button variant={dark ? "accent" : "primary"} size="lg" href={telHref(siteConfig.phone)}>
              <Phone aria-hidden className="size-5" />
              Call {siteConfig.phone}
            </Button>
            <Button variant={dark ? "outline-light" : "outline"} size="lg" href="/contact">
              Request help online
              <ArrowRight aria-hidden className="size-5" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
