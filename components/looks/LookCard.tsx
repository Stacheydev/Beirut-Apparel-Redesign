import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Look } from "@/types/catalog";
import { cn } from "@/lib/cn";

interface LookCardProps {
  look: Look;
  pieceCount?: number;
  className?: string;
  aspect?: "4/5" | "3/4";
}

/** Editorial look card — outfit first, pieces behind it. */
export function LookCard({ look, pieceCount, className, aspect = "4/5" }: LookCardProps) {
  return (
    <Link
      href={`/looks/${look.handle}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-sand",
          aspect === "4/5" ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
      >
        <ProductImage
          src={look.image}
          alt={look.title}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 bg-ink/85 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-paper">
          Look · {pieceCount ?? look.items.length} pieces
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1 text-muted">{look.mood}</p>
          <h3 className="font-display text-xl text-ink">{look.title}</h3>
          <p className="mt-1 line-clamp-2 max-w-xs text-[13px] leading-relaxed text-muted">
            {look.tagline}
          </p>
        </div>
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}
