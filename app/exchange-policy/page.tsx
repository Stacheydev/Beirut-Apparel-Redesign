import type { Metadata } from "next";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { SITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Exchange Policy",
  description: "Beirut Apparel's exchange policy — exchanges only, within 7 days.",
};

export default function ExchangePolicyPage() {
  return (
    <>
      <CollectionHeader
        eyebrow="Good to know"
        title="Exchange policy"
        description={SITE.policy.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Exchange Policy" }]}
      />
      <div className="shell py-12">
        <div className="max-w-2xl">
          <ul className="space-y-4">
            {SITE.policy.rules.map((rule, i) => (
              <li key={i} className="flex gap-4 border-b border-line pb-4">
                <span className="font-display text-lg text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-muted">{rule}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 border border-line bg-sand/40 p-6">
            <p className="text-[14px] leading-relaxed text-muted">
              Need to make an exchange? Reach out through the{" "}
              <a href="/contact" className="text-lagoon underline underline-offset-2">
                contact page
              </a>{" "}
              with your order details and we&apos;ll guide you through it.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
