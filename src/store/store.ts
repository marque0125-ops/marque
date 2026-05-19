import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant, BRANDS, PRODUCTS, MOCK_REVIEWS, Review, PinCodeDetail, PIN_CODES } from "../data/mockData";
import { supabase } from "../utils/supabase";

export interface CartItem {
  id: string; // unique item id (product.id + '-' + variant.id)
  product: Product;
  variant: ProductVariant;
  qty: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'out-of-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  trackingNumber: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    gstin?: string;
  };
  createdAt: string;
  logs: { status: string; timestamp: string; message: string }[];
}

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: "MARQUE10", type: "percent", value: 10, minOrder: 15000, description: "10% OFF on premium RC cars above ₹15,000" },
  { code: "MAXBASH", type: "flat", value: 5000, minOrder: 50000, description: "Flat ₹5,000 OFF on extreme performance rigs above ₹50,000" },
  { code: "FREESHIP", type: "flat", value: 500, minOrder: 10000, description: "Flat ₹500 discount simulating free standard shipping above ₹10,000" }
];

interface MarqueState {
  // Navigation & UI Route
  currentView: 'home' | 'shop' | 'pdp' | 'cart' | 'account' | 'admin';
  setView: (view: 'home' | 'shop' | 'pdp' | 'cart' | 'account' | 'admin') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Products Data (in-memory for CRUD)
  products: Product[];
  reviews: Review[];
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProductReview: (review: Omit<Review, 'id' | 'date'>) => void;
  
