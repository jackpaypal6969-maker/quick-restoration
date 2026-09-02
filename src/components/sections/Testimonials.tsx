import { Quote, Star } from "lucide-react";
import { services, testimonials, type Service, type ServiceIconKey } from "@/config/site";
import { ServiceIcon } from "@/components/services/ServiceIcon";
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

/** Lower-cased word tokens: "Water & Flood Damage" -> ["water", "flood", "damage"]. */
function words(label: string) {
  return label.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

/**
 * Icon of the service a review's `service` tag refers to, matched on shortName
 * or name: exact first, then every word of the tag present ("Water Damage"
 * -> "Water & Flood Damage"). Undefined when no service matches, so the pill
 * renders without an icon.
 */
function serviceIconFor(tag: string): ServiceIconKey | undefined {
  const want = words(tag);
  if (want.length === 0) return undefined;
  const key = want.join(" ");
  const labels = (s: Service) => [s.shortName, s.name];
  const exact = services.find((s) => labels(s).some((l) => words(l).join(" ") === key));
  if (exact) return exact.icon;
  const loose = services.find((s) =>
    labels(s).some((l) => {
      const have = new Set(words(l));
      return want.every((w) => have.has(w));
    }),
  );
  return loose?.icon;
}

/**
 * Client reviews in a three-column masonry on lg. Shows a discreet notice
 * while config still carries sample reviews.
 *
 * Card hover shadow crossfades in on an `after:` pseudo-element so only
 * opacity animates (no box-shadow repaint). The figure therefore no longer
 * clips overflow; the corner quote mark is clipped by its own wrapper instead.
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
          {testimonials.items.map((t, i) => {
            const icon = serviceIconFor(t.service);
            return (
              <Reveal key={t.name} delay={(i % 3) * 0.08} y={20} className="mb-6 break-inside-avoid">
                <figure className="relative isolate rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink-900/5 transition-transform duration-300 ease-out-expo after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:shadow-card-hover after:opacity-0 after:transition-opacity after:duration-300 after:ease-out-expo hover:-translate-y-1 hover:after:opacity-100">
                  {/* Corner quote mark, clipped to the card's rounding. */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                    <Quote aria-hidden className="absolute -right-2 -top-2 size-16 text-royal-100" strokeWidth={1.25} />
                  </span>

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
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-royal-700 via-royal-500 to-electric-600 font-display text-sm font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]"
                    >
                      {initials(t.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink-950">{t.name}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
                        <span>{t.location}</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-royal-100 px-2 py-0.5 text-xs font-semibold text-royal-700">
                          {icon && <ServiceIcon icon={icon} size={12} strokeWidth={2} className="shrink-0" />}
                          {t.service}
                        </span>
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
