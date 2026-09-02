import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "outline" | "outline-light" | "ghost" | "white";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Internal path ("/contact"), tel:/mailto:, or external URL. Renders a link when set. */
  href?: string;
  /** Force a plain <a> with target=_blank + rel for external destinations. */
  external?: boolean;
  ariaLabel?: string;
}

type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold " +
  "select-none transition-[transform,scale,background-color,color,border-color] duration-300 ease-out-expo " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

/**
 * Hover shadow for variants that lift: crossfaded in on an `after:`
 * pseudo-element so only opacity animates (no box-shadow repaint). The resting
 * shadow stays on the element itself.
 */
const hoverShadowCard =
  "relative isolate after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] " +
  "after:shadow-card-hover after:opacity-0 after:transition-opacity after:duration-300 after:ease-out-expo hover:after:opacity-100";

const variants: Record<ButtonVariant, string> = {
  primary: `bg-royal-600 text-white shadow-card hover:bg-royal-500 ${hoverShadowCard}`,
  accent: "bg-electric-400 text-midnight-950 shadow-glow hover:bg-electric-300",
  outline: "border border-ink-900/15 text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/5",
  "outline-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
  ghost: "text-ink-900 hover:bg-ink-900/5",
  white: "bg-white text-midnight-900 shadow-card hover:bg-ice-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-5 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

/**
 * The one button. Renders <Link> for internal routes, <a> for tel:/mailto:/external,
 * or <button> when no href is given. All sizes meet the 44px tap-target minimum.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ariaLabel,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const isInternal = href.startsWith("/") && !external;
    if (isInternal) {
      return (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }
    const isWeb = /^https?:/i.test(href);
    const newTab = isWeb || Boolean(external);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel && newTab ? `${ariaLabel} (opens in a new tab)` : ariaLabel}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button type={type} className={classes} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  );
}
