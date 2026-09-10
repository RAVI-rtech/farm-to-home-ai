import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedProducts, type Product } from "./data";

export type Role = "farmer" | "buyer";
export type User = { name: string; email: string; role: Role; location: string };
export type CartLine = { productId: string; qty: number };
export type Order = {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number; unit: string }[];
  total: number;
  status: "Packed" | "In transit" | "Delivered";
};

type State = {
  user: User | null;
  products: Product[];
  cart: CartLine[];
  orders: Order[];
};

type Ctx = State & {
  ready: boolean;
  login: (u: User) => void;
  logout: () => void;
  addProduct: (p: Omit<Product, "id">) => void;
  removeProduct: (id: string) => void;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  checkout: () => Order | null;
  cartCount: number;
  cartTotal: number;
};

const KEY = "kissan2home-state-v1";
const AppCtx = createContext<Ctx | null>(null);

const initial: State = { user: null, products: seedProducts, cart: [], orders: [] };

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        setState({ ...initial, ...parsed, products: parsed.products?.length ? parsed.products : seedProducts });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const login = useCallback((user: User) => setState((s) => ({ ...s, user })), []);
  const logout = useCallback(() => setState((s) => ({ ...s, user: null, cart: [] })), []);

  const addProduct = useCallback(
    (p: Omit<Product, "id">) =>
      setState((s) => ({ ...s, products: [{ ...p, id: `p${Date.now()}` }, ...s.products] })),
    [],
  );

  const removeProduct = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        products: s.products.filter((p) => p.id !== id),
        cart: s.cart.filter((c) => c.productId !== id),
      })),
    [],
  );

  const addToCart = useCallback(
    (id: string, qty = 1) =>
      setState((s) => {
        const found = s.cart.find((c) => c.productId === id);
        return {
          ...s,
          cart: found
            ? s.cart.map((c) => (c.productId === id ? { ...c, qty: c.qty + qty } : c))
            : [...s.cart, { productId: id, qty }],
        };
      }),
    [],
  );

  const setQty = useCallback(
    (id: string, qty: number) =>
      setState((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((c) => c.productId !== id) : s.cart.map((c) => (c.productId === id ? { ...c, qty } : c)),
      })),
    [],
  );

  const cartTotal = useMemo(
    () =>
      state.cart.reduce((sum, line) => {
        const p = state.products.find((x) => x.id === line.productId);
        return sum + (p ? p.price * line.qty : 0);
      }, 0),
    [state.cart, state.products],
  );

  const cartCount = useMemo(() => state.cart.reduce((a, c) => a + c.qty, 0), [state.cart]);

  const checkout = useCallback((): Order | null => {
    let created: Order | null = null;
    setState((s) => {
      if (!s.cart.length) return s;
      const items = s.cart.map((line) => {
        const p = s.products.find((x) => x.id === line.productId)!;
        return { name: p.name, qty: line.qty, price: p.price, unit: p.unit };
      });
      const total = items.reduce((a, i) => a + i.price * i.qty, 0);
      created = {
        id: `K2H-${Math.floor(100000 + Math.random() * 899999)}`,
        date: new Date().toISOString(),
        items,
        total,
        status: "Packed",
      };
      return { ...s, cart: [], orders: [created, ...s.orders] };
    });
    return created;
  }, []);

  const value: Ctx = {
    ...state,
    ready,
    login,
    logout,
    addProduct,
    removeProduct,
    addToCart,
    setQty,
    checkout,
    cartCount,
    cartTotal,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
