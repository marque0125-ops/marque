import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "../data/mockData";
import { CartItem, Coupon } from "../types/store";

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: "MARQUE10", type: "percent", value: 10, minOrder: 15000, description: "10% OFF on premium RC cars above ₹15,000" },
  { code: "MAXBASH", type: "flat", value: 5000, minOrder: 50000, description: "Flat ₹5,000 OFF on extreme performance rigs above ₹50,000" },
  { code: "FREESHIP", type: "flat", value: 500, minOrder: 10000, description: "Flat ₹500 discount simulating free standard shipping above ₹10,000" }
];

interface CartState {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, variant: ProductVariant, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      appliedCoupon: null,
      addToCart: (product, variant, qty) => {
        const cartItemId = `${product.id}-${variant.id}`;
        const currentCart = get().cart;
        const existing = currentCart.find(item => item.id === cartItemId);

        if (existing) {
          const updatedQty = existing.qty + qty;
          if (updatedQty > variant.stockQty) return;
          set({
            cart: currentCart.map(item => 
              item.id === cartItemId ? { ...item, qty: updatedQty } : item
            )
          });
        } else {
          if (qty > variant.stockQty) return;
          set({
            cart: [...currentCart, { id: cartItemId, product, variant, qty }]
          });
        }
      },
      removeFromCart: (cartItemId) => {
        set(state => ({ cart: state.cart.filter(item => item.id !== cartItemId) }));
      },
      updateCartQty: (cartItemId, qty) => {
        set(state => ({
          cart: state.cart.map(item => {
            if (item.id === cartItemId) {
              const maxStock = item.variant.stockQty;
              const clamped = Math.max(1, Math.min(qty, maxStock));
              return { ...item, qty: clamped };
            }
            return item;
          })
        }));
      },
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      applyCoupon: (code) => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => {
          const base = item.variant.priceOverride || item.product.price;
          return sum + (base * item.qty);
        }, 0);

        const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
        if (!found) {
          return { success: false, message: "INVALID_COUPON: The code entered does not exist." };
        }

        if (subtotal < found.minOrder) {
          return { 
            success: false, 
            message: `MINIMUM_ORDER_NOT_MET: This coupon requires a minimum purchase of ₹${found.minOrder.toLocaleString('en-IN')}.` 
          };
        }

        set({ appliedCoupon: found });
        return { success: true, message: `COUPON_APPLIED: Saved ₹${found.type === 'percent' ? (subtotal * found.value / 100).toLocaleString('en-IN') : found.value.toLocaleString('en-IN')}!` };
      },
      removeCoupon: () => set({ appliedCoupon: null })
    }),
    {
      name: "marque-cart-storage",
      partialize: (state) => ({
        cart: state.cart
      })
    }
  )
);
