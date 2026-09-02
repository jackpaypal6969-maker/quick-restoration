import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  /** "compact" steps the h1 down one size at every breakpoint for long titles (county headlines). */
  titleSize?: "default" | "compact";
  description?: ReactNode;
  /** CTA buttons or other actions */
  children?: ReactNode;
  /**
   * Hide the second child (the outline CTA) below `sm`. Opt in on pages where the
   * mobile call bar already offers that secondary action, so the hero CTA stack
   * does not collide with the bar at first paint.
   */
  hideSecondaryOnMobile?: boolean;
  /** Optional photo behind the banner (rendered dim under a midnight gradient). */
  image?: string;
  imageAlt?: string;
  /**
   * Decorative artwork shown to the right of the copy at lg+ and hidden below.
   * It gets its own grid column, so it can never overlap the text, and it is
   * hidden from assistive tech: pass decoration only.
   */
  art?: ReactNode;
  /** Tighter bottom padding for pages whose first section starts immediately. */
  compact?: boolean;
  breadcrumbs?: Crumb[];
  className?: string;
}

const titleSizes: Record<NonNullable<PageHeroProps["titleSize"]>, string> = {
  default: "text-4xl sm:text-5xl lg:text-6xl",
  compact: "text-3xl sm:text-4xl lg:text-5xl",
};

/** 44px tap target on a 20px line: the nav's negative margin absorbs the extra height. */
const crumbClass = "inline-flex min-h-11 items-center";
const crumbLinkClass = cn(crumbClass, "transition-colors hover:text-white");

/**
 * Dark banner that opens every inner page so the transparent Header always
 * sits over midnight. Home uses the bespoke <Hero> instead.
 */
export function PageHero({
  eyebrow,
  title,
  titleSize = "default",
  description,
  children,
  hideSecondaryOnMobile = false,
  image,
  imageAlt = "",
  art,
  compact = false,
  breadcrumbs,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-midnight-radial text-white", className)}>
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-linear-to-b from-midnight-950/70 via-midnight-900/75 to-midnight-900" />
        </div>
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 mask-fade-x" />
      <div
        aria-hidden
        className="absolute -right-32 top-1/2 -z-10 size-[520px] -translate-y-1/2 rounded-full bg-electric-400/10 blur-3xl"
      />
      <Container className={cn("pt-28 md:pt-40", compact ? "pb-14 md:pb-20" : "pb-20 md:pb-28")}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="-mt-3 mb-3">
            <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-white/60">
              <li>
                <Link href="/" className={crumbLinkClass}>
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-1.5">
                    <ChevronRight aria-hidden className="size-3.5 text-white/35" />
                    {last ? (
                      <span aria-current="page" className={cn(crumbClass, "text-white/85")}>
                        {crumb.label}
                      </span>
                    ) : (
                      <Link href={crumb.href} className={crumbLinkClass}>
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <div className={cn(art && "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16")}>
          <div className="flex max-w-3xl flex-col gap-5">
            {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
            <h1 className={cn("font-display font-bold leading-[1.02]", titleSizes[titleSize])}>{title}</h1>
            {description && <p className="max-w-2xl text-lg leading-relaxed text-white/72">{description}</p>}
            {children && (
              <div
                className={cn("mt-2 flex flex-wrap gap-3", hideSecondaryOnMobile && "max-sm:[&>*:nth-child(2)]:hidden")}
              >
                {children}
              </div>
            )}
          </div>
          {art && (
            <div aria-hidden className="hidden lg:flex lg:justify-end">
              {art}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
