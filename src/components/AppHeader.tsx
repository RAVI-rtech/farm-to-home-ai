import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Package, ShoppingBasket, Store } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/store";

const links = [
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/farmer", label: "Farmer", icon: LayoutDashboard },
];

export function AppHeader() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/marketplace" className="shrink-0">
            <Logo />
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  path.startsWith(l.to)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
            >
              <ShoppingBasket className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-tight">{user.name}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">{user.role}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-primary-foreground">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                  aria-label="Sign out"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile app-style bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4">
          {[...links, { to: "/cart", label: "Cart", icon: ShoppingBasket }].map((l) => {
            const active = path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <l.icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
