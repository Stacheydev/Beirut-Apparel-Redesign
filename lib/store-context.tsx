"use client";

/**
 * Split store: three independent React contexts so that cart changes
 * don't re-render wishlist/UI consumers and vice-versa. This is the
 * key architecture fix for "components re-rendering when unrelated
 * state changes" (ProductCards were re-rendering on every cart/toast).
 *
 * Provides three hooks: useCart(), useWishlist(), useUI().
 * Each reads only its own slice — the other two slices are inert.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  cartReducer,
  emptyCart,
  loadCart,
  persistCart,
  type AddLineInput,
} from "@/lib/cart";
import type { Cart, Product, ProductImage as Img } from "@/types/catalog";

/* ------------------------------------------------------------------ */
/* Cart context                                                        */
/* ------------------------------------------------------------------ */

interface CartContextValue {
  cart: Cart;
  cartCount: number;
  addToCart: (product: Product, opts?: { size?: string; quantity?: number }) => void;
  addLine: (line: AddLineInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Wishlist context                                                    */
/* ------------------------------------------------------------------ */

interface WishlistContextValue {
  wishlist: string[];
  toggleWishlist: (handle: string) => void;
  isWishlisted: (handle: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* UI context (search, mobile menu, toast)                              */
/* ------------------------------------------------------------------ */

interface UIContextValue {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toast: Toast | null;
}

interface Toast {
  id: number;
  message: string;
}

const UIContext = createContext<UIContextValue | null>(null);

const WISHLIST_KEY = "ba-concept-wishlist-v1";

/* ------------------------------------------------------------------ */
/* Combined provider                                                   */
/* ------------------------------------------------------------------ */

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Cart state
  const [cart, dispatch] = useReducer(cartReducer, undefined, emptyCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  // UI state
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage once, client-side.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    dispatch({ type: "HYDRATE", cart: loadCart() });
    try {
      const raw = window.localStorage.getItem(WISHLIST_KEY);
      if (raw) setWishlist(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist cart on change.
  useEffect(() => {
    if (!hydrated.current) return;
    persistCart(cart);
  }, [cart]);

  // Persist wishlist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, message });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  /* -- Cart methods -- */

  const addLine = useCallback((line: AddLineInput) => {
    dispatch({ type: "ADD_LINE", line });
  }, []);

  const addToCart = useCallback(
    (product: Product, opts?: { size?: string; quantity?: number }) => {
      const variant = product.variants[0];
      dispatch({
        type: "ADD_LINE",
        line: {
          productId: product.id,
          productHandle: product.handle,
          variantId: variant?.id,
          title: product.title,
          size: opts?.size ?? variant?.size ?? undefined,
          image: product.images[0],
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          quantity: opts?.quantity ?? 1,
        },
      });
      showToast(`${product.title} added to cart`);
      setCartOpen(true);
    },
    [showToast],
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", lineId, quantity });
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    dispatch({ type: "REMOVE_LINE", lineId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  /* -- Wishlist methods -- */

  const toggleWishlist = useCallback((handle: string) => {
    setWishlist((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle],
    );
  }, []);

  const isWishlisted = useCallback(
    (handle: string) => wishlist.includes(handle),
    [wishlist],
  );

  /* -- Memoized values -- */

  const cartValue = useMemo<CartContextValue>(
    () => ({
      cart,
      cartCount: cart.totalQuantity,
      addToCart,
      addLine,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartOpen,
      setCartOpen,
    }),
    [cart, cartOpen, addToCart, addLine, updateQuantity, removeFromCart, clearCart],
  );

  const wishlistValue = useMemo<WishlistContextValue>(
    () => ({ wishlist, toggleWishlist, isWishlisted }),
    [wishlist, toggleWishlist, isWishlisted],
  );

  const uiValue = useMemo<UIContextValue>(
    () => ({ searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen, toast }),
    [searchOpen, mobileMenuOpen, toast],
  );

  return (
    <CartContext.Provider value={cartValue}>
      <WishlistContext.Provider value={wishlistValue}>
        <UIContext.Provider value={uiValue}>
          {children}
        </UIContext.Provider>
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useCartCount(): number {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartCount must be used within StoreProvider");
  return ctx.cartCount;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within StoreProvider");
  return ctx;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within StoreProvider");
  return ctx;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within StoreProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Convenience re-exports (backward compat stubs)                      */
/* ------------------------------------------------------------------ */

/** Convenience hook — prefer useCart/useWishlist/useUI for components
 *  that only need one slice (avoids cross-context re-renders). */
export function useStore() {
  const { cart, cartCount, addToCart, addLine, updateQuantity, removeFromCart, clearCart, cartOpen, setCartOpen } = useCart();
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen, toast } = useUI();
  return {
    cart,
    cartCount,
    addToCart,
    addLine,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    wishlist,
    toggleWishlist,
    isWishlisted,
    toast,
  };
}
