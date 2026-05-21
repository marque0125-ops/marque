import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, PinCodeDetail, PIN_CODES } from "../data/mockData";

export interface UIState {
  currentView: 'home' | 'shop' | 'accessories' | 'pdp' | 'cart' | 'account' | 'admin' | 'terms' | 'shipping';
  setView: (view: 'home' | 'shop' | 'accessories' | 'pdp' | 'cart' | 'account' | 'admin' | 'terms' | 'shipping') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  pincode: string;
  pinDetail: PinCodeDetail | null;
  pinLoading: boolean;
  pinError: string | null;
  checkPincode: (pin: string) => void;
  clearPincode: () => void;

  lowStockAlerts: { message: string; date: string; productId: string }[];
  addLowStockAlert: (productId: string, message: string) => void;
  clearLowStockAlerts: () => void;

  announcementText: string;
  setAnnouncementText: (text: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      setView: (view) => set({ currentView: view }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product, currentView: product ? 'pdp' : 'shop' }),

      pincode: "",
      pinDetail: null,
      pinLoading: false,
      pinError: null,
      checkPincode: (pin) => {
        if (!/^\d{6}$/.test(pin)) {
          set({ pinError: "Invalid Pincode: Must be a 6-digit number", pinDetail: null, pincode: pin });
          return;
        }
        set({ pinLoading: true, pinError: null, pincode: pin });
        setTimeout(() => {
          const detail = PIN_CODES[pin];
          if (detail) {
            set({ pinDetail: detail, pinLoading: false, pinError: null });
          } else {
            set({ 
              pinError: "UNSERVICEABLE: Custom couriers do not deliver RC goods to this pin code.", 
              pinDetail: null, 
              pinLoading: false 
            });
          }
        }, 800);
      },
      clearPincode: () => set({ pincode: "", pinDetail: null, pinError: null }),

      lowStockAlerts: [],
      addLowStockAlert: (productId, message) => set(state => ({
        lowStockAlerts: [{ productId, message, date: new Date().toLocaleTimeString() }, ...state.lowStockAlerts]
      })),
      clearLowStockAlerts: () => set({ lowStockAlerts: [] }),

      announcementText: "⚡ EXTREME 8S BRUSHLESS ACTION • GST-INCLUSIVE PRICES • FREE SHIPPING ABOVE ₹10,000 ⚡",
      setAnnouncementText: (text) => set({ announcementText: text }),
    }),
    {
      name: "marque-ui-storage",
      partialize: (state) => ({
        lowStockAlerts: state.lowStockAlerts,
        announcementText: state.announcementText
      })
    }
  )
);
