import tomato from "@/assets/p-tomato.jpg";
import rice from "@/assets/p-rice.jpg";
import mango from "@/assets/p-mango.jpg";
import spinach from "@/assets/p-spinach.jpg";

export type Category = "Vegetables" | "Fruits" | "Grains" | "Greens";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  stock: number;
  farmer: string;
  location: string;
  rating: number;
  organic: boolean;
  image: string;
  description: string;
};

export const productImages: Record<string, string> = {
  tomato,
  rice,
  mango,
  spinach,
};

export const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Farm Fresh Tomatoes",
    category: "Vegetables",
    price: 32,
    unit: "kg",
    stock: 240,
    farmer: "Ramesh Yadav",
    location: "Nashik, Maharashtra",
    rating: 4.8,
    organic: true,
    image: tomato,
    description:
      "Vine-ripened tomatoes harvested at sunrise and packed the same day. Naturally grown without chemical ripeners.",
  },
  {
    id: "p2",
    name: "Premium Basmati Rice",
    category: "Grains",
    price: 96,
    unit: "kg",
    stock: 1200,
    farmer: "Gurpreet Singh",
    location: "Karnal, Haryana",
    rating: 4.9,
    organic: false,
    image: rice,
    description:
      "Long-grain aged basmati from the Karnal belt. Aged 12 months for aroma and perfect grain separation.",
  },
  {
    id: "p3",
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 420,
    unit: "dozen",
    stock: 85,
    farmer: "Sunita Patil",
    location: "Ratnagiri, Maharashtra",
    rating: 5,
    organic: true,
    image: mango,
    description:
      "Authentic Ratnagiri Alphonso, naturally ripened in hay. Sweet, fibreless and picked at peak season.",
  },
  {
    id: "p4",
    name: "Organic Palak (Spinach)",
    category: "Greens",
    price: 28,
    unit: "bunch",
    stock: 160,
    farmer: "Lakshmi Devi",
    location: "Kolar, Karnataka",
    rating: 4.7,
    organic: true,
    image: spinach,
    description:
      "Tender spinach bunches grown in living soil, cut fresh every morning and delivered within 12 hours.",
  },
];

export const categories: Category[] = ["Vegetables", "Fruits", "Grains", "Greens"];

/** Simulated AI demand engine — deterministic, seasonality + trend based. */
export type DemandPoint = { month: string; actual: number | null; predicted: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function predictDemand(crop: string, region: string, horizon = 6) {
  const seed = [...(crop + region)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 60 + (seed % 40);
  const now = new Date().getMonth();
  const history: DemandPoint[] = [];
  for (let i = -5; i <= horizon; i++) {
    const m = (now + i + 12) % 12;
    const season = Math.sin(((m + (seed % 5)) / 12) * Math.PI * 2) * 18;
    const trend = i * 1.8;
    const noise = ((seed * (i + 7)) % 11) - 5;
    const predicted = Math.max(15, Math.round(base + season + trend + noise));
    history.push({
      month: MONTHS[m] as string,
      actual: i <= 0 ? Math.max(12, Math.round(predicted + (((seed + i) % 9) - 4))) : null,
      predicted,
    });
  }
  const future = history.filter((h) => h.actual === null);
  const past = history.filter((h) => h.actual !== null);
  const avgPast = past.reduce((a, h) => a + (h.actual ?? 0), 0) / Math.max(1, past.length);
  const avgFuture = future.reduce((a, h) => a + h.predicted, 0) / Math.max(1, future.length);
  const change = ((avgFuture - avgPast) / avgPast) * 100;
  const peak = [...future].sort((a, b) => b.predicted - a.predicted)[0];
  const confidence = 78 + (seed % 17);
  const suggestedPrice = Math.round((30 + (seed % 70)) * (1 + change / 200));

  return {
    series: history,
    change: Math.round(change * 10) / 10,
    peakMonth: peak?.month ?? "—",
    confidence,
    suggestedPrice,
    advice:
      change > 8
        ? `Demand for ${crop} in ${region} is trending up. Hold a portion of your harvest for ${peak?.month} and list in smaller lots to capture the higher price.`
        : change < -5
          ? `Demand for ${crop} in ${region} is softening. Sell early, bundle with fast-moving produce, and avoid long storage costs.`
          : `Demand for ${crop} in ${region} is stable. Keep steady weekly listings and focus on quality grading to earn a premium.`,
  };
}
