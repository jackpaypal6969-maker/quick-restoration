import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/** Eyebrow + display heading + optional lede, consistent across every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={dark ? "dark" : "light"}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "font-display text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-ink-950",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("max-w-2xl text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-ink-700")}>
          {description}
        </p>
      )}
    </div>
  );
}
