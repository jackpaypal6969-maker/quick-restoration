import { processSteps } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/sections/proof/ProcessTimeline";

/**
 * "How it works": the five steps from config as a scroll-drawn timeline.
 * Light surface; follows a dark section and precedes the dark Insurance block.
 */
export function Process() {
  return (
    <section id="process" className="section-y bg-white">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From your call to the final walkthrough"
            description="Five steps, one project manager, no surprises."
          />
        </Reveal>
        <ProcessTimeline steps={processSteps} className="mt-14 md:mt-20" />
      </Container>
    </section>
  );
}
