import { cn } from "@/lib/cn";
import { discountPercent, formatMoney } from "@/lib/format";

interface PriceProps {
  priceCents: number;
  compareAtCents?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "text-[13px]",
  md: "text-[15px]",
  lg: "text-[17px]",
};

export function Price({
  priceCents,
  compareAtCents,
  size = "md",
  className,
}: PriceProps) {
  const pct = discountPercent(priceCents, compareAtCents);
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 font-sans",
        sizes[size],
        className,
      )}
    >
      <span className="font-medium text-ink">{formatMoney(priceCents)}</span>
      {compareAtCents != null && compareAtCents > priceCents && (
        <>
          <span className="text-muted line-through">
            {formatMoney(compareAtCents)}
          </span>
          {pct != null && (
            <span className="text-[11px] font-semibold text-terracotta">
              −{pct}%
            </span>
          )}
        </>
      )}
    </span>
  );
}
