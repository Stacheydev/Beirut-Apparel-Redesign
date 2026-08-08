/**
 * Cart state — a small, Shopify-shaped reducer with localStorage persistence.
 * In production this would be the Shopify Cart API; here it's local so the
 * concept runs fully static with zero backend.
 */
import type { Cart, CartLine, Money } from "@/types/catalog";

const STORAGE_KEY = "ba-concept-cart-v1";

export interface AddLineInput {
  productId: string;
  productHandle: string;
  variantId?: string;
  title: string;
  size?: string;
  image?: CartLine["image"];
  price: Money;
  compareAtPrice?: Money | null;
  quantity: number;
}

export type CartAction =
  | { type: "HYDRATE"; cart: Cart }
  | { type: "ADD_LINE"; line: AddLineInput }
  | { type: "UPDATE_QUANTITY"; lineId: string; quantity: number }
  | { type: "REMOVE_LINE"; lineId: string }
  | { type: "CLEAR" };

export function emptyCart(): Cart {
  return { id: "cart", lines: [], subtotal: { amount: 0, currencyCode: "USD" }, totalQuantity: 0 };
}

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "HYDRATE":
      return action.cart;
    case "ADD_LINE": {
      const existing = state.lines.find(
        (l) => l.productHandle === action.line.productHandle && l.size === action.line.size,
      );
      let lines: CartLine[];
      if (existing) {
        lines = state.lines.map((l) =>
          l.id === existing.id
            ? { ...l, quantity: l.quantity + action.line.quantity }
            : l,
        );
      } else {
        lines = [
          ...state.lines,
          {
            id: `${action.line.productHandle}-${action.line.size ?? "default"}-${Date.now()}`,
            ...action.line,
          },
        ];
      }
      return recompute(state, lines);
    }
    case "UPDATE_QUANTITY": {
      const lines = state.lines
        .map((l) =>
          l.id === action.lineId
            ? { ...l, quantity: Math.max(0, action.quantity) }
            : l,
        )
        .filter((l) => l.quantity > 0);
      return recompute(state, lines);
    }
    case "REMOVE_LINE": {
      const lines = state.lines.filter((l) => l.id !== action.lineId);
      return recompute(state, lines);
    }
    case "CLEAR":
      return emptyCart();
    default:
      return state;
  }
}

function recompute(state: Cart, lines: CartLine[]): Cart {
  const totalQuantity = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = {
    amount: lines.reduce((n, l) => n + l.price.amount * l.quantity, 0),
    currencyCode: "USD" as const,
  };
  return { ...state, lines, totalQuantity, subtotal };
}

export function loadCart(): Cart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    const parsed = JSON.parse(raw) as Cart;
    return {
      ...emptyCart(),
      ...parsed,
      subtotal: parsed.subtotal ?? { amount: 0, currencyCode: "USD" },
    };
  } catch {
    return emptyCart();
  }
}

export function persistCart(cart: Cart): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable */
  }
}
