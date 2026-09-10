import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2, ShoppingBasket, Tractor } from "lucide-react";
import { toast } from "sonner";
import loginArt from "@/assets/login-illustration.jpg";
import { Logo } from "@/components/Logo";
import { useApp, type Role } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — KISSAN2HOME" },
      { name: "description", content: "Sign in to KISSAN2HOME as a farmer to sell produce or as a buyer to shop fresh." },
      { property: "og:title", content: "Sign in — KISSAN2HOME" },
      { property: "og:description", content: "Role-based sign in for farmers and buyers on KISSAN2HOME." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next["name"] = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Enter a valid email address";
    if (password.length < 6) next["password"] = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      login({
        name: name.trim(),
        email: email.trim(),
        role,
        location: role === "farmer" ? "Nashik, Maharashtra" : "Bengaluru, Karnataka",
      });
      setLoading(false);
      toast.success(`Welcome, ${name.trim().split(" ")[0]}!`);
      navigate({ to: role === "farmer" ? "/farmer" : "/marketplace" });
    }, 700);
  }

  return (
    <main className="grid min-h-[100svh] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src={loginArt}
          alt="Illustration of a farmer holding fresh vegetables with farm technology"
          loading="lazy"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo light />
          <div>
            <h2 className="max-w-sm font-display text-4xl font-extrabold leading-tight text-primary-foreground">
              Smart farming meets fair trade.
            </h2>
            <p className="mt-4 max-w-sm text-primary-foreground/80">
              List your harvest, reach thousands of buyers and let AI tell you when demand will peak.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 font-display text-3xl font-extrabold lg:mt-0">Welcome Back!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to KISSAN2HOME</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {(
              [
                { key: "buyer", label: "I'm a Buyer", icon: ShoppingBasket, hint: "Shop fresh produce" },
                { key: "farmer", label: "I'm a Farmer", icon: Tractor, hint: "Sell my harvest" },
              ] as const
            ).map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  role === r.key
                    ? "border-accent bg-secondary shadow-soft"
                    : "border-border bg-card hover:border-accent/50 hover:bg-muted"
                }`}
              >
                <r.icon className={`h-5 w-5 ${role === r.key ? "text-accent" : "text-muted-foreground"}`} />
                <p className="mt-2 text-sm font-bold">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">{r.hint}</p>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <Field label="Full name" error={errors["name"]}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Yadav"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/30"
              />
            </Field>
            <Field label="Email" error={errors["email"]}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/30"
              />
            </Field>
            <Field label="Password" error={errors["password"]}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/30"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in…" : `Continue as ${role}`}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo sign-in — any details work.{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
