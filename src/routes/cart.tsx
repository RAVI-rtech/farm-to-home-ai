import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { inr, useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your basket — KISSAN2HOME" },
      { name: "description", content: "Review your farm-fresh basket and place your order on KISSAN2HOME." },
      { property: "og:title", content: "Your basket — KISSAN2HOME" },
      { property: "og:description", content: "Review your farm-fresh basket and checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, products, setQty, cartTotal, checkout, user } = useApp();
  const navigate = useNavigate();
  const delivery = cartTotal > 0 && cartTotal < 500 ? 40 : 0;

  const lines = cart
    .map((c) => ({ line: c, product: products.find((p) => p.id === c.productId) }))
    .filter((x) => x.product);

  function placeOrder() {
    if (!user) {
      toast.error("Please sign in to place your order");
      navigate({ to: "/login" });
      return;
    }
    const order = checkout();
    if (order) {
      toast.success(`Order ${order.id} placed!`);
      navigate({ to: "/orders" });
    }
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Your basket</h1>

        {lines.length === 0 ? (
          <div className="card-surface mt-6 grid place-items-center p-14 text-center">
            <ShoppingBasket className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">Your basket is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add some fresh produce to get started.</p>
            <Link
              to="/marketplace"
              className="mt-6 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Browse the market
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {lines.map(({ line, product }) => (
                <div key={line.productId} className="card-surface flex items-center gap-4 p-3 sm:p-4">
                  <img
                    src={product!.image}
                    alt={product!.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{product!.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {inr(product!.price)}/{product!.unit} · {product!.farmer}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1">
                        <button onClick={() => setQty(line.productId, line.qty - 1)} aria-label="Decrease">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
                        <button onClick={() => setQty(line.productId, line.qty + 1)} aria-label="Increase">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => setQty(line.productId, 0)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-display font-extrabold">{inr(product!.price * line.qty)}</p>
                </div>
              ))}
            </div>

            <aside className="card-surface h-fit p-5 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={inr(cartTotal)} />
                <Row label="Delivery" value={delivery ? inr(delivery) : "Free"} />
                <div className="border-t border-border pt-3">
                  <Row label="Total" value={inr(cartTotal + delivery)} bold />
                </div>
              </dl>
              <button
                onClick={placeOrder}
                className="mt-5 w-full rounded-xl gradient-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-95"
              >
                Place order
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Free delivery on orders above ₹500
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-bold" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "font-display text-lg font-extrabold" : "font-medium"}>{value}</dd>
    </div>
  );
}
