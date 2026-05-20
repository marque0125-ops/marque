import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, PRODUCTS, MOCK_REVIEWS, Review } from "../data/mockData";
import { supabase } from "../utils/supabase";

export interface ProductState {
  products: Product[];
  reviews: Review[];
  wishlist: string[];
  searchQuery: string;
  filterBrand: string;
  filterTerrain: string;
  filterScale: string;
  filterBuildType: string;
  priceRange: [number, number];
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';

  setSearchQuery: (q: string) => void;
  setFilterBrand: (brand: string) => void;
  setFilterTerrain: (terrain: string) => void;
  setFilterScale: (scale: string) => void;
  setFilterBuildType: (build: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;

  toggleWishlist: (productId: string) => void;
  fetchProducts: () => Promise<void>;
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProductReview: (review: Omit<Review, 'id' | 'date'>) => void;
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
      products: PRODUCTS,
      reviews: MOCK_REVIEWS,
      wishlist: [],
      searchQuery: "",
      filterBrand: "ALL",
      filterTerrain: "ALL",
      filterScale: "ALL",
      filterBuildType: "ALL",
      priceRange: [0, 150000],
      sortBy: "newest",

      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilterBrand: (brand) => set({ filterBrand: brand }),
      setFilterTerrain: (terrain) => set({ filterTerrain: terrain }),
      setFilterScale: (scale) => set({ filterScale: scale }),
      setFilterBuildType: (build) => set({ filterBuildType: build }),
      setPriceRange: (range) => set({ priceRange: range }),
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

      toggleWishlist: (productId) => set(state => ({
        wishlist: state.wishlist.includes(productId) 
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),

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
            console.warn("Fetch products error:", error.message);
            set({ products: PRODUCTS });
            return;
          }

          if (data && data.length > 0) {
            const dbProducts = data.map(normalizeProduct);
            const mergedProducts = dbProducts.map(dbProd => {
              // Priority: If mockData has this exact product ID, force-sync the updated local images
              const mockEquivalent = PRODUCTS.find(p => p.id === dbProd.id);
              if (mockEquivalent) {
                return { ...dbProd, images: mockEquivalent.images };
              }
              return dbProd;
            });
            
            // Merge missing PRODUCTS (like our new accessories and vehicles) that don't exist in DB yet
            PRODUCTS.forEach(mockProd => {
              if (!mergedProducts.some(p => p.id === mockProd.id)) {
                mergedProducts.push(mockProd);
              }
            });
            
            set({ products: mergedProducts });
          } else {
            set({ products: PRODUCTS });
          }
        } catch (err: any) {
          console.error("Supabase error:", err.message);
          set({ products: PRODUCTS });
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

      addProduct: (product) => set(state => ({ products: [...state.products, product] })),
      updateProduct: (updatedProduct) => set(state => ({
        products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      })),
      deleteProduct: (productId) => set(state => ({
        products: state.products.filter(p => p.id !== productId)
      })),

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
      }
    }),
    {
      name: "marque-product-storage",
      partialize: (state) => ({
        wishlist: state.wishlist
      })
    }
  )
);
