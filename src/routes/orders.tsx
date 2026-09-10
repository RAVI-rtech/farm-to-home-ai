import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { inr, useApp } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — KISSAN2HOME" },
      { name: "description", content: "Track your farm-fresh orders and delivery status on KISSAN2HOME." },
      { property: "og:title", content: "My orders — KISSAN2HOME" },
      { property: "og:description", content: "Track your farm-fresh orders and delivery status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useApp();

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">My orders</h1>

        {orders.length === 0 ? (
          <div className="card-surface mt-6 grid place-items-center p-14 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No orders yet</p>
            <Link
              to="/marketplace"
              className="mt-6 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <article key={o.id} className="card-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-bold">{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {o.status}
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                  {o.items.map((i) => (
                    <li key={i.name} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {i.name} × {i.qty} {i.unit}
                      </span>
                      <span className="font-medium">{inr(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold">Total paid</span>
                  <span className="font-display text-lg font-extrabold">{inr(o.total)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
