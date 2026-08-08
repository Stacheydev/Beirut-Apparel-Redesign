import { cn } from "@/lib/cn";

type Tone = "sale" | "new" | "sold" | "best" | "default";

const tones: Record<Tone, string> = {
  sale: "bg-terracotta text-white",
  new: "bg-lagoon text-lagoon-ink",
  sold: "bg-ink/80 text-paper",
  best: "bg-ink text-paper",
  default: "bg-paper/90 text-ink border border-line",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
