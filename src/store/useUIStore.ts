import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "../utils/safeStorage";
import { Product, PinCodeDetail, PIN_CODES } from "../data/mockData";
import { loadAllSiteConfig, saveSiteConfig } from "../utils/siteConfig";

export interface BannerSlide {
  id: string;
  imageUrl: string;
  badgeText: string;
  titleMain: string;
  titleSub: string;
  productId?: string;
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface BrandLogo {
  id: string;
  name: string;
  logo: string;
  country: string;
  flag: string;
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

// ---- Default values ----
const DEFAULT_BRANDS: BrandLogo[] = [
  { id: "b1", name: "TRAXXAS", logo: "/logo_traxxas.png", country: "USA", flag: "🇺🇸" },
  { id: "b2", name: "ARRMA", logo: "/logo_arrma.png", country: "UK", flag: "🇬🇧" },
  { id: "b3", name: "RLAARLO", logo: "/logo_rlaarlo.png", country: "Hong Kong", flag: "🇭🇰" },
  { id: "b4", name: "MJX", logo: "/logo_mjx.png", country: "China", flag: "🇨🇳" },
  { id: "b5", name: "FMS", logo: "/logo_fms.png", country: "China", flag: "🇨🇳" },
  { id: "b6", name: "MN MODEL", logo: "/logo_mnmodel.png", country: "China", flag: "🇨🇳" },
  { id: "b7", name: "HOT WHEELS", logo: "/logo_hotwheels.png", country: "USA", flag: "🇺🇸" },
];

const DEFAULT_HERO_BANNERS: BannerSlide[] = [
  {
    id: "banner-1",
    imageUrl: "/banner234.png",
    badgeText: "Top Velocity Record",
    titleMain: "134+ KM/H",
    titleSub: "Arrma Infraction 6S BLX",
  },
  {
    id: "banner-2",
    imageUrl: "/banner34.png",
    badgeText: "Premium Parts",
    titleMain: "CUSTOM TUNING",
    titleSub: "Upgrade Your Arsenal",
  },
];

const DEFAULT_PROMO_BANNERS: BannerSlide[] = [
  {
    id: "promo-1",
    imageUrl: "/banner12.png",
    badgeText: "",
    titleMain: "",
    titleSub: "",
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Vikram Malhotra",
    role: "Verified Traxxas X-Maxx Owner • Chennai",
    quote:
      "Purchased the Solar Flare Orange X-Maxx and it has been absolute insanity. Handled rocky terrains in Lonavala and water streams effortlessly. Unbelievable construction and raw power! Delivery to Madipakkam was incredibly fast.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Rohan Desai",
    role: "Track Racer • Mumbai",
    quote:
      "The ARRMA Typhon 6S BLX completely blew me away. Speed runs are stable, and cornering is sharp as a tack. Customer service was stellar answering all my lipo battery queries before purchase.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
];

export interface UIState {
  lastFetchedAt: number;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  isLoadingConfig: boolean;
  loadAllSiteConfig: () => Promise<void>;

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

  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  updateHeroText: (line1: string, line2: string, desc: string) => void;

  brandsBadge: string;
  brandsTitle: string;
  brandsSubtitle: string;
  updateBrandsText: (badge: string, title: string, subtitle: string) => void;
  brandsList: BrandLogo[];
  addBrand: (brand: BrandLogo) => void;
  updateBrand: (brand: BrandLogo) => void;
  removeBrand: (id: string) => void;

  aboutBadge: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutBullets: string[];
  aboutImage: string;
  aboutImageOverlayTitle: string;
  aboutImageOverlaySubtitle: string;
  updateAboutText: (
    badge: string,
    t1: string,
    t2: string,
    sub: string,
    desc: string,
    bullets: string[],
    image: string,
    overT: string,
    overS: string
  ) => void;

  testimonialsBadge: string;
  testimonialsTitle: string;
  updateTestimonialsText: (badge: string, title: string) => void;
  testimonialsList: Testimonial[];
  addTestimonial: (test: Testimonial) => void;
  updateTestimonial: (test: Testimonial) => void;
  removeTestimonial: (id: string) => void;

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

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      lastFetchedAt: 0,
      selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  isLoadingConfig: false,

  /** 
   * Called once on app mount. Loads all site config from Supabase.
   * Falls back to built-in defaults if Supabase is not configured or returns empty.
   */
  loadAllSiteConfig: async () => {
    const state = get();
    if (state.lastFetchedAt && Date.now() - state.lastFetchedAt < 3600000) {
      return;
    }
    set({ isLoadingConfig: true });
    try {
      const config = await loadAllSiteConfig();

      set({
        heroBanners: (config.hero_banners as BannerSlide[]) ?? DEFAULT_HERO_BANNERS,
        promoBanners: (config.promo_banners as BannerSlide[]) ?? DEFAULT_PROMO_BANNERS,
        brandsList: (config.brands_list as BrandLogo[]) ?? DEFAULT_BRANDS,
        testimonialsList: (config.testimonials_list as Testimonial[]) ?? DEFAULT_TESTIMONIALS,
        unboxingVideos: (config.unboxing_videos as UnboxingVideo[]) ?? [],
        racingVideos: (config.racing_videos as RacingVideo[]) ?? [],
        // Text fields — only override if present in DB
        ...(config.announcement_text !== undefined && { announcementText: config.announcement_text as string }),
        ...(config.hero_text !== undefined && {
          heroTitleLine1: (config.hero_text as any).line1,
          heroTitleLine2: (config.hero_text as any).line2,
          heroDescription: (config.hero_text as any).desc,
        }),
        ...(config.brands_text !== undefined && {
          brandsBadge: (config.brands_text as any).badge,
          brandsTitle: (config.brands_text as any).title,
          brandsSubtitle: (config.brands_text as any).subtitle,
        }),
        ...(config.about_section !== undefined && {
          aboutBadge: (config.about_section as any).badge,
          aboutTitleLine1: (config.about_section as any).t1,
          aboutTitleLine2: (config.about_section as any).t2,
          aboutSubtitle: (config.about_section as any).sub,
          aboutDescription: (config.about_section as any).desc,
          aboutBullets: (config.about_section as any).bullets,
          aboutImage: (config.about_section as any).image,
          aboutImageOverlayTitle: (config.about_section as any).overT,
          aboutImageOverlaySubtitle: (config.about_section as any).overS,
        }),
        ...(config.testimonials_text !== undefined && {
          testimonialsBadge: (config.testimonials_text as any).badge,
          testimonialsTitle: (config.testimonials_text as any).title,
        }),
      });
    } catch (e) {
      console.warn("[UIStore] Failed to load site config from Supabase:", e);
    } finally {
      set({ isLoadingConfig: false, lastFetchedAt: Date.now() });
    }
  },

  dialog: { isOpen: false, type: "alert", title: "", message: "" },
  showDialog: (options) =>
    set((state) => ({ dialog: { ...state.dialog, ...options, isOpen: true } })),
  closeDialog: () =>
    set((state) => ({ dialog: { ...state.dialog, isOpen: false } })),

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
          pinLoading: false,
        });
      }
    }, 800);
  },
  clearPincode: () => set({ pincode: "", pinDetail: null, pinError: null }),

  lowStockAlerts: [],
  addLowStockAlert: (productId, message) =>
    set((state) => ({
      lowStockAlerts: [
        { productId, message, date: new Date().toLocaleTimeString() },
        ...state.lowStockAlerts,
      ],
    })),
  clearLowStockAlerts: () => set({ lowStockAlerts: [] }),

  announcementText:
    "⚡ EXTREME 8S BRUSHLESS ACTION • GST-INCLUSIVE PRICES • FREE SHIPPING ABOVE ₹10,000 ⚡",
  setAnnouncementText: (text) => {
    set({ announcementText: text });
    saveSiteConfig("announcement_text", text);
  },

  heroTitleLine1: "ULTIMATE DESTINATION FOR",
  heroTitleLine2: "EXTREME RC CARS",
  heroDescription:
    "Experience 130+ km/h runs, fully waterproof brushless motors, and high-performance accessories/spares. MARQUE brings the world's most extreme RC cars and accessories to Indian bashers and track racers.",
  updateHeroText: (line1, line2, desc) => {
    set({ heroTitleLine1: line1, heroTitleLine2: line2, heroDescription: desc });
    saveSiteConfig("hero_text", { line1, line2, desc });
  },

  brandsBadge: "Elite Racing Makes",
  brandsTitle: "Championship Lineup",
  brandsSubtitle: "Click any manufacturer badge to immediately filter the garage catalog.",
  updateBrandsText: (badge, title, subtitle) => {
    set({ brandsBadge: badge, brandsTitle: title, brandsSubtitle: subtitle });
    saveSiteConfig("brands_text", { badge, title, subtitle });
  },
  brandsList: DEFAULT_BRANDS,
  addBrand: (brand) => {
    set((state) => {
      const next = [...state.brandsList, brand];
      saveSiteConfig("brands_list", next);
      return { brandsList: next };
    });
  },
  updateBrand: (brand) => {
    set((state) => {
      const next = state.brandsList.map((b) => (b.id === brand.id ? brand : b));
      saveSiteConfig("brands_list", next);
      return { brandsList: next };
    });
  },
  removeBrand: (id) => {
    set((state) => {
      const next = state.brandsList.filter((b) => b.id !== id);
      saveSiteConfig("brands_list", next);
      return { brandsList: next };
    });
  },

  aboutBadge: "Welcome to MARQUE",
  aboutTitleLine1: "Sleek Rigs,",
  aboutTitleLine2: "Smart Prices.",
  aboutSubtitle: "Your ideal car is a click away.",
  aboutDescription:
    "MARQUE is India's dedicated hub for authentic, hobby-grade remote control scale engineering and premium accessories. We source directly from elite international manufacturers, providing bash-tested rigs, performance upgrades, and spare parts.",
  aboutBullets: [
    "100% Genuine models with sealed manufacturer pack guarantees.",
    "18% Inclusive GST billing with business HSN inputs.",
    "Dedicated Madipakkam technical support for repairs.",
  ],
  aboutImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
  aboutImageOverlayTitle: "Premium Quality",
  aboutImageOverlaySubtitle: "Guaranteed Performance",
  updateAboutText: (badge, t1, t2, sub, desc, bullets, image, overT, overS) => {
    set({
      aboutBadge: badge,
      aboutTitleLine1: t1,
      aboutTitleLine2: t2,
      aboutSubtitle: sub,
      aboutDescription: desc,
      aboutBullets: bullets,
      aboutImage: image,
      aboutImageOverlayTitle: overT,
      aboutImageOverlaySubtitle: overS,
    });
    saveSiteConfig("about_section", { badge, t1, t2, sub, desc, bullets, image, overT, overS });
  },

  testimonialsBadge: "Pilot Reviews",
  testimonialsTitle: "What Our Customers Say",
  updateTestimonialsText: (badge, title) => {
    set({ testimonialsBadge: badge, testimonialsTitle: title });
    saveSiteConfig("testimonials_text", { badge, title });
  },
  testimonialsList: DEFAULT_TESTIMONIALS,
  addTestimonial: (test) => {
    set((state) => {
      const next = [...state.testimonialsList, test];
      saveSiteConfig("testimonials_list", next);
      return { testimonialsList: next };
    });
  },
  updateTestimonial: (test) => {
    set((state) => {
      const next = state.testimonialsList.map((t) => (t.id === test.id ? test : t));
      saveSiteConfig("testimonials_list", next);
      return { testimonialsList: next };
    });
  },
  removeTestimonial: (id) => {
    set((state) => {
      const next = state.testimonialsList.filter((t) => t.id !== id);
      saveSiteConfig("testimonials_list", next);
      return { testimonialsList: next };
    });
  },

  heroBanners: DEFAULT_HERO_BANNERS,
  addHeroBanner: (banner) => {
    set((state) => {
      const next = [...state.heroBanners, banner];
      saveSiteConfig("hero_banners", next);
      return { heroBanners: next };
    });
  },
  updateHeroBanner: (banner) => {
    set((state) => {
      const next = state.heroBanners.map((b) => (b.id === banner.id ? banner : b));
      saveSiteConfig("hero_banners", next);
      return { heroBanners: next };
    });
  },
  removeHeroBanner: (id) => {
    set((state) => {
      const next = state.heroBanners.filter((b) => b.id !== id);
      saveSiteConfig("hero_banners", next);
      return { heroBanners: next };
    });
  },

  promoBanners: DEFAULT_PROMO_BANNERS,
  addPromoBanner: (banner) => {
    set((state) => {
      const next = [...state.promoBanners, banner];
      saveSiteConfig("promo_banners", next);
      return { promoBanners: next };
    });
  },
  updatePromoBanner: (banner) => {
    set((state) => {
      const next = state.promoBanners.map((b) => (b.id === banner.id ? banner : b));
      saveSiteConfig("promo_banners", next);
      return { promoBanners: next };
    });
  },
  removePromoBanner: (id) => {
    set((state) => {
      const next = state.promoBanners.filter((b) => b.id !== id);
      saveSiteConfig("promo_banners", next);
      return { promoBanners: next };
    });
  },

  unboxingVideos: [],
  addUnboxingVideo: (video) => {
    set((state) => {
      const next = [...state.unboxingVideos, video];
      saveSiteConfig("unboxing_videos", next);
      return { unboxingVideos: next };
    });
  },
  updateUnboxingVideo: (video) => {
    set((state) => {
      const next = state.unboxingVideos.map((v) => (v.id === video.id ? video : v));
      saveSiteConfig("unboxing_videos", next);
      return { unboxingVideos: next };
    });
  },
  removeUnboxingVideo: (id) => {
    set((state) => {
      const next = state.unboxingVideos.filter((v) => v.id !== id);
      saveSiteConfig("unboxing_videos", next);
      return { unboxingVideos: next };
    });
  },

  racingVideos: [],
  addRacingVideo: (video) => {
    set((state) => {
      const next = [...state.racingVideos, video];
      saveSiteConfig("racing_videos", next);
      return { racingVideos: next };
    });
  },
  updateRacingVideo: (video) => {
    set((state) => {
      const next = state.racingVideos.map((v) => (v.id === video.id ? video : v));
      saveSiteConfig("racing_videos", next);
      return { racingVideos: next };
    });
  },
  removeRacingVideo: (id) => {
    set((state) => {
      const next = state.racingVideos.filter((v) => v.id !== id);
      saveSiteConfig("racing_videos", next);
      return { racingVideos: next };
    });
  },
    }),
    {
      name: "marque-ui-storage",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        lastFetchedAt: state.lastFetchedAt,
        heroBanners: state.heroBanners,
        promoBanners: state.promoBanners,
        brandsList: state.brandsList,
        testimonialsList: state.testimonialsList,
        unboxingVideos: state.unboxingVideos,
        racingVideos: state.racingVideos,
        announcementText: state.announcementText,
        heroTitleLine1: state.heroTitleLine1,
        heroTitleLine2: state.heroTitleLine2,
        heroDescription: state.heroDescription,
        brandsBadge: state.brandsBadge,
        brandsTitle: state.brandsTitle,
        brandsSubtitle: state.brandsSubtitle,
        aboutBadge: state.aboutBadge,
        aboutTitleLine1: state.aboutTitleLine1,
        aboutTitleLine2: state.aboutTitleLine2,
        aboutSubtitle: state.aboutSubtitle,
        aboutDescription: state.aboutDescription,
        aboutBullets: state.aboutBullets,
        aboutImage: state.aboutImage,
        aboutImageOverlayTitle: state.aboutImageOverlayTitle,
        aboutImageOverlaySubtitle: state.aboutImageOverlaySubtitle,
        testimonialsBadge: state.testimonialsBadge,
        testimonialsTitle: state.testimonialsTitle,
      }),
      version: 1,
    }
  )
);
