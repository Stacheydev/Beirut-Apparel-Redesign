import { ShieldCheck, Repeat, Sprout, HeartHandshake } from "lucide-react";
import { SITE } from "@/lib/catalog";

const icons = [Repeat, Sprout, HeartHandshake, ShieldCheck];

/** Trust strip — surfaces the real exchange policy and brand facts. */
export function TrustBar() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {SITE.trust.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={item.title} className="flex gap-4">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-lagoon"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
