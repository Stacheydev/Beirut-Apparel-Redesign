/**
 * Re-export shim: points to the split store-context for backward compatibility.
 * For new code, prefer importing specific hooks (useCart, useWishlist, useUI)
 * from @/lib/store-context so components only subscribe to their slice.
 */
export { StoreProvider, useStore, useCart, useWishlist, useUI } from "@/lib/store-context";
