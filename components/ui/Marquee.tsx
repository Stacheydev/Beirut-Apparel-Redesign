import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Slow editorial ticker. Content is duplicated once for a seamless loop;
 * reduced-motion users get a static line instead.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "overflow-hidden border-y border-line bg-ink text-paper",
        className,
      )}
    >
      <div className="flex w-max animate-marquee items-center py-3 motion-reduce:animate-none motion-reduce:w-full motion-reduce:justify-center motion-reduce:gap-6">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap px-6 font-sans text-[12px] uppercase tracking-[0.2em] text-paper/80"
          >
            {item}
            <span className="text-lagoon" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
