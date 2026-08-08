import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-center py-32 text-center">
      <p className="font-display text-7xl text-ink">404</p>
      <p className="mt-4 font-display text-2xl text-ink">This piece isn&apos;t on the rack</p>
      <p className="mt-2 max-w-sm text-[14px] text-muted">
        The page you&apos;re looking for has moved or never existed. Let&apos;s get you
        back to something sun-washed.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="lagoon" href="/">
          Back home
        </Button>
        <Button variant="outline" href="/shop">
          Shop all
        </Button>
      </div>
    </div>
  );
}
