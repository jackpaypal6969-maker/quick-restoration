import { BadgeCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/** Numbered rows for each credential, dark surface. */
export function CredentialsList() {
  return (
    <ol className="divide-y divide-white/10 border-y border-white/10">
      {siteConfig.credentials.map((credential, i) => (
        <Reveal key={credential.key} as="li" delay={i * 0.06} y={16}>
          <div className="grid gap-3 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 md:grid-cols-[4rem_18rem_minmax(0,1fr)] md:py-8">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-electric-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="flex items-start gap-2.5 font-display text-xl font-bold leading-tight text-white">
              <BadgeCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-electric-300 md:hidden" />
              {credential.label}
            </h3>
            <p className="text-base leading-relaxed text-white/65 sm:col-start-2 md:col-start-3">{credential.detail}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
