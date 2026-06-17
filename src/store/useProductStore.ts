import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, PRODUCTS, MOCK_REVIEWS, Review, Category, MOCK_CATEGORIES, RCGuide, RC_GUIDES } from "../data/mockData";
import { supabase } from "../utils/supabase";
import { useAuthStore } from "./useAuthStore";

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
                    price: product.price, compare_price: product.comparePrice, sku: product.sku, weight_grams: product.weightGrams,
                    scale: product.scale, terrain_type: product.terrainType, is_featured: product.isFeatured, is_active: product.isActive,
                    speed_kmh: product.speedKmh, build_type: product.buildType, images: product.images, video_url: product.videoUrl,
                    whats_in_the_box: product.whatsInTheBox, specs: product.specs, compatible_parts: product.compatibleParts,
                    variants: product.variants, stock_qty: product.stockQty, average_rating: product.averageRating, review_count: product.reviewCount,
                    brand_id: product.brandId, category_id: product.categoryId
                  };
                  await supabase.from("products").insert(dbProduct);
                } catch (e) {}
              });
            } else {
              set({ products: [] });
            }
          }
        } catch (err: any) {
          console.error("Supabase error:", err.message);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProductStock: (productId, variantId, newStock) => {
        set(state => ({
          products: state.products.map(p => {
            if (p.id === productId) {
              const updatedVariants = p.variants.map(v => 
                v.id === variantId ? { ...v, stockQty: newStock } : v
              );
              const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stockQty, 0);
              return { ...p, variants: updatedVariants, stockQty: newTotalStock };
            }
            return p;
          })
        }));
      },

      addProduct: (product) => {
        set(state => ({ products: [...state.products, product] }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              const dbProduct = {
                id: product.id, name: product.name, slug: product.slug, description: product.description,
                price: product.price, compare_price: product.comparePrice, sku: product.sku, weight_grams: product.weightGrams,
                scale: product.scale, terrain_type: product.terrainType, is_featured: product.isFeatured, is_active: product.isActive,
                speed_kmh: product.speedKmh, build_type: product.buildType, images: product.images, video_url: product.videoUrl,
                whats_in_the_box: product.whatsInTheBox, specs: product.specs, compatible_parts: product.compatibleParts,
                variants: product.variants, stock_qty: product.stockQty, average_rating: product.averageRating, review_count: product.reviewCount,
                brand_id: product.brandId, category_id: product.categoryId
              };
              await supabase.from("products").insert(dbProduct);
            } catch (err) {}
          })();
        }
      },
      updateProduct: (updatedProduct) => {
        set(state => ({
          products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              const dbProduct = {
                name: updatedProduct.name, slug: updatedProduct.slug, description: updatedProduct.description,
                price: updatedProduct.price, compare_price: updatedProduct.comparePrice, sku: updatedProduct.sku, weight_grams: updatedProduct.weightGrams,
                scale: updatedProduct.scale, terrain_type: updatedProduct.terrainType, is_featured: updatedProduct.isFeatured, is_active: updatedProduct.isActive,
                speed_kmh: updatedProduct.speedKmh, build_type: updatedProduct.buildType, images: updatedProduct.images, video_url: updatedProduct.videoUrl,
                whats_in_the_box: updatedProduct.whatsInTheBox, specs: updatedProduct.specs, compatible_parts: updatedProduct.compatibleParts,
                variants: updatedProduct.variants, stock_qty: updatedProduct.stockQty, average_rating: updatedProduct.averageRating, review_count: updatedProduct.reviewCount,
                brand_id: updatedProduct.brandId, category_id: updatedProduct.categoryId
              };
              await supabase.from("products").update(dbProduct).eq("id", updatedProduct.id);
            } catch (err) {}
          })();
        }
      },
      deleteProduct: (productId) => {
        set(state => ({
          products: state.products.filter(p => p.id !== productId)
        }));
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isConfigured) {
          (async () => {
            try {
              await supabase.from("products").delete().eq("id", productId);
            } catch (err) {}
          })();
        }
      },

      addProductReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
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
      },

      addCategory: (category) => set(state => ({ categories: [...state.categories, category] })),
      updateCategory: (updatedCategory) => set(state => ({
        categories: state.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
      })),
      deleteCategory: (categoryId) => set(state => ({
        categories: state.categories.filter(c => c.id !== categoryId)
      })),

      addGuide: (guide) => set(state => ({
        guides: [...state.guides, guide]
      })),
      updateGuide: (guide) => set(state => ({
        guides: state.guides.map(g => g.id === guide.id ? guide : g)
      })),
      deleteGuide: (guideId) => set(state => ({
        guides: state.guides.filter(g => g.id !== guideId)
      })),
    }),
    {
      name: "marque-product-storage",
      partialize: (state) => ({
        wishlist: state.wishlist,
        products: state.products,
        categories: state.categories
      }),
      version: 1
    }
  )
);
