"use client";

import { Drawer } from "@/components/ui/Drawer";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
  sizeOptions: string[];
}

/**
 * Fit guide built around Beirut Apparel's real sizing model: two fits
 * (XS–S / M–L), one-size pieces, and S/M/L for swimwear. Guidance is framed
 * honestly as fit advice, not invented measurements.
 */
export function SizeGuide({ open, onClose, sizeOptions }: SizeGuideProps) {
  const hasSwim = sizeOptions.some((s) => /^S$|^M$|^L$/i.test(s));
  const hasOneSize = sizeOptions.some((s) => /one size/i.test(s));
  const hasTwo = sizeOptions.some((s) => /XS-S/i.test(s)) || sizeOptions.length >= 2;

  return (
    <Drawer open={open} onClose={onClose} title="Size & fit guide" side="right">
      <div className="space-y-6 px-6 py-6">
        <div>
          <p className="eyebrow mb-2 text-muted">How Beirut Apparel fits</p>
          <p className="text-[14px] leading-relaxed text-muted">
            Most pieces are cut to two easy fits rather than a full size run —
            so choosing is simple.
          </p>
        </div>

        <ul className="space-y-3">
          {hasTwo && (
            <li className="border border-line bg-surface p-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
                XS–S
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                A close-to-true fit. Choose this if you usually wear XS or S.
              </p>
            </li>
          )}
          {hasTwo && (
            <li className="border border-line bg-surface p-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
                M–L
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                A relaxed fit. Choose this if you usually wear M or L, or
                prefer a little more ease.
              </p>
            </li>
          )}
          {hasSwim && (
            <li className="border border-line bg-surface p-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
                Swim S / M / L
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Swimwear runs in single-letter sizes. When in doubt, size up.
              </p>
            </li>
          )}
          {hasOneSize && (
            <li className="border border-line bg-surface p-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
                One Size
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Cut generously to drape across a range of sizes.
              </p>
            </li>
          )}
        </ul>

        <div>
          <p className="eyebrow mb-2 text-muted">Still unsure?</p>
          <p className="text-[14px] leading-relaxed text-muted">
            We offer exchanges within 7 days of receiving your order. If the
            fit isn&apos;t right, swap it — unused, unworn and with tags
            attached.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
