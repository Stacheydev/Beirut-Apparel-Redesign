import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Editorial section heading: small-caps index + eyebrow, display serif title,
 * optional description and "view all" link. The numbered index gives the
 * homepage its editorial-magazine cadence.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-xl", align === "center" && "mx-auto")}>
        {(index || eyebrow) && (
          <p className="eyebrow mb-3 flex items-center gap-2 text-muted">
            {index && <span className="text-terracotta">{index}</span>}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        )}
        <h2 className="display text-3xl text-balance sm:text-4xl">{title}</h2>
        {description && (
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
        >
          {linkLabel}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </Link>
      )}
    </div>
  );
}
