import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

/**
 * Typographic wordmark — "BEIRUT" in Fraunces display serif, "APPAREL"
 * tracked wide underneath. A clean editorial take on the brand (no reliance
 * on the reference PNG logo).
 */
export function Logo({ className, tone = "dark" }: LogoProps) {
  const ink = tone === "dark" ? "text-ink" : "text-paper";
  return (
    <Link
      href="/"
      aria-label="Beirut Apparel — home"
      className={cn("group inline-flex flex-col items-center leading-none", className)}
    >
      <span
        className={cn(
          "display font-medium text-[20px] tracking-[0.08em] transition-opacity group-hover:opacity-80",
          ink,
        )}
      >
        BEIRUT
      </span>
      <span
        className={cn(
          "mt-1 font-sans text-[9px] font-semibold uppercase tracking-[0.42em] opacity-70",
          ink,
        )}
      >
        Apparel
      </span>
    </Link>
  );
}
