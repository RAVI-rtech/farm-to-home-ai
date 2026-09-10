import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ShieldCheck, Sprout, TrendingUp } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KISSAN2HOME — Fresh Produce Directly From Farmers" },
      {
        name: "description",
        content:
          "KISSAN2HOME connects farmers directly with buyers. Shop fresh farm produce and help farmers predict demand with AI.",
      },
      { property: "og:title", content: "KISSAN2HOME — From Farm to Your Home" },
      {
        property: "og:description",
        content: "An AI-powered farm marketplace connecting farmers directly with buyers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const particles = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 96}%`,
  duration: `${16 + (i % 6) * 4}s`,
  delay: `${(i % 8) * 2}s`,
  size: 10 + (i % 4) * 6,
}));

function Splash() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <img
        src={heroImg}
        alt="Indian farmer in a white dhoti and red checked dhupatta standing in a green field at sunrise"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <Leaf
            key={i}
            className="animate-leaf absolute bottom-0 text-leaf/50"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 py-6 sm:px-8">
        <div className="animate-rise flex items-center justify-between">
          <Logo light />
          <Link
            to="/marketplace"
            className="rounded-full border border-primary-foreground/30 px-4 py-2 text-sm font-medium text-primary-foreground/90 backdrop-blur-sm transition-colors hover:bg-primary-foreground/10"
          >
            Browse market
          </Link>
        </div>

        <div className="flex flex-1 items-center py-14">
          <div className="max-w-2xl">
            <span
              className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm"
              style={{ animationDelay: "80ms" }}
            >
              <Sprout className="h-3.5 w-3.5" /> AI-powered farm marketplace
            </span>

            <h1
              className="animate-rise mt-6 font-display text-[2.75rem] font-extrabold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "160ms" }}
            >
              Fresh Produce
              <br />
              Directly From
              <br />
              <span className="text-leaf">Farmers to You</span>
            </h1>

            <p
              className="animate-rise mt-6 text-base text-primary-foreground/85 sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              Support Farmers • Get Fresh • Build a Better Tomorrow
            </p>

            <div
              className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-8 py-4 text-base font-semibold text-primary-foreground shadow-lift transition-transform hover:scale-[1.03] active:scale-95"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-8 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
              >
                Explore produce
              </Link>
            </div>
          </div>
        </div>

        <div
          className="animate-rise grid grid-cols-1 gap-3 pb-4 sm:grid-cols-3"
          style={{ animationDelay: "400ms" }}
        >
          {[
            { icon: Sprout, title: "12,400+ farmers", text: "Verified growers across India" },
            { icon: TrendingUp, title: "AI demand forecast", text: "Sell at the right time, right price" },
            { icon: ShieldCheck, title: "Zero middlemen", text: "Fair prices, fresher deliveries" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-md"
            >
              <f.icon className="h-5 w-5 text-leaf" />
              <p className="mt-2 font-display text-sm font-bold text-primary-foreground">{f.title}</p>
              <p className="text-xs text-primary-foreground/75">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
