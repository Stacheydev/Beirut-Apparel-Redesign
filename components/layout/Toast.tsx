"use client";

import { Check } from "lucide-react";
import { useUI } from "@/lib/store-context";

export function Toast() {
  const { toast } = useUI();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 bg-ink px-5 py-3 text-paper shadow-lift animate-fade-up"
      role="status"
    >
      <Check className="h-4 w-4 text-lagoon" strokeWidth={2} />
      <span className="font-sans text-[13px]">{toast.message}</span>
    </div>
  );
}
