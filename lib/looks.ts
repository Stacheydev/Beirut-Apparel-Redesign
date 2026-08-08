import type { LookRole } from "@/types/catalog";

const labels: Record<LookRole, string> = {
  top: "Top",
  bottom: "Bottom",
  set: "Co-ord set",
  dress: "Dress",
  outer: "Layer",
  swim: "Swimwear",
  abaya: "Abaya",
  accessory: "Accessory",
};

export function roleLabel(role: LookRole): string {
  return labels[role];
}
