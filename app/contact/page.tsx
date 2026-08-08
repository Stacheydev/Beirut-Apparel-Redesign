"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const inputCls =
    "w-full border border-line bg-surface px-4 py-3 font-sans text-[14px] text-ink outline-none transition-colors focus:border-ink placeholder:text-muted/60";

  return (
    <>
      <CollectionHeader
        eyebrow="Say hello"
        title="Contact us"
        description="Questions about a piece, sizing, or an exchange — send us a note and we'll get back to you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="shell py-12">
        <div className="mx-auto max-w-md">
          {sent ? (
            <div className="border border-lagoon/40 bg-lagoon/5 p-8 text-center">
              <Check className="mx-auto h-6 w-6 text-lagoon" strokeWidth={1.5} />
              <p className="mt-4 font-display text-2xl text-ink">Message sent</p>
              <p className="mt-2 text-[14px] text-muted">
                Thanks for reaching out — we&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="eyebrow mb-2 block text-muted">
                  Name
                </label>
                <input id="name" name="name" className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow mb-2 block text-muted">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="eyebrow mb-2 block text-muted">
                  Phone number
                </label>
                <input id="phone" name="phone" className={inputCls} placeholder="+961 …" />
              </div>
              <div>
                <label htmlFor="comment" className="eyebrow mb-2 block text-muted">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  className={inputCls}
                  placeholder="Tell us a little more…"
                />
              </div>
              <Button type="submit" variant="ink" size="lg" className="w-full">
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
