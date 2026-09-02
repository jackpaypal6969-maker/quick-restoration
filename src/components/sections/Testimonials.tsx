import { Quote, Star } from "lucide-react";
import { testimonials } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** "Michael R." -> "MR" (decorative avatar). */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, "").charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Client reviews in a three-column masonry on lg. Shows a discreet notice
 * while config still carries sample reviews.
 */
export function Testimonials() {
  return (
    <section id="reviews" className="section-y bg-ice-50">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="What clients say" title="Calm, fast and finished" />
          {testimonials.sample && (
            <p className="mt-3 text-xs text-ink-500">
              Sample reviews shown for preview; live reviews replace these at launch.
            </p>
          )}
        </Reveal>

        <div className="mt-12 columns-1 gap-6 md:mt-16 md:columns-2 lg:columns-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08} y={20} className="mb-6 break-inside-avoid">
              <figure className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink-900/5 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-card-hover">
                <Quote aria-hidden className="absolute -right-2 -top-2 size-16 text-royal-100" strokeWidth={1.25} />

                <div aria-hidden className="relative flex gap-1 text-royal-500">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} aria-hidden className="size-4 fill-current" />
                  ))}
                </div>

                <blockquote className="relative mt-4">
                  <p className="text-[15px] leading-relaxed text-ink-900">{t.quote}</p>
                </blockquote>

                <figcaption className="relative mt-5 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-royal-100 font-display text-sm font-bold text-royal-700"
                  >
                    {initials(t.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink-950">{t.name}</span>
                    <span className="block text-sm text-ink-500">
                      {t.location}
                      <span aria-hidden className="mx-1.5 text-ink-300">
                        /
                      </span>
                      {t.service}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