  // Search & Catalog Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterBrand: string;
  setFilterBrand: (brand: string) => void;
  filterTerrain: string;
  setFilterTerrain: (terrain: string) => void;
  filterScale: string;
  setFilterScale: (scale: string) => void;
  filterBuildType: string;
  setFilterBuildType: (build: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;
  
  // Cart operations
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  
  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Pin Code & Shipping (India specific)
  pincode: string;
  pinDetail: PinCodeDetail | null;
  pinLoading: boolean;
  pinError: string | null;
  checkPincode: (pin: string) => void;
  clearPincode: () => void;

  // Address
  address: {
    name: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    gstin?: string;
  };
  setAddress: (fields: Partial<MarqueState['address']>) => void;
  
  // Auth state & actions
  isAuthenticated: boolean;
  jwtToken: string | null;
  userEmail: string;
  setUserEmail: (email: string) => void;
  login: (name: string, phone: string, email?: string, token?: string) => void;
  loginWithSession: (name: string, phone: string, email: string, profile: any, token: string) => void;
  logout: () => void;
  
  // Orders & Simulation
  orders: Order[];
  createOrder: (paymentMethod: 'UPI' | 'Card' | 'COD', paymentId?: string) => Order;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  
  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;

  // Admin Alerts
  lowStockAlerts: { message: string; date: string; productId: string }[];
  clearLowStockAlerts: () => void;
  
  // Real-Time Catalog Sync Actions
  fetchProducts: () => Promise<void>;

  // Announcement Marquee Ticker
  announcementText: string;
  setAnnouncementText: (text: string) => void;
}

// Normalizes snake_case database schema fields to camelCase TS structure
const normalizeProduct = (p: any): Product => ({
  id: p.id,
  brandId: p.brand_id || p.brandId || "",
  categoryId: p.category_id || p.categoryId || "",
  name: p.name || "",
  slug: p.slug || "",
  description: p.description || "",
  price: Number(p.price || 0),
  comparePrice: Number(p.compare_price || p.comparePrice || 0),
  sku: p.sku || "",
  weightGrams: Number(p.weight_grams || p.weightGrams || 0),
  scale: p.scale || "",
  terrainType: p.terrain_type || p.terrainType || "Off-Road",
  isFeatured: Boolean(p.is_featured !== undefined ? p.is_featured : p.isFeatured),
  isActive: Boolean(p.is_active !== undefined ? p.is_active : p.isActive),
  speedKmh: Number(p.speed_kmh || p.speedKmh || 0),
  buildType: p.build_type || p.buildType || "RTR",
  images: Array.isArray(p.images) ? p.images : [],
  videoUrl: p.video_url || p.videoUrl || "",
  whatsInTheBox: Array.isArray(p.whats_in_the_box) ? p.whats_in_the_box : (Array.isArray(p.whatsInTheBox) ? p.whatsInTheBox : []),
  specs: p.specs || {},
  compatibleParts: Array.isArray(p.compatible_parts) ? p.compatible_parts : (Array.isArray(p.compatibleParts) ? p.compatibleParts : []),
  variants: Array.isArray(p.variants) ? p.variants : [],
  stockQty: Number(p.stock_qty || p.stockQty || 0),
  averageRating: Number(p.average_rating || p.averageRating || 0),
  reviewCount: Number(p.review_count || p.reviewCount || 0)
});

export const useMarqueStore = create<MarqueState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'home',
      setView: (view) => set({ currentView: view }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product, currentView: product ? 'pdp' : 'shop' }),
      
      fetchProducts: async () => {
        const isConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

        if (!isConfigured) {
          set({ products: PRODUCTS });
          return;
        }

        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: true });

          if (error) {
            console.warn("☁️ Supabase Cloud Catalog Info: Fetch products error, falling back to local products:", error.message);
            if (error.message.toLowerCase().includes("could not find the table") || error.message.toLowerCase().includes("does not exist")) {
              console.log("👉 DYNAMIC HELP GUIDE: The 'products' table does not exist in your Supabase database schema yet! Don't worry, I have created a file called 'supabase-schema.sql' at your project root. Simply copy the SQL commands from 'supabase-schema.sql' and run them in your Supabase Dashboard SQL Editor to instantly initialize all tables and engage live catalog sync!");
            }
            set({ products: PRODUCTS });
            return;
          }

          if (data && data.length > 0) {
            set({ products: data.map(normalizeProduct) });
            console.log("☁️ Supabase Cloud Catalog: Loaded products directly from cloud database.");
          } else {
            console.log("☁️ Supabase Cloud Catalog: Products table is empty. Auto-seeding catalog pipeline...");
            
            // Loop and insert PRODUCTS
            for (const prod of PRODUCTS) {
              try {
                await supabase.from("products").upsert({
                  id: prod.id,
                  brand_id: prod.brandId,
                  category_id: prod.categoryId,
                  name: prod.name,
                  slug: prod.slug,
                  description: prod.description,
                  price: prod.price,
                  compare_price: prod.comparePrice,
                  sku: prod.sku,
                  weight_grams: prod.weightGrams,
                  scale: prod.scale,
                  terrain_type: prod.terrainType,
                  is_featured: prod.isFeatured,
                  is_active: prod.isActive,
                  speed_kmh: prod.speedKmh,
                  build_type: prod.buildType,
                  images: prod.images,
                  video_url: prod.videoUrl || null,
                  whats_in_the_box: prod.whatsInTheBox,
                  specs: prod.specs,
                  compatible_parts: prod.compatibleParts,
                  variants: prod.variants,
                  stock_qty: prod.stockQty,
                  average_rating: prod.averageRating,
                  review_count: prod.reviewCount
                });
              } catch (seedErr) {
                console.warn(`☁️ Supabase Seeding failed for ${prod.id}:`, seedErr);
              }
            }
            
            // Refetch after seeding
            const { data: refetched } = await supabase
              .from("products")
              .select("*")
              .order("id", { ascending: true });
              
            if (refetched && refetched.length > 0) {
              set({ products: refetched.map(normalizeProduct) });
            } else {
              set({ products: PRODUCTS });
            }
            console.log("☁️ Supabase Cloud Catalog: Auto-seeded and loaded products successfully.");
          }
        } catch (err: any) {
          console.error("☁️ Supabase Cloud Catalog Connection Error:", err.message);
          set({ products: PRODUCTS });
        }
      },
      
      // In-memory data structures
      products: PRODUCTS,
      reviews: MOCK_REVIEWS,
      announcementText: "⚡ EXTREME 8S BRUSHLESS ACTION • GST-INCLUSIVE PRICES • FREE SHIPPING ABOVE ₹10,000 ⚡",
      setAnnouncementText: (text) => set({ announcementText: text }),
      
      updateProductStock: (productId, variantId, newStock) => {
        const currentProducts = get().products;
        let alertTriggered = false;
        let affectedProduct = "";
        
        const updated = currentProducts.map(p => {
          if (p.id === productId) {
            affectedProduct = p.name;
            const updatedVariants = p.variants.map(v => {
              if (v.id === variantId) {
                if (newStock < 3 && v.stockQty >= 3) {
                  alertTriggered = true;
                }
                return { ...v, stockQty: newStock };
              }
              return v;
            });
            const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stockQty, 0);
            return { ...p, variants: updatedVariants, stockQty: newTotalStock };
          }
          return p;
        });

        set({ products: updated });

        if (alertTriggered) {
          const alertItem = {
            productId,
            message: `CRITICAL ALERT: ${affectedProduct} (SKU: ${variantId}) has dropped to ${newStock} units! Immediate reorder required.`,
            date: new Date().toLocaleTimeString()
          };
          set(state => ({ lowStockAlerts: [alertItem, ...state.lowStockAlerts] }));
        }

        // Keep selected product in PDP updated if active
        const activeSelected = get().selectedProduct;
        if (activeSelected && activeSelected.id === productId) {
          const updatedActive = updated.find(p => p.id === productId) || null;
          set({ selectedProduct: updatedActive });
        }
      },

      addProduct: (product) => {
        set(state => ({ products: [...state.products, product] }));
      },
      updateProduct: (updatedProduct) => {
        set(state => ({
          products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        }));
      },
      deleteProduct: (productId) => {
        set(state => ({
          products: state.products.filter(p => p.id !== productId)
        }));
      },
      
      addProductReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        };
        set(state => {
          const nextReviews = [newReview, ...state.reviews];
          // Recalculate average rating
          const prodReviews = nextReviews.filter(r => r.productId === review.productId);
          const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
          const avg = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 0;
          
          const updatedProducts = state.products.map(p => {
            if (p.id === review.productId) {
              return { ...p, averageRating: avg, reviewCount: prodReviews.length };
            }
            return p;
          });

          return {
            reviews: nextReviews,
            products: updatedProducts,
            // also update selectedProduct if viewing it
            selectedProduct: state.selectedProduct?.id === review.productId 
              ? { ...state.selectedProduct, averageRating: avg, reviewCount: prodReviews.length } 
              : state.selectedProduct
          };
        });
      },

      // Catalog Filters
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
      filterBrand: "ALL",
      setFilterBrand: (brand) => set({ filterBrand: brand }),
      filterTerrain: "ALL",
      setFilterTerrain: (terrain) => set({ filterTerrain: terrain }),
      filterScale: "ALL",
      setFilterScale: (scale) => set({ filterScale: scale }),
      filterBuildType: "ALL",
      setFilterBuildType: (build) => set({ filterBuildType: build }),
      priceRange: [0, 150000],
      setPriceRange: (range) => set({ priceRange: range }),
      sortBy: "newest",
      setSortBy: (sort) => set({ sortBy: sort }),
      resetFilters: () => set({
        searchQuery: "",
        filterBrand: "ALL",
        filterTerrain: "ALL",
        filterScale: "ALL",
        filterBuildType: "ALL",
        priceRange: [0, 150000],
        sortBy: "newest"
      }),

      // Cart State
      cart: [],
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

      // Coupon Logic
      appliedCoupon: null,
      applyCoupon: (code) => {
        const cart = get().cart;
        // calculate subtotal
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
      removeCoupon: () => set({ appliedCoupon: null }),

      // PIN Code Serviceability (Simulating India Post + MARQUE Logistics Desk)
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

        // Simulate network delay
        setTimeout(() => {
          const detail = PIN_CODES[pin];
          if (detail) {
            set({ pinDetail: detail, pinLoading: false, pinError: null });
          } else {
            // Unserviceable pincode
            set({ 
              pinError: "UNSERVICEABLE: Custom couriers do not deliver RC goods to this pin code.", 
              pinDetail: null, 
              pinLoading: false 
            });
          }
        }, 800);
      },
      clearPincode: () => set({ pincode: "", pinDetail: null, pinError: null }),

      // Address Fields
      address: {
        name: "",
        phone: "",
        addressLine: "No. 2 Kuru Street, Madipakkam",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600091",
        gstin: ""
      },
      setAddress: (fields) => set(state => ({ address: { ...state.address, ...fields } })),
      
      // Auth Actions
      isAuthenticated: false,
      jwtToken: null,
      userEmail: "",
      setUserEmail: (email) => set({ userEmail: email }),
      login: (name, phone, email, token) => {
        // Safe check: if email looks like a JWT token, shift arguments
        let finalEmail = email || "";
        let finalToken = token;
        if (email && email.includes(".") && email.split(".").length === 3) {
          finalToken = email;
          finalEmail = "";
        }

        // Generate a mock JWT structural token if not already supplied (offline mode/first-time local)
        const activeToken = finalToken || (() => {
          try {
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify({
              iss: "marque-rc-india",
              sub: phone,
              name: name,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 86400
            }));
            const signature = btoa("mock-signature-hash-value-for-offline-mode");
            return `${header}.${payload}.${signature}`;
          } catch (e) {
            return "mock.jwt.token";
          }
        })();

        // Synchronously update authentication states immediately
        set(state => ({
          isAuthenticated: true,
          jwtToken: activeToken,
          userEmail: finalEmail,
          address: {
            ...state.address,
            name,
            phone
          }
        }));

        // Trigger background fire-and-forget cloud database write
        const isConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

        if (isConfigured) {
          (async () => {
            try {
              const { data: existing } = await supabase
                .from("profiles")
                .select("phone")
                .eq("phone", phone)
                .maybeSingle();

              if (!existing) {
                await supabase.from("profiles").insert({
                  name,
                  phone,
                  address_line: get().address.addressLine || "No. 2 Kuru Street, Madipakkam",
                  city: get().address.city || "Chennai",
                  state: get().address.state || "Tamil Nadu",
                  pincode: get().address.pincode || "600091"
                });
                console.log("☁️ Supabase Cloud Sync: Registered new profile successfully.");
              } else {
                console.log("☁️ Supabase Cloud Sync: Loaded profile successfully.");
              }
            } catch (err) {
              console.warn("☁️ Supabase Cloud Sync Info: Profiles table write bypassed.", err);
            }
          })();
        }
      },
      loginWithSession: (name, phone, email, profile, token) => set(state => ({
        isAuthenticated: true,
        jwtToken: token,
        userEmail: email || "",
        address: {
          name: name || profile.name || "",
          phone: phone || profile.phone || "",
          addressLine: profile.address_line || "No. 2 Kuru Street, Madipakkam",
          city: profile.city || "Chennai",
          state: profile.state || "Tamil Nadu",
          pincode: profile.pincode || "600091",
          gstin: profile.gstin || ""
        }
      })),
      logout: () => {
        // Sign out from Supabase Auth in parallel
        try {
          supabase.auth.signOut();
        } catch (e) {
          console.warn("Offline signout completed.", e);
        }
        set(state => ({
          isAuthenticated: false,
          jwtToken: null,
          userEmail: "",
          address: {
            name: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: "",
            gstin: ""
          },
          cart: [],
          appliedCoupon: null
        }));
      },

      // Order Placement and Processing Flow
      orders: [],
      createOrder: (paymentMethod, paymentId) => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => {
          const base = item.variant.priceOverride || item.product.price;
          return sum + (base * item.qty);
        }, 0);

        // Coupon discount
        let discountAmount = 0;
        const coupon = get().appliedCoupon;
        if (coupon) {
          if (coupon.type === 'percent') {
            discountAmount = Math.round(subtotal * coupon.value / 100);
          } else {
            discountAmount = coupon.value;
          }
        }

        // GST is 18% inclusive on RC goods.
        // Tax = Subtotal - (Subtotal / 1.18)
        const gstAmount = Math.round((subtotal - discountAmount) - ((subtotal - discountAmount) / 1.18));
        
        // Shipping charges
        const shippingAmount = get().pinDetail ? get().pinDetail!.shippingCost : 500;
        const totalAmount = (subtotal - discountAmount) + shippingAmount;

        const address = get().address;
        if (get().pinDetail) {
          address.city = get().pinDetail!.city;
          address.state = get().pinDetail!.state;
          address.pincode = get().pinDetail!.pincode;
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

        // Deduct stock from products database
        cart.forEach(item => {
          const currentStock = item.variant.stockQty;
          get().updateProductStock(item.product.id, item.variant.id, currentStock - item.qty);
        });

        // Save order and clear cart
        set(state => ({
          orders: [newOrder, ...state.orders],
          cart: [],
          appliedCoupon: null
        }));

        // Sync order manifest to Supabase in the background
        (async () => {
          try {
            const isConfigured = 
              process.env.NEXT_PUBLIC_SUPABASE_URL && 
              !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

            if (isConfigured) {
              await supabase.from("orders").insert({
                id: newOrder.id,
                items: newOrder.items,
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
                shipping_address: newOrder.shippingAddress,
                logs: newOrder.logs
              });
              console.log("☁️ Supabase Cloud Sync: Placed order backed up in cloud manifest database.");
            }
          } catch (err) {
            console.warn("☁️ Supabase Cloud Sync Info: Orders table is not initialized yet in your dashboard.", err);
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
        const orderList = get().orders;
        const updated = orderList.map(order => {
          if (order.id === orderId && order.status !== 'delivered' && order.status !== 'cancelled') {
            // Restore inventory stock
            order.items.forEach(item => {
              const currentProd = get().products.find(p => p.id === item.product.id);
              const currentVariant = currentProd?.variants.find(v => v.id === item.variant.id);
              if (currentVariant) {
                get().updateProductStock(item.product.id, item.variant.id, currentVariant.stockQty + item.qty);
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
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        set(state => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists 
              ? state.wishlist.filter(id => id !== productId)
              : [...state.wishlist, productId]
          };
        });
      },

      // Admin alerts
      lowStockAlerts: [],
      clearLowStockAlerts: () => set({ lowStockAlerts: [] })
    }),
    {
      name: "marque-commerce-storage",
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        wishlist: state.wishlist,
        address: state.address,
        lowStockAlerts: state.lowStockAlerts,
        isAuthenticated: state.isAuthenticated,
        userEmail: state.userEmail,
        jwtToken: state.jwtToken,
        announcementText: state.announcementText
      })
    }
  )
);
