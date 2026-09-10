import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  IndianRupee,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { categories, predictDemand, productImages, type Category } from "@/lib/data";
import { inr, useApp } from "@/lib/store";

export const Route = createFileRoute("/farmer")({
  head: () => ({
    meta: [
      { title: "Farmer dashboard — KISSAN2HOME" },
      {
        name: "description",
        content: "List your harvest, track sales and use AI demand forecasting to sell at the right time.",
      },
      { property: "og:title", content: "Farmer dashboard — KISSAN2HOME" },
      { property: "og:description", content: "List produce and forecast demand with AI on KISSAN2HOME." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireAuth role="farmer">
      <FarmerDashboard />
    </RequireAuth>
  ),
});

function FarmerDashboard() {
  const { user, products, orders, addProduct, removeProduct } = useApp();
  const [tab, setTab] = useState<"overview" | "listings" | "ai">("overview");

  const myProducts = products;
  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const stats = [
    { label: "Active listings", value: String(myProducts.length), icon: Package },
    { label: "Orders received", value: String(orders.length), icon: BarChart3 },
    { label: "Revenue", value: inr(revenue), icon: IndianRupee },
    {
      label: "Avg. rating",
      value: (myProducts.reduce((a, p) => a + p.rating, 0) / Math.max(1, myProducts.length)).toFixed(1),
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Namaste, {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user?.location} · Farmer account</p>
          </div>
          <div className="flex rounded-full border border-border bg-card p-1">
            {(
              [
                ["overview", "Overview"],
                ["listings", "My listings"],
                ["ai", "AI demand"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  tab === key ? "gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-5 hover:-translate-y-0.5 hover:shadow-lift">
              <s.icon className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {tab === "overview" && <Overview />}
        {tab === "listings" && (
          <Listings onAdd={addProduct} onRemove={removeProduct} products={myProducts} farmerName={user?.name ?? ""} location={user?.location ?? ""} />
        )}
        {tab === "ai" && <AIDemand />}
      </main>
    </div>
  );
}

function Overview() {
  const { orders, products } = useApp();
  const recent = orders.slice(0, 4);

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="card-surface p-5">
        <h2 className="font-display text-lg font-bold">Recent orders</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet. Buyers' orders will appear here as soon as they check out.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                <div>
                  <p className="text-sm font-bold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.items.length} item(s) · {o.status}</p>
                </div>
                <span className="font-display font-extrabold">{inr(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-surface p-5">
        <h2 className="font-display text-lg font-bold">Stock levels</h2>
        <ul className="mt-4 space-y-4">
          {products.slice(0, 5).map((p) => {
            const pct = Math.min(100, Math.round((p.stock / 1200) * 100) + 8);
            return (
              <li key={p.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">
                    {p.stock} {p.unit}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-brand" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

type NewProduct = {
  name: string;
  category: Category;
  price: string;
  unit: string;
  stock: string;
  organic: boolean;
  image: string;
  description: string;
};

const empty: NewProduct = {
  name: "",
  category: "Vegetables",
  price: "",
  unit: "kg",
  stock: "",
  organic: false,
  image: "tomato",
  description: "",
};

function Listings({
  products,
  onAdd,
  onRemove,
  farmerName,
  location,
}: {
  products: ReturnType<typeof useApp>["products"];
  onAdd: ReturnType<typeof useApp>["addProduct"];
  onRemove: (id: string) => void;
  farmerName: string;
  location: string;
}) {
  const [form, setForm] = useState<NewProduct>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next["name"] = "Enter a product name";
    if (!Number(form.price)) next["price"] = "Enter a valid price";
    if (!Number(form.stock)) next["stock"] = "Enter available quantity";
    setErrors(next);
    if (Object.keys(next).length) return;

    onAdd({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      stock: Number(form.stock),
      farmer: farmerName || "You",
      location: location || "India",
      rating: 4.5,
      organic: form.organic,
      image: productImages[form.image] ?? productImages["tomato"]!,
      description: form.description.trim() || "Freshly harvested and listed directly by the farmer.",
    });
    setForm(empty);
    toast.success("Listing published to the marketplace");
  }

  const field =
    "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-ring/30";

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="card-surface h-fit space-y-3 p-5" noValidate>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Plus className="h-4 w-4 text-accent" /> Add a new listing
        </h2>

        <input
          className={field}
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}

        <div className="grid grid-cols-2 gap-3">
          <select
            className={field}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className={field} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            {["kg", "quintal", "dozen", "bunch"].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              className={field}
              placeholder="Price ₹"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors["price"] && <p className="mt-1 text-xs text-destructive">{errors["price"]}</p>}
          </div>
          <div>
            <input
              className={field}
              placeholder="Quantity"
              inputMode="numeric"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            {errors["stock"] && <p className="mt-1 text-xs text-destructive">{errors["stock"]}</p>}
          </div>
        </div>

        <select className={field} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}>
          <option value="tomato">Photo: vegetables</option>
          <option value="rice">Photo: grains</option>
          <option value="mango">Photo: fruits</option>
          <option value="spinach">Photo: greens</option>
        </select>

        <textarea
          className={`${field} min-h-24 resize-none`}
          placeholder="Describe your produce…"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.organic}
            onChange={(e) => setForm({ ...form, organic: e.target.checked })}
            className="h-4 w-4 accent-[oklch(0.62_0.16_152)]"
          />
          Grown organically
        </label>

        <button
          type="submit"
          className="w-full rounded-xl gradient-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-95"
        >
          Publish listing
        </button>
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="card-surface flex items-center gap-4 p-3">
            <img src={p.image} alt={p.name} loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.category} · {p.stock} {p.unit} in stock
              </p>
            </div>
            <span className="font-display font-extrabold">
              {inr(p.price)}
              <span className="text-xs font-medium text-muted-foreground">/{p.unit}</span>
            </span>
            <button
              onClick={() => {
                onRemove(p.id);
                toast("Listing removed");
              }}
              aria-label="Remove listing"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIDemand() {
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Nashik");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof predictDemand> | null>(null);

  const max = useMemo(
    () => Math.max(...(result?.series.map((s) => Math.max(s.predicted, s.actual ?? 0)) ?? [1])),
    [result],
  );

  function run(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setTimeout(() => {
      setResult(predictDemand(crop, region));
      setRunning(false);
      toast.success("Forecast ready");
    }, 900);
  }

  const field =
    "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-ring/30";

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[340px_1fr]">
      <form onSubmit={run} className="card-surface h-fit space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Brain className="h-4 w-4 text-accent" /> AI demand predictor
        </h2>
        <p className="text-xs text-muted-foreground">
          Estimates the next 6 months of buyer demand from seasonality, past sales and regional trends.
        </p>
        <select className={field} value={crop} onChange={(e) => setCrop(e.target.value)}>
          {["Tomato", "Onion", "Basmati Rice", "Mango", "Spinach", "Wheat", "Banana"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={field} value={region} onChange={(e) => setRegion(e.target.value)}>
          {["Nashik", "Karnal", "Ratnagiri", "Kolar", "Guntur", "Indore"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={running}
          className="flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-70"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {running ? "Analysing…" : "Run forecast"}
        </button>
      </form>

      {!result ? (
        <div className="card-surface grid place-items-center p-14 text-center">
          <Brain className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">No forecast yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Pick a crop and a region, then run the forecast to see predicted demand, the best month to sell and a
            suggested price.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi
              label="Demand trend"
              value={`${result.change > 0 ? "+" : ""}${result.change}%`}
              icon={result.change >= 0 ? TrendingUp : TrendingDown}
            />
            <Kpi label="Peak month" value={result.peakMonth} icon={BarChart3} />
            <Kpi label="Confidence" value={`${result.confidence}%`} icon={Sparkles} />
            <Kpi label="Suggested price" value={inr(result.suggestedPrice)} icon={IndianRupee} />
          </div>

          <div className="card-surface p-5">
            <h3 className="font-display text-lg font-bold">
              {crop} demand · {region}
            </h3>
            <p className="text-xs text-muted-foreground">Solid = actual sales · Light = AI prediction</p>
            <div className="mt-6 flex h-52 items-end gap-1.5 sm:gap-3">
              {result.series.map((pt, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end justify-center gap-0.5">
                    <div
                      className={`w-full max-w-4 rounded-t-md transition-all duration-500 ${
                        pt.actual !== null ? "bg-primary" : "bg-leaf/50"
                      }`}
                      style={{ height: `${((pt.actual ?? pt.predicted) / max) * 100}%` }}
                      title={`${pt.month}: ${pt.actual ?? pt.predicted} tonnes`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{pt.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface gradient-soft p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold">
              <Sparkles className="h-4 w-4 text-accent" /> AI recommendation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Brain }) {
  return (
    <div className="card-surface p-4">
      <Icon className="h-4 w-4 text-accent" />
      <p className="mt-2 font-display text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
