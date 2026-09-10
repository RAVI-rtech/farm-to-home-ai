import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useApp, type Role } from "@/lib/store";

export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { user, ready } = useApp();

  if (!ready) {
    return <div className="grid min-h-[50vh] place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!user || (role && user.role !== role)) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <div className="card-surface w-full p-8">
          <h2 className="text-xl font-bold">
            {user ? "Farmer account required" : "Please sign in"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {user
              ? "Switch to a farmer account to open the selling dashboard."
              : "Sign in as a farmer or a buyer to continue."}
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
