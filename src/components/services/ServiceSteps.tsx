import type { Service } from "@/config/site";
import { padIndex } from "@/components/services/helpers";

interface ServiceStepsProps {
  steps: Service["steps"];
}

/** Numbered vertical sequence with a connecting rail. Numbers are earned: order matters. */
export function ServiceSteps({ steps }: ServiceStepsProps) {
  return (
    <ol className="mt-8">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
            {!last && <span aria-hidden className="absolute bottom-0 left-5 top-11 w-px bg-ink-200" />}
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-midnight-900 font-display text-sm font-bold text-electric-300 ring-4 ring-white">
              {padIndex(i)}
            </span>
            <div className="pt-1.5">
              <h3 className="font-display text-lg font-bold text-ink-950">{step.title}</h3>
              <p className="mt-1 leading-relaxed text-ink-700">{step.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
