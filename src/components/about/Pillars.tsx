import { Award, ClipboardCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

type CredentialKey = (typeof siteConfig.credentials)[number]["key"];

interface Pillar {
  title: string;
  lede: string;
  credential: CredentialKey;
  icon: LucideIcon;
}

const pillars: Pillar[] = [
  {
    title: "Certified",
    lede: "Every crew is led by an IICRC-certified technician, not a helper with a fan.",
    credential: "iicrc",
    icon: Award,
  },
  {
    title: "Licensed",
    lede: "Mold work in New York requires a state license. We hold one, and we put the number on the proposal.",
    credential: "nys-mold",
    icon: ShieldCheck,
  },
  {
    title: "Accountable",
    lede: "Insured on every job, documented for your adjuster and billed to your carrier directly.",
    credential: "insurance-billing",
    icon: ClipboardCheck,
  },
];

function credentialDetail(key: CredentialKey): string {
  return siteConfig.credentials.find((credential) => credential.key === key)?.detail ?? "";
}

/** Three standards, three cards, one icon each. Light surface. */
export function Pillars() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {pillars.map((pillar, i) => {
        const Icon = pillar.icon;
        return (
          <Reveal key={pillar.title} as="li" delay={i * 0.08} y={20} className="flex">
            <article className="group flex w-full flex-col rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink-900/5 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-midnight-900 text-electric-300 shadow-glow">
                <Icon aria-hidden className="size-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-ink-950">{pillar.title}</h3>
              <p className="mt-2 text-base font-medium leading-relaxed text-ink-700">{pillar.lede}</p>
              <p className="mt-4 border-t border-ink-900/8 pt-4 text-sm leading-relaxed text-ink-500">
                {credentialDetail(pillar.credential)}
              </p>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
