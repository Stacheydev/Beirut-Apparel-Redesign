"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/catalog";

export function Newsletter({ dark, className }: { dark?: boolean; className?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className={cn(className)}>
      <p
        className={cn(
          "font-sans text-[13px] font-semibold uppercase tracking-[0.14em]",
          dark ? "text-paper" : "text-ink",
        )}
      >
        {SITE.footer.newsletter.headline}
      </p>
      <p
        className={cn(
          "mt-1 text-[13px]",
          dark ? "text-paper/60" : "text-muted",
        )}
      >
        {SITE.footer.newsletter.sub}
      </p>
      {done ? (
        <p
          className={cn(
            "mt-4 border-t border-b py-2 font-sans text-[13px]",
            dark ? "border-paper/20 text-paper" : "border-line text-lagoon",
          )}
        >
          Welcome in — see you in your inbox.
        </p>
      ) : (
        <form
          className={cn("mt-4 flex", dark ? "border-b border-paper/30" : "border-b border-ink/25")}
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email address"
            className={cn(
              "w-full bg-transparent py-2 font-sans text-[14px] outline-none placeholder:opacity-50",
              dark ? "text-paper placeholder:text-paper/40" : "text-ink placeholder:text-muted",
            )}
          />
          <button
            type="submit"
            className={cn(
              "shrink-0 font-sans text-[12px] font-semibold uppercase tracking-[0.14em]",
              dark ? "text-paper hover:text-lagoon" : "text-ink hover:text-lagoon",
            )}
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
