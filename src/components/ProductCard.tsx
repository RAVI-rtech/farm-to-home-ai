import { Link } from "@tanstack/react-router";
import { MapPin, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { inr } from "@/lib/store";

export function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <article className="card-surface group overflow-hidden hover:-translate-y-1 hover:shadow-lift">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.organic && (
            <span className="absolute left-3 top-3 rounded-full bg-leaf px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-leaf-foreground">
              Organic
            </span>
          )}
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[11px] font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-harvest text-harvest" /> {product.rating}
          </span>
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{product.category}</p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="line-clamp-1 text-base font-bold hover:text-primary">{product.name}</h3>
        </Link>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {product.farmer} · {product.location}
        </p>
        <div className="flex items-center justify-between pt-1">
          <p className="font-display text-lg font-extrabold">
            {inr(product.price)}
            <span className="text-xs font-medium text-muted-foreground">/{product.unit}</span>
          </p>
          <button
            onClick={onAdd}
            className="flex items-center gap-1 rounded-full gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95 hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
