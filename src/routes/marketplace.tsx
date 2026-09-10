import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Fresh Farm Produce | KISSAN2HOME" },
      {
        name: "description",
        content: "Browse vegetables, fruits, grains and greens listed directly by verified Indian farmers.",
      },
      { property: "og:title", content: "Marketplace — KISSAN2HOME" },
      { property: "og:description", content: "Fresh produce listed directly by verified farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { products, addToCart } = useApp();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [sort, setSort] = useState("popular");
  const [organicOnly, setOrganicOnly] = useState(false);

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!organicOnly || p.organic) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.farmer.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "low") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "high") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "popular") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [products, cat, query, sort, organicOnly]);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="card-surface gradient-soft overflow-hidden p-6 sm:p-8">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Today's fresh harvest</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Picked this morning, priced by the farmers themselves.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search produce, farmer or place…"
                className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent py-3 text-sm outline-none"
              >
                <option value="popular">Top rated</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  cat === c
                    ? "gradient-brand text-primary-foreground shadow-soft"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setOrganicOnly((v) => !v)}
              className={`ml-auto rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                organicOnly
                  ? "bg-leaf text-leaf-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              Organic only
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} products available</p>

        {list.length === 0 ? (
          <div className="card-surface mt-4 grid place-items-center p-14 text-center">
            <p className="font-semibold">No produce matches your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another crop, place or category.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => {
                  addToCart(p.id);
                  toast.success(`${p.name} added to basket`);
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
