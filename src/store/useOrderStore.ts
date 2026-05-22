import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../utils/supabase";
import { Order } from "../types/store";
import { useCartStore } from "./useCartStore";
import { useAuthStore } from "./useAuthStore";
import { useUIStore } from "./useUIStore";
import { useProductStore } from "./useProductStore";

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  createOrder: (paymentMethod: 'UPI' | 'Card' | 'COD', paymentId?: string) => Order;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      fetchOrders: async () => {
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (!isConfigured) return;

        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Supabase Error fetching orders:", error.message);
            return;
          }

          if (data && data.length > 0) {
            const mappedOrders: Order[] = (data as any[]).map(o => ({
              id: o.id,
              items: o.items as any,
              subtotal: o.subtotal,
              gstAmount: o.gst_amount,
              shippingAmount: o.shipping_amount,
              discountAmount: o.discount_amount,
              totalAmount: o.total_amount,
              status: o.status,
              paymentStatus: o.payment_status,
              paymentMethod: o.payment_method,
              paymentId: o.payment_id,
              trackingNumber: o.tracking_number,
              shippingAddress: o.shipping_address as any,
              createdAt: o.created_at,
              logs: o.logs as any || []
            }));
            
            set({ orders: mappedOrders });
          }
        } catch (err) {
          console.error("Failed to fetch orders from Supabase", err);
        } finally {
          set({ isLoading: false });
        }
      },
      createOrder: (paymentMethod, paymentId) => {
        const cartState = useCartStore.getState();
        const authState = useAuthStore.getState();
        const uiState = useUIStore.getState();
        const productState = useProductStore.getState();

        const cart = cartState.cart;
        const subtotal = cart.reduce((sum, item) => {
          const base = item.variant.priceOverride || item.product.price;
          return sum + (base * item.qty);
        }, 0);

        let discountAmount = 0;
        const coupon = cartState.appliedCoupon;
        if (coupon) {
          if (coupon.type === 'percent') {
            discountAmount = Math.round(subtotal * coupon.value / 100);
          } else {
            discountAmount = coupon.value;
          }
        }

        const gstAmount = Math.round((subtotal - discountAmount) - ((subtotal - discountAmount) / 1.18));
        const shippingAmount = uiState.pinDetail ? uiState.pinDetail.shippingCost : 500;
        const totalAmount = (subtotal - discountAmount) + shippingAmount;

        const address = { ...authState.address };
        if (uiState.pinDetail) {
          address.city = uiState.pinDetail.city;
          address.state = uiState.pinDetail.state;
          address.pincode = uiState.pinDetail.pincode;
        }

        const newOrder: Order = {
          id: `MRQ-${Date.now().toString().slice(-6)}-IN`,
          items: [...cart],
          subtotal,
          gstAmount,
          shippingAmount,
          discountAmount,
          totalAmount,
          status: 'placed',
          paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
          paymentMethod,
          paymentId: paymentId || `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          trackingNumber: `SR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          shippingAddress: { ...address },
          createdAt: new Date().toLocaleString('en-IN'),
          logs: [
            { status: 'placed', timestamp: new Date().toLocaleTimeString(), message: 'Order placed successfully. Reservated stock in inventory.' }
          ]
        };

        // Deduct stock
        cart.forEach(item => {
          const currentStock = item.variant.stockQty;
          productState.updateProductStock(item.product.id, item.variant.id, currentStock - item.qty);
        });

        // Save order
        set(state => ({ orders: [newOrder, ...state.orders] }));
        
        // Clear cart
        cartState.clearCart();

        // Sync to Supabase
        (async () => {
          try {
            const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
            if (isConfigured) {
              await supabase.from("orders").insert([{
                id: newOrder.id,
                items: newOrder.items as any,
                subtotal: newOrder.subtotal,
                gst_amount: newOrder.gstAmount,
                shipping_amount: newOrder.shippingAmount,
                discount_amount: newOrder.discountAmount,
                total_amount: newOrder.totalAmount,
                status: newOrder.status,
                payment_status: newOrder.paymentStatus,
                payment_method: newOrder.paymentMethod,
                payment_id: newOrder.paymentId,
                tracking_number: newOrder.trackingNumber,
                shipping_address: newOrder.shippingAddress as any,
                logs: newOrder.logs as any
              }] as any);
            }

            // Trigger Email Receipt via Resend API
            if (authState.userEmail) {
              await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: newOrder.id,
                  email: authState.userEmail,
                  name: newOrder.shippingAddress.name,
                  totalAmount: newOrder.totalAmount,
                  items: newOrder.items
                })
              }).catch(e => console.error("Email API network error:", e));
            }
          } catch (err) {
            console.warn("☁️ Supabase Cloud Sync Info: Orders table is not initialized yet.", err);
          }
        })();

        return newOrder;
      },

      advanceOrderStatus: (orderId) => {
        const orderList = get().orders;
        const updated = orderList.map(order => {
          if (order.id === orderId) {
            let nextStatus: Order['status'] = 'placed';
            let message = "";
            let paymentStatus = order.paymentStatus;

            switch (order.status) {
              case 'placed':
                nextStatus = 'confirmed';
                message = "Order confirmed by MARQUE admin panel. Package allocation started.";
                break;
              case 'confirmed':
                nextStatus = 'dispatched';
                message = `Dispatched via MARQUE Logistics Desk AWB: ${order.trackingNumber}. Custom courier assigned.`;
                break;
              case 'dispatched':
                nextStatus = 'out-of-delivery';
                message = "Out for Delivery: Outbound for local Pin Code delivery hub.";
                break;
              case 'out-of-delivery':
                nextStatus = 'delivered';
                message = "Delivered! Order successfully received at address. GST Invoice emailed to customer.";
                if (order.paymentMethod === 'COD') {
                  paymentStatus = 'paid';
                }
                break;
              default:
                return order;
            }

            return {
              ...order,
              status: nextStatus,
              paymentStatus,
              logs: [
                ...order.logs,
                { status: nextStatus, timestamp: new Date().toLocaleTimeString(), message }
              ]
            };
          }
          return order;
        });

        set({ orders: updated });
      },

      cancelOrder: (orderId) => {
        const productState = useProductStore.getState();
        const orderList = get().orders;
        const updated = orderList.map(order => {
          if (order.id === orderId && order.status !== 'delivered' && order.status !== 'cancelled') {
            order.items.forEach(item => {
              const currentProd = productState.products.find(p => p.id === item.product.id);
              const currentVariant = currentProd?.variants.find(v => v.id === item.variant.id);
              if (currentVariant) {
                productState.updateProductStock(item.product.id, item.variant.id, currentVariant.stockQty + item.qty);
              }
            });

            return {
              ...order,
              status: 'cancelled' as const,
              paymentStatus: order.paymentStatus === 'paid' ? 'refunded' as const : order.paymentStatus,
              logs: [
                ...order.logs,
                { status: 'cancelled', timestamp: new Date().toLocaleTimeString(), message: 'Order has been cancelled by customer. Inventory stock returned.' }
              ]
            };
          }
          return order;
        });
        set({ orders: updated });
      }
    }),
    {
      name: "marque-order-storage",
      partialize: (state) => ({
        orders: state.orders
      })
    }
  )
);
