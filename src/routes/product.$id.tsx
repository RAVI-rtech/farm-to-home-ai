import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Leaf, MapPin, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { inr, useApp } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product details — KISSAN2HOME" },
      { name: "description", content: "See farm details, pricing and freshness for produce listed on KISSAN2HOME." },
      { property: "og:title", content: "Product details — KISSAN2HOME" },
      { property: "og:description", content: "Farm details, pricing and freshness for produce on KISSAN2HOME." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { products, addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === id);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to market
        </Link>

        {!product ? (
          <div className="card-surface mt-6 p-14 text-center">
            <p className="font-semibold">This listing is no longer available</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="card-surface overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {product.category}
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-harvest text-harvest" /> {product.rating} rating
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {product.location}
                </span>
                {product.organic && (
                  <span className="flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-bold text-leaf-foreground">
                    <Leaf className="h-3 w-3" /> Organic
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

              <div className="mt-6 flex items-end gap-2">
                <p className="font-display text-4xl font-extrabold">{inr(product.price)}</p>
                <span className="pb-1 text-sm text-muted-foreground">per {product.unit}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{product.stock} {product.unit} in stock</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-4 rounded-full border border-border bg-card px-4 py-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addToCart(product.id, qty);
                    toast.success(`${qty} ${product.unit} of ${product.name} added`);
                  }}
                  className="flex-1 rounded-full gradient-brand px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] active:scale-95 sm:flex-none"
                >
                  Add to basket · {inr(product.price * qty)}
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, t: "Next-day delivery" },
                  { icon: ShieldCheck, t: "Quality checked" },
                  { icon: Leaf, t: "Farm traceable" },
                ].map((b) => (
                  <div key={b.t} className="card-surface flex items-center gap-2 p-3 text-xs font-medium">
                    <b.icon className="h-4 w-4 text-accent" /> {b.t}
                  </div>
                ))}
              </div>

              <div className="card-surface mt-6 flex items-center gap-4 p-4">
                <span className="grid h-12 w-12 place-items-center rounded-full gradient-brand font-bold text-primary-foreground">
                  {product.farmer.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-bold">{product.farmer}</p>
                  <p className="text-xs text-muted-foreground">Verified farmer · {product.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
