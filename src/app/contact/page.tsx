import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Mail, MapPin, Phone } from "lucide-react";
import { serviceAreas, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { areaHref } from "@/components/map/county-keys";

const areaNames = serviceAreas.map((area) => area.name);
const areaSentence = `${areaNames.slice(0, -1).join(", ")} and ${areaNames[areaNames.length - 1]}`;

export const metadata: Metadata = buildMetadata({
  title: "Contact Us: 24/7 Emergency Line",
  description: `Reach a live ${siteConfig.name} dispatcher any hour at ${siteConfig.phone}, or send a request for an estimate. Water, fire, mold, storm and sewage restoration across ${areaSentence}.`,
  path: "/contact",
});

const NEXT_STEPS = [
  {
    title: "A dispatcher reads it",
    body: "Form requests reach the same 24/7 desk that answers the phone, not a shared inbox that gets checked in the morning.",
  },
  {
    title: "We call you back",
    body: "You get a call at the number you gave: quickly for anything active, the same day for estimates and questions.",
  },
  {
    title: "A crew or estimator is scheduled",
    body: "Active damage gets a crew with equipment on the truck. Estimates get a walkthrough and the documentation your insurer will ask for.",
  },
];

const cardLink =
  "inline-flex min-h-11 items-center text-white/80 underline-offset-4 transition-colors duration-200 hover:text-electric-300 hover:underline";

export default function ContactPage() {
  const phoneHref = telHref(siteConfig.phone);

  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        title="Talk to a live dispatcher, any hour"
        description="Call for emergencies. Use the form for estimates, questions or non-urgent damage; we reply the same day."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
      >
        <Button variant="accent" size="lg" href={phoneHref}>
          <Phone aria-hidden className="size-5" />
          Call {siteConfig.phone}
        </Button>
        <Button variant="outline-light" size="lg" href="#request-form">
          Send a request
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </PageHero>

      <section className="section-y bg-ice-50">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-8 lg:col-span-5">
              <Reveal>
                <div className="surface-dark relative isolate overflow-hidden rounded-3xl bg-midnight-radial p-7 text-white shadow-card-dark ring-1 ring-white/10 sm:p-9">
                  <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
                  <div
                    aria-hidden
                    className="absolute -right-20 -top-20 -z-10 size-64 rounded-full bg-electric-400/15 blur-3xl"
                  />

                  <Eyebrow tone="dark">Emergency line</Eyebrow>
                  <a
                    href={phoneHref}
                    className="mt-4 inline-flex min-h-11 items-center font-display text-4xl font-bold leading-none tracking-tight text-white transition-colors duration-200 hover:text-electric-300 sm:text-5xl"
                  >
                    {siteConfig.phone}
                  </a>
                  <p className="mt-3 text-sm text-white/70">
                    Answered by a dispatcher, not a service. Target on-site: {siteConfig.responseTime.toLowerCase()}.
                  </p>

                  <dl className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6">
                    <div className="flex min-h-11 items-center gap-3.5">
                      <dt className="shrink-0">
                        <Clock aria-hidden className="size-5 text-electric-300" />
                        <span className="sr-only">Hours</span>
                      </dt>
                      <dd className="text-sm leading-relaxed text-white/80">{siteConfig.hours}</dd>
                    </div>
                    <div className="flex min-h-11 items-center gap-3.5">
                      <dt className="shrink-0">
                        <Mail aria-hidden className="size-5 text-electric-300" />
                        <span className="sr-only">Email</span>
                      </dt>
                      <dd className="min-w-0 text-sm leading-relaxed">
                        <a href={`mailto:${siteConfig.email}`} className={`${cardLink} break-all`}>
                          {siteConfig.email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex gap-3.5">
                      <dt className="shrink-0">
                        <MapPin aria-hidden className="mt-3 size-5 text-electric-300" />
                        <span className="sr-only">Service areas</span>
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        <ul className="flex flex-wrap gap-x-5 gap-y-1">
                          {serviceAreas.map((area) => (
                            <li key={area.slug}>
                              <Link href={areaHref(area)} className={cardLink}>
                                {area.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-7" aria-label="Credentials">
                    {siteConfig.credentials.map((credential) => (
                      <li key={credential.key} className="flex items-start gap-2.5 text-sm text-white/80">
                        <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-300" />
                        {credential.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="px-1 sm:px-2">
                  <h2 className="font-display text-xl font-bold text-ink-950">What happens next</h2>
                  <ol className="mt-5 flex flex-col gap-5">
                    {NEXT_STEPS.map((step, i) => (
                      <li key={step.title} className="flex gap-4">
                        <span
                          aria-hidden
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-royal-100 font-display text-sm font-bold text-royal-600"
                        >
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-sans text-base font-semibold text-ink-950">{step.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink-700">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>

            {/*
              The form column is deliberately not wrapped in <Reveal>: the lead form must
              render visible with no IntersectionObserver, no motion and no JS at all.
              The intro is passed to the form so it can be replaced on success.
            */}
            <div id="request-form" className="scroll-mt-28 lg:col-span-7">
              <ContactForm
                intro={
                  <div className="mb-6">
                    <Eyebrow>Send a request</Eyebrow>
                    <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">
                      Tell us what happened
                    </h2>
                    <p className="mt-2 text-base text-ink-700">Two minutes, no account. A person reads every request.</p>
                  </div>
                }
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
