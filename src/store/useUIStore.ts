import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, PinCodeDetail, PIN_CODES } from "../data/mockData";

export interface BannerSlide {
  id: string;
  imageUrl: string;
  badgeText: string;
  titleMain: string;
  titleSub: string;
}

export interface UnboxingVideo {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface RacingVideo {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface DialogOptions {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface UIState {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  dialog: DialogOptions;
  showDialog: (options: Partial<DialogOptions>) => void;
  closeDialog: () => void;

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

  heroBanners: BannerSlide[];
  addHeroBanner: (banner: BannerSlide) => void;
  updateHeroBanner: (banner: BannerSlide) => void;
  removeHeroBanner: (id: string) => void;

  promoBanners: BannerSlide[];
  addPromoBanner: (banner: BannerSlide) => void;
  updatePromoBanner: (banner: BannerSlide) => void;
  removePromoBanner: (id: string) => void;

  unboxingVideos: UnboxingVideo[];
  addUnboxingVideo: (video: UnboxingVideo) => void;
  updateUnboxingVideo: (video: UnboxingVideo) => void;
  removeUnboxingVideo: (id: string) => void;

  racingVideos: RacingVideo[];
  addRacingVideo: (video: RacingVideo) => void;
  updateRacingVideo: (video: RacingVideo) => void;
  removeRacingVideo: (id: string) => void;
}

const safeStorage = {
  getItem: (name: string) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn("Storage quota exceeded! Attempting to recover...", e);
      try {
        localStorage.removeItem(name);
      } catch (err) {
        console.error("Recovery failed", err);
      }
    }
  },
  removeItem: (name: string) => {
    try { localStorage.removeItem(name); } catch {}
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),

      dialog: {
        isOpen: false,
        type: 'alert',
        title: '',
        message: ''
      },
      showDialog: (options) => set(state => ({
        dialog: { ...state.dialog, ...options, isOpen: true }
      })),
      closeDialog: () => set(state => ({
        dialog: { ...state.dialog, isOpen: false }
      })),

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

      heroBanners: [
        {
          id: "banner-1",
          imageUrl: "/banner234.png",
          badgeText: "Top Velocity Record",
          titleMain: "134+ KM/H",
          titleSub: "Arrma Infraction 6S BLX"
        },
        {
          id: "banner-2",
          imageUrl: "/banner34.png",
          badgeText: "Premium Parts",
          titleMain: "CUSTOM TUNING",
          titleSub: "Upgrade Your Arsenal"
        }
      ],
      addHeroBanner: (banner) => set((state) => ({ heroBanners: [...state.heroBanners, banner] })),
      updateHeroBanner: (banner) => set((state) => ({
        heroBanners: state.heroBanners.map((b) => b.id === banner.id ? banner : b)
      })),
      removeHeroBanner: (id) => set((state) => ({
        heroBanners: state.heroBanners.filter((b) => b.id !== id)
      })),

      promoBanners: [
        {
          id: "promo-1",
          imageUrl: "/banner12.png",
          badgeText: "",
          titleMain: "",
          titleSub: ""
        }
      ],
      addPromoBanner: (banner) => set((state) => ({ promoBanners: [...state.promoBanners, banner] })),
      updatePromoBanner: (banner) => set((state) => ({
        promoBanners: state.promoBanners.map((b) => b.id === banner.id ? banner : b)
      })),
      removePromoBanner: (id) => set((state) => ({
        promoBanners: state.promoBanners.filter((b) => b.id !== id)
      })),

      unboxingVideos: [],
      addUnboxingVideo: (video) => set((state) => ({ unboxingVideos: [...state.unboxingVideos, video] })),
      updateUnboxingVideo: (video) => set((state) => ({
        unboxingVideos: state.unboxingVideos.map((v) => v.id === video.id ? video : v)
      })),
      removeUnboxingVideo: (id) => set((state) => ({
        unboxingVideos: state.unboxingVideos.filter((v) => v.id !== id)
      })),

      racingVideos: [],
      addRacingVideo: (video) => set((state) => ({ racingVideos: [...state.racingVideos, video] })),
      updateRacingVideo: (video) => set((state) => ({
        racingVideos: state.racingVideos.map((v) => v.id === video.id ? video : v)
      })),
      removeRacingVideo: (id) => set((state) => ({
        racingVideos: state.racingVideos.filter((v) => v.id !== id)
      })),
    }),
    {
      name: "marque-ui-storage",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        lowStockAlerts: state.lowStockAlerts,
        announcementText: state.announcementText,
        heroBanners: state.heroBanners,
        promoBanners: state.promoBanners,
        unboxingVideos: state.unboxingVideos,
        racingVideos: state.racingVideos
      }),
      version: 1
    }
  )
);
