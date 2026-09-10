import { Leaf } from "lucide-react";

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl gradient-brand shadow-soft">
        <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rotate-45 rounded-[3px] border-2 border-card bg-harvest" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-display text-base font-extrabold tracking-tight ${light ? "text-primary-foreground" : "text-foreground"}`}
          >
            KISSAN<span className="text-accent">2</span>HOME
          </span>
          <span
            className={`mt-1 block text-[10px] uppercase tracking-[0.18em] ${light ? "text-primary-foreground/75" : "text-muted-foreground"}`}
          >
            From Farm to Your Home
          </span>
        </span>
      )}
    </span>
  );
}
