import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** "dark" = on midnight surfaces (cyan), "light" = on white surfaces (violet). */
  tone?: "dark" | "light";
  dot?: boolean;
}

/** Small tracked uppercase label that sits above section headings. */
export function Eyebrow({ children, className, tone = "light", dot = true }: EyebrowProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2.5",
        tone === "dark" ? "text-electric-300" : "text-royal-600",
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            tone === "dark" ? "bg-electric-400 shadow-[0_0_12px_2px_rgb(34_211_238/0.6)]" : "bg-royal-600",
          )}
        />
      )}
      {children}
    </span>
  );
}
