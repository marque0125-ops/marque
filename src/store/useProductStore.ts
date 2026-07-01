import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, PRODUCTS, MOCK_REVIEWS, Review, Category, MOCK_CATEGORIES, RCGuide, RC_GUIDES } from "../data/mockData";
import { supabase } from "../utils/supabase";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export interface ProductState {
  isLoading: boolean;
  categories: Category[];
  guides: RCGuide[];
  products: Product[];
  reviews: Review[];
  wishlist: string[];
  searchQuery: string;
  filterBrand: string;
  filterCategory: string;
  filterTerrain: string;
  filterScale: string;
  filterBuildType: string;
  priceRange: [number, number];
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';

  setSearchQuery: (q: string) => void;
  setFilterBrand: (brand: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterTerrain: (terrain: string) => void;
  setFilterScale: (scale: string) => void;
  setFilterBuildType: (build: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;
  setWishlist: (wishlist: string[]) => void;

  toggleWishlist: (productId: string) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchGuides: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProductReview: (review: Omit<Review, 'id' | 'date'>) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  addGuide: (guide: RCGuide) => void;
  updateGuide: (guide: RCGuide) => void;
  deleteGuide: (guideId: string) => void;
}

const normalizeProduct = (p: any): Product => ({
  id: p.id,
  brandId: p.brand_id || p.brandId || "",
  categoryId: p.category_id || p.categoryId || "",
  name: p.name || "",
  slug: p.slug || "",
  description: p.description || "",
  price: Number(p.price || 0),
  comparePrice: Number(p.compare_price || p.comparePrice || 0),
  shippingPrice: Number(p.shipping_price || p.shippingPrice || 0),
  batteryAddonPrice: Number(p.battery_addon_price || p.batteryAddonPrice || 0),
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

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      categories: MOCK_CATEGORIES,
      guides: RC_GUIDES,
      products: PRODUCTS,
      isLoading: false,
      reviews: MOCK_REVIEWS,
      wishlist: [],
      searchQuery: "",
      filterCategory: "ALL",
      filterBrand: "ALL",
      filterTerrain: "ALL",
      filterScale: "ALL",
      filterBuildType: "ALL",
      priceRange: [0, 150000],
      sortBy: "newest",

      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setFilterBrand: (brand) => set({ filterBrand: brand }),
      setFilterTerrain: (terrain) => set({ filterTerrain: terrain }),
      setFilterScale: (scale) => set({ filterScale: scale }),
      setFilterBuildType: (build) => set({ filterBuildType: build }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSortBy: (sort) => set({ sortBy: sort }),
      resetFilters: () => set({
        searchQuery: "",
        filterCategory: "ALL",
        filterBrand: "ALL",
        filterTerrain: "ALL",
        filterScale: "ALL",
        filterBuildType: "ALL",
        priceRange: [0, 150000],
        sortBy: "newest"
      }),

      setWishlist: (wishlist) => set({ wishlist }),

      toggleWishlist: (productId) => {
        const state = get();
        const authState = useAuthStore.getState();
        const newWishlist = state.wishlist.includes(productId) 
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId];
        
        set({ wishlist: newWishlist });

        // Sync to cloud if authenticated
        if (authState.isAuthenticated) {
          (async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user?.id) {
                // @ts-ignore
                await (supabase.from("profiles") as any)
                  .update({ wishlist: newWishlist })
                  .eq("id", session.user.id);
              }
            } catch (err) {
              console.warn("Could not sync wishlist to cloud", err);
              toast.error("Could not sync wishlist to cloud");
            }
          })();
        }
      },

      fetchProducts: async () => {
        set({ isLoading: true });
        const isConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

        if (!isConfigured) {
          set({ isLoading: false });
          return;
        }

        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: true });

          if (error) {
            console.warn("Fetch products error:", error.message);
            toast.error("Failed to fetch products: " + error.message);
            // Preserve local state if DB fetch fails
            return;
          }

          if (data && data.length > 0) {
            const dbProducts = data.map(normalizeProduct);
            set({ products: dbProducts });
          } else if (data && data.length === 0) {
            // DB is empty. If local state has products, seed the DB.
            const currentProducts = get().products;
            if (currentProducts.length > 0) {
              currentProducts.forEach(async (product) => {
                try {
                  const dbProduct = {
                    id: product.id, name: product.name, slug: product.slug, description: product.description,
                    price: product.price, compare_price: product.comparePrice, shipping_price: product.shippingPrice || 0, battery_addon_price: product.batteryAddonPrice || 0, sku: product.sku, weight_grams: product.weightGrams,
                    scale: product.scale, terrain_type: product.terrainType, is_featured: product.isFeatured, is_active: product.isActive,
                    speed_kmh: product.speedKmh, build_type: product.buildType, images: product.images, video_url: product.videoUrl,
                    whats_in_the_box: product.whatsInTheBox, specs: product.specs, compatible_parts: product.compatibleParts,
                    variants: product.variants, stock_qty: product.stockQty, average_rating: product.averageRating, review_count: product.reviewCount,
                    brand_id: product.brandId, category_id: product.categoryId
                  };
                  await supabase.from("products").insert(dbProduct as any);
                } catch (e) {}
              });
            } else {
              set({ products: [] });
            }
          }
        } catch (err: any) {
          console.error("Supabase error:", err.message);
          toast.error("Database error: " + err.message);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCategories: async () => {
        const isConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

        if (!isConfigured) {
          return;
        }

        try {
          const { data, error } = await supabase
            .from("categories")
            .select("*");

          if (error) {
            console.warn("Fetch categories error:", error.message);
            toast.error("Failed to fetch categories: " + error.message);
            return;
          }

          if (data && data.length > 0) {
            set({ categories: data });
          } else if (data && data.length === 0) {
            // Seed DB with local categories if empty
            const currentCategories = get().categories;
            if (currentCategories.length > 0) {
              currentCategories.forEach(async (category) => {
                try {
                  await supabase.from("categories").insert({
                    id: category.id,
                    name: category.name,
                    image: category.image
                  } as any);
                } catch (e) {}
              });
            } else {
              set({ categories: [] });
            }
          }
        } catch (err: any) {
          console.error("Supabase error:", err.message);
          toast.error("Database error: " + err.message);
        }
      },

      fetchGuides: async () => {
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (!isConfigured) return;

        try {
          const { data, error } = await (supabase as any).from("guides").select("*");
          if (error) {
            console.error("Supabase Error fetching guides:", error.message);
            return;
          }
          if (data && data.length > 0) {
            const mappedGuides = data.map((g: any) => ({
              id: g.id,
              title: g.title,
              excerpt: g.excerpt,
              content: g.content,
              category: g.category,
              readTime: g.read_time,
              imageUrl: g.image_url
            }));
            set({ guides: mappedGuides });
          }
        } catch (err) {
          console.error("Failed to fetch guides from Supabase", err);
        }
      },

      fetchReviews: async () => {
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (!isConfigured) return;

        try {
          const { data, error } = await (supabase as any).from("reviews").select("*").order("created_at", { ascending: false });
          if (error) {
            console.error("Supabase Error fetching reviews:", error.message);
            return;
          }
          if (data && data.length > 0) {
            const mappedReviews = data.map((r: any) => ({
              id: r.id,
              productId: r.product_id,
              userName: r.reviewer_name,
              rating: r.rating,
              title: r.title,
              body: r.body,
              date: r.date,
              verifiedPurchase: r.is_verified,
              avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"
            }));
            set({ reviews: mappedReviews });
          }
        } catch (err) {
          console.error("Failed to fetch reviews from Supabase", err);
        }
      },

      updateProductStock: (productId, variantId, newStock) => {
        let updatedProduct: Product | null = null;
        set(state => ({
          products: state.products.map(p => {
            if (p.id === productId) {
              const updatedVariants = p.variants.map(v => 
                v.id === variantId ? { ...v, stockQty: newStock } : v
              );
              const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stockQty, 0);
              updatedProduct = { ...p, variants: updatedVariants, stockQty: newTotalStock };
              return updatedProduct;
            }
            return p;
          })
        }));

        if (updatedProduct) {
          const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
          if (isConfigured) {
            (async () => {
              try {
                await supabase.from("products").update({
                  variants: (updatedProduct as Product).variants as any,
                  stock_qty: (updatedProduct as Product).stockQty
                }).eq("id", productId);
              } catch (err) {}
            })();
          }
        }
      },

      addProduct: (product) => {
        set(state => ({ products: [...state.products, product] }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              const dbProduct = {
                id: product.id, name: product.name, slug: product.slug, description: product.description,
                price: product.price, compare_price: product.comparePrice, shipping_price: product.shippingPrice || 0, battery_addon_price: product.batteryAddonPrice || 0, sku: product.sku, weight_grams: product.weightGrams,
                scale: product.scale, terrain_type: product.terrainType, is_featured: product.isFeatured, is_active: product.isActive,
                speed_kmh: product.speedKmh, build_type: product.buildType, images: product.images, video_url: product.videoUrl,
                whats_in_the_box: product.whatsInTheBox, specs: product.specs, compatible_parts: product.compatibleParts,
                variants: product.variants, stock_qty: product.stockQty, average_rating: product.averageRating, review_count: product.reviewCount,
                brand_id: product.brandId, category_id: product.categoryId
              };
              const { error } = await supabase.from("products").insert(dbProduct as any);
              if (error) {
                console.error("Failed to save product to Supabase:", error);
                toast.error("Cloud DB Error: " + error.message);
                // Rollback local state
                set(state => ({ products: state.products.filter(p => p.id !== product.id) }));
              }
            } catch (err: any) {
              console.error("Supabase exception:", err);
              toast.error("Cloud DB Exception: " + err.message);
            }
          })();
        }
      },
      updateProduct: (updatedProduct) => {
        const previousState = get().products;
        set(state => ({
          products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              const dbProduct = {
                name: updatedProduct.name, slug: updatedProduct.slug, description: updatedProduct.description,
                price: updatedProduct.price, compare_price: updatedProduct.comparePrice, shipping_price: updatedProduct.shippingPrice || 0, battery_addon_price: updatedProduct.batteryAddonPrice || 0, sku: updatedProduct.sku, weight_grams: updatedProduct.weightGrams,
                scale: updatedProduct.scale, terrain_type: updatedProduct.terrainType, is_featured: updatedProduct.isFeatured, is_active: updatedProduct.isActive,
                speed_kmh: updatedProduct.speedKmh, build_type: updatedProduct.buildType, images: updatedProduct.images, video_url: updatedProduct.videoUrl,
                whats_in_the_box: updatedProduct.whatsInTheBox, specs: updatedProduct.specs, compatible_parts: updatedProduct.compatibleParts,
                variants: updatedProduct.variants, stock_qty: updatedProduct.stockQty, average_rating: updatedProduct.averageRating, review_count: updatedProduct.reviewCount,
                brand_id: updatedProduct.brandId, category_id: updatedProduct.categoryId
              };
              const { error } = await supabase.from("products").update(dbProduct as any).eq("id", updatedProduct.id);
              if (error) {
                console.error("Failed to update product in Supabase:", error);
                toast.error("Cloud DB Update Error: " + error.message);
                set({ products: previousState }); // Rollback
              }
            } catch (err: any) {
              toast.error("Cloud DB Exception: " + err.message);
              set({ products: previousState });
            }
          })();
        }
      },
      deleteProduct: (productId) => {
        const previousState = get().products;
        set(state => ({
          products: state.products.filter(p => p.id !== productId)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              const { error } = await supabase.from("products").delete().eq("id", productId);
              if (error) {
                console.error("Failed to delete product in Supabase:", error);
                toast.error("Cloud DB Delete Error: " + error.message);
                set({ products: previousState }); // Rollback
              }
            } catch (err: any) {
              toast.error("Cloud DB Exception: " + err.message);
              set({ products: previousState });
            }
          })();
        }
      },

      addProductReview: (review) => {
        const newReview: Review = {
          ...review as any,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"
        };
        set(state => {
          const nextReviews = [newReview, ...state.reviews];
          const prodReviews = nextReviews.filter(r => r.productId === review.productId);
          const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
          const avg = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 0;
          
          return {
            reviews: nextReviews,
            products: state.products.map(p => p.id === review.productId ? { ...p, averageRating: avg, reviewCount: prodReviews.length } : p)
          };
        });

        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await (supabase as any).from("reviews").insert({
                id: newReview.id,
                product_id: newReview.productId,
                reviewer_name: newReview.userName,
                rating: newReview.rating,
                title: newReview.title,
                body: newReview.body,
                date: newReview.date,
                is_verified: newReview.verifiedPurchase || false
              } as any);

              // Update product stats in DB
              const state = get();
              const prodReviews = state.reviews.filter(r => r.productId === review.productId);
              const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
              const avg = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 0;
              await supabase.from("products").update({
                average_rating: avg,
                review_count: prodReviews.length
              }).eq("id", review.productId);

            } catch (err) {
              console.error("Failed to save review to Supabase:", err);
            }
          })();
        }
      },

      addCategory: (category) => {
        set(state => ({ categories: [...state.categories, category] }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await supabase.from("categories").insert({
                id: category.id,
                name: category.name,
                image: category.image
              } as any);
            } catch (err) {}
          })();
        }
      },
      updateCategory: (updatedCategory) => {
        set(state => ({
          categories: state.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await supabase.from("categories").update({
                name: updatedCategory.name,
                image: updatedCategory.image
              }).eq("id", updatedCategory.id);
            } catch (err) {}
          })();
        }
      },
      deleteCategory: (categoryId) => {
        set(state => ({
          categories: state.categories.filter(c => c.id !== categoryId)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await supabase.from("categories").delete().eq("id", categoryId);
            } catch (err) {}
          })();
        }
      },

      addGuide: (guide) => {
        set(state => ({ guides: [...state.guides, guide] }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await (supabase as any).from("guides").insert({
                id: guide.id,
                title: guide.title,
                excerpt: guide.excerpt,
                content: guide.content,
                category: guide.category,
                read_time: guide.readTime,
                image_url: guide.imageUrl,
                date: new Date().toISOString()
              } as any);
            } catch (err) {}
          })();
        }
      },
      updateGuide: (guide) => {
        set(state => ({ guides: state.guides.map(g => g.id === guide.id ? guide : g) }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await (supabase as any).from("guides").update({
                title: guide.title,
                excerpt: guide.excerpt,
                content: guide.content,
                category: guide.category,
                read_time: guide.readTime,
                image_url: guide.imageUrl,
                date: new Date().toISOString()
              }).eq("id", guide.id);
            } catch (err) {}
          })();
        }
      },
      deleteGuide: (guideId) => {
        set(state => ({ guides: state.guides.filter(g => g.id !== guideId) }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await (supabase as any).from("guides").delete().eq("id", guideId);
            } catch (err) {}
          })();
        }
      },
    }),
    {
      name: "marque-product-storage",
      partialize: (state) => ({
        wishlist: state.wishlist,
        products: state.products,
        categories: state.categories,
        guides: state.guides,
        reviews: state.reviews
      }),
      version: 1
    }
  )
);
