import { Marquee } from "@/components/ui/Marquee";

const phrases = [
  "Rooted in Beirut",
  "100% linen",
  "The Postcards from Summer edit",
  "Exchanges within 7 days",
  "Satin · Linen · Swimwear · Abayas",
  "From friends to founders",
  "Sun-washed pieces for the everyday",
];

export function Ticker() {
  return <Marquee items={phrases} className="mt-0" />;
}
