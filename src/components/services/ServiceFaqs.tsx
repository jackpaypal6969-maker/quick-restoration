import { ChevronDown } from "lucide-react";
import type { ServiceFaq } from "@/config/site";
import { cn } from "@/lib/utils";

interface ServiceFaqsProps {
  faqs: readonly ServiceFaq[];
  className?: string;
}

/**
 * Native <details>/<summary> accordion: keyboard-operable and screen-reader
 * friendly with zero client JS. The chevron rotates via the `open` state.
 */
export function ServiceFaqs({ faqs, className }: ServiceFaqsProps) {
  return (
    <div className={cn("divide-y divide-ink-900/8 rounded-3xl bg-ice-50 ring-1 ring-ink-900/5", className)}>
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-6">
          <summary
            className={cn(
              "flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4",
              "font-semibold text-ink-950 [&::-webkit-details-marker]:hidden",
              "rounded-lg transition-colors hover:text-royal-600",
            )}
          >
            <span>{faq.question}</span>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-royal-600 transition-transform duration-300 ease-out-expo group-open:rotate-180"
            />
          </summary>
          <p className="pb-5 leading-relaxed text-ink-700">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
