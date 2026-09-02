import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { LegalToc } from "./LegalToc";

interface BulletList {
  list: string[];
}

export interface LegalSection {
  /** Anchor id, also used by the "On this page" navigation. */
  id: string;
  heading: string;
  /** Paragraphs (strings or nodes) and bullet lists, rendered in order. */
  content: Array<ReactNode | BulletList>;
}

interface LegalDocumentProps {
  /** Human-readable effective date, e.g. "September 2026". */
  effective: string;
  intro: ReactNode;
  sections: LegalSection[];
}

function isBulletList(item: ReactNode | BulletList): item is BulletList {
  return typeof item === "object" && item !== null && "list" in item && Array.isArray(item.list);
}

/**
 * Light prose layout for the privacy and terms pages: a sticky "On this page"
 * index on large screens (with the current section marked) and numbered h2
 * sections held to a readable measure.
 */
export function LegalDocument({ effective, intro, sections }: LegalDocumentProps) {
  return (
    <section className="section-y bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <LegalToc items={sections.map(({ id, heading }) => ({ id, heading }))} />
          </aside>

          <article className="max-w-[65ch]">
            <p className="text-sm font-semibold text-ink-500">Effective {effective}</p>
            <div className="mt-4 text-lg leading-relaxed text-ink-700">{intro}</div>

            <div className="mt-14 flex flex-col gap-12">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold text-ink-950 sm:text-[1.75rem]">
                    <span aria-hidden className="font-sans text-sm font-bold tabular-nums text-royal-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4 leading-relaxed text-ink-700">
                    {section.content.map((item, itemIndex) =>
                      isBulletList(item) ? (
                        <ul key={itemIndex} className="flex list-disc flex-col gap-2 pl-5 marker:text-royal-600">
                          {item.list.map((entry) => (
                            <li key={entry}>{entry}</li>
                          ))}
                        </ul>
                      ) : (
                        <p key={itemIndex}>{item}</p>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
