import { Phone } from "lucide-react";
import { faqs, siteConfig } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}).replace(/</g, "\\u003c");

/**
 * Home-page FAQ: sticky heading + phone CTA on the left, accordion of the six
 * config questions on the right (first open). Emits FAQPage JSON-LD.
 */
export function FAQ() {
  return (
    <section id="faq" className="section-y bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="Straight answers before you call"
                description="If yours is not here, the dispatcher will answer it on the phone."
              />
              <div className="mt-8">
                <Button variant="primary" size="lg" href={telHref(siteConfig.phone)}>
                  <Phone aria-hidden className="size-5" />
                  Call {siteConfig.phone}
                </Button>
              </div>
              <p className="mt-4 text-sm text-ink-500">{siteConfig.hours}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={20}>
            <Accordion type="single" tone="light" defaultOpen={["faq-0"]}>
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
