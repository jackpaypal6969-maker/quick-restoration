import Link from "next/link";
import { useId } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/* Literal hex values from globals.css: electric-300 -> electric-400 -> royal-400 */
const GRADIENT_STOPS = ["#67e8f9", "#22d3ee", "#8b5cf6"] as const;

interface LogoMarkProps {
  className?: string;
  /** Accessible name. Leave empty when the wordmark or parent link already labels it. */
  title?: string;
}

/**
 * Brand mark: a bold rounded Q whose tail resolves into a single water drop,
 * filled with the electric-to-royal gradient.
 */
export function LogoMark({ className, title }: LogoMarkProps) {
  const reactId = useId();
  const gradientId = `qr-mark-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GRADIENT_STOPS[0]} />
          <stop offset="0.5" stopColor={GRADIENT_STOPS[1]} />
          <stop offset="1" stopColor={GRADIENT_STOPS[2]} />
        </linearGradient>
      </defs>
      {/* The Q body */}
      <circle cx="18" cy="18" r="11.5" fill="none" stroke={`url(#${gradientId})`} strokeWidth="6" />
      {/* The tail: a teardrop whose round end crosses into the bowl and whose tip leaves at the lower right */}
      <path
        d="M20.71 24.91 L37 37 L24.91 20.71 A3 3 0 1 0 20.71 24.91 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

interface LogoProps {
  /** "dark" = on midnight surfaces (white wordmark), "light" = on white surfaces (ink wordmark). */
  tone?: "light" | "dark";
  className?: string;
  /** Wrap in a link to the home page (default). */
  link?: boolean;
  size?: "sm" | "md";
}

/** Mark + wordmark. The wordmark is real text so it stays crisp and selectable. */
export function Logo({ tone = "dark", className, link = true, size = "sm" }: LogoProps) {
  const [first, ...rest] = siteConfig.name.split(" ");
  const restText = rest.join(" ");

  const content = (
    <>
      <LogoMark className={size === "md" ? "size-11" : "size-9 md:size-10"} />
      <span
        className={cn(
          "font-display leading-none tracking-[-0.03em] transition-colors duration-300 ease-out-expo",
          size === "md" ? "text-[1.35rem]" : "text-[1.15rem] md:text-xl",
          tone === "dark" ? "text-white" : "text-ink-950",
        )}
      >
        <span className="font-bold">{first}</span>
        {restText && (
          <>
            {" "}
            <span className="font-medium">{restText}</span>
          </>
        )}
      </span>
    </>
  );

  const classes = cn("inline-flex min-h-11 shrink-0 items-center gap-2.5", className);

  if (!link) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href="/" className={cn(classes, "rounded-full")} aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
