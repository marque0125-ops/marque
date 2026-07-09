"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { BRANDS, Product } from "../data/mockData";
import { 
  Heart, 
  Star, 
  RotateCcw, 
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Box
} from "lucide-react";

export default function AccessoriesView() {
  const { addToCart } = useCartStore();
  const { 
    products,
    priceRange,
    setPriceRange,
    wishlist,
    toggleWishlist
  } = useProductStore();
  const {
    setSelectedProduct,
    showDialog
  } = useUIStore();
  const router = useRouter();

  const [activeBrandTab, setActiveBrandTab] = useState<"ALL" | "LEGO" | "MARQUE">("ALL");
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // 1. FILTER ACCESSORIES ONLY (categoryId === 'accessories')
  const rawAccessories = products.filter(p => p.categoryId === "accessories");

  const filteredAccessories = rawAccessories.filter(p => {
    // Brand category tab
    if (activeBrandTab === "LEGO" && p.brandId !== "b8") return false;
    if (activeBrandTab === "MARQUE" && p.brandId !== "b9") return false;

    // Price limit
    if (p.price > maxPrice) return false;

    // Availability
    if (onlyInStock && p.stockQty === 0) return false;

    return true;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      addToCart(product, product.variants[0], 1);
      showDialog({
        title: 'Added to Cart',
        message: `${product.name} added to cart!`
      });
    } else {
      showDialog({
        title: 'Error',
        message: 'No retail variants defined for this accessory.'
      });
    }
  };

  const resetAllFilters = () => {
    setActiveBrandTab("ALL");
    setMaxPrice(12000);
    setOnlyInStock(false);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Premium Spotlight Hero Block */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-brand-gold/5 blur-3xl" />
        
        <div className="relative max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-brand-orange">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            <span className="text-[10px] font-normal uppercase tracking-widest font-display">Premium Collection Showcase</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-normal uppercase tracking-tight text-white leading-none">
            MARQUE Showcase <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">
              & LEGO Disney Kits
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Protect and elevate your high-spec builds. Browse officially licensed Disney LEGO® masterpieces and dust-proof heavy duty MARQUE crystal-clear acrylic enclosures built for discerning hobbyist curators.
          </p>

          {/* Quick trust metrics */}
          <div className="flex flex-wrap gap-4 pt-2 text-[10px] text-slate-400 font-normal uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand-orange" /> 100% Certified Genuine</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-gold" /> Secure Tracked Delivery</span>
            <span className="flex items-center gap-1.5"><Box className="h-4 w-4 text-green-400" /> Damage-Proof Packaging</span>
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Interactive Tune Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <span className="text-xs font-normal uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-orange" />
              Tune Filters
            </span>
            <button 
              onClick={resetAllFilters}
              className="text-[10px] text-brand-orange font-normal uppercase hover:underline flex items-center gap-0.5"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Brand Segment Switches */}
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest block">Brand Lineup</label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "ALL", label: "All Collections" },
                { id: "LEGO", label: "LEGO® Disney" },
                { id: "MARQUE", label: "MARQUE Enclosures" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveBrandTab(btn.id as any)}
                  className={`w-full py-2.5 px-3 text-left text-xs font-normal uppercase rounded-lg border transition-all ${activeBrandTab === btn.id ? 'bg-brand-orange text-white sm:text-black border-brand-orange' : 'border-brand-border bg-slate-900/50 hover:bg-slate-900 text-slate-300'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-normal text-slate-400 uppercase tracking-widest">
              <span>Max Budget</span>
              <span className="text-brand-gold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range" 
              min={2000} 
              max={12000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-brand-orange cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-normal font-mono">
              <span>₹2,000</span>
              <span>₹12,000</span>
            </div>
          </div>

          {/* In Stock Only Switch */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 font-normal select-none bg-slate-900/40 p-3 rounded-lg border border-brand-border/40 hover:border-brand-border transition-colors">
            <input 
              type="checkbox" 
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded accent-brand-orange border-slate-700 h-4 w-4 bg-slate-950" 
            />
            <span>Show In-Stock Only</span>
          </label>
        </aside>

        {/* Right Active Grid Catalog */}
        <div className="flex-grow space-y-6 w-full">
          {filteredAccessories.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 py-24 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-orange flex items-center justify-center mx-auto text-brand-orange">
                <RotateCcw className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="font-display text-lg font-normal text-white uppercase">No items match filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No performance showcases or Lego kits fit your active parameters. Try resetting your price sliders.
              </p>
              <button 
                onClick={resetAllFilters}
                className="bg-brand-orange text-white sm:text-black font-normal text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccessories.map((p) => {
                const brand = BRANDS.find(b => b.id === p.brandId);
                const isWished = wishlist.includes(p.id);

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleProductClick(p)}
                    className="group cursor-pointer relative flex flex-col rounded-2xl border border-brand-border bg-slate-900/30 overflow-hidden hover:border-brand-orange hover:bg-slate-900/80 transition-all duration-300 shadow-lg hover:shadow-glow"
                  >
                    {/* Primary Image Showcase Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                      <img 
                        src={p.images[0]} 
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Display Brand Badge and Type */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="rounded bg-black/85 px-2.5 py-0.5 text-[9px] font-normal text-brand-orange border border-brand-orange/30 uppercase tracking-widest font-display">
                          {brand?.name}
                        </span>
                        {p.specs.Pieces && (
                          <span className="rounded bg-black/85 px-2 py-0.5 text-[9px] font-normal text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                            {p.specs.Pieces}
                          </span>
                        )}
                      </div>

                      {/* Heart Wishlist Trigger */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 z-10 rounded-full bg-slate-950/80 p-2 border border-slate-800 text-slate-400 hover:text-brand-orange transition-colors"
                      >
                        <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
                      </button>

                      {/* Live Inventory Status Overlays */}
                      <div className="absolute bottom-3 left-3 z-10">
                        {p.stockQty === 0 ? (
                          <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-normal text-white uppercase tracking-wider">
                            SOLD OUT
                          </span>
                        ) : p.stockQty < 3 ? (
                          <span className="rounded bg-brand-orange px-2 py-0.5 text-[9px] font-normal text-white sm:text-black uppercase tracking-wider animate-pulse">
                            Only {p.stockQty} Left!
                          </span>
                        ) : (
                          <span className="rounded bg-slate-950/85 border border-slate-800 px-2 py-0.5 text-[9px] font-normal text-green-400 uppercase tracking-wider">
                            Ready To Ship
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata specs details */}
                    <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-normal text-slate-500 uppercase tracking-widest">
                          <span>{brand?.slug === "lego" ? "DIY Build Kit" : "Storage Case"}</span>
                          <span>SKU: {p.sku.slice(0, 10)}</span>
                        </div>
                        <h3 className="font-display text-sm font-normal text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      {/* Display specs table in capsule */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/50 p-2 rounded-lg border border-brand-border/40 font-normal text-slate-300 leading-none">
                        {Object.entries(p.specs).slice(0, 2).map(([key, val]) => (
                          <div key={key} className="flex justify-between pr-2">
                            <span className="text-slate-500">{key}:</span>
                            <span className="text-slate-300 truncate max-w-[70px]" title={val}>{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing and cart add section */}
                      <div className="flex items-center justify-between border-t border-brand-border/60 pt-3">
                        <div>
                          <span className="text-[10px] text-slate-500 line-through block leading-none">
                            ₹{p.comparePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-base font-normal text-brand-gold font-display leading-none block mt-1.5">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button 
                          onClick={(e) => handleQuickAdd(e, p)}
                          disabled={p.stockQty === 0}
                          className="rounded-lg bg-brand-orange text-white sm:text-black px-3.5 py-2.5 text-xs font-normal uppercase hover:bg-brand-gold disabled:bg-slate-800 disabled:text-slate-600 transition-colors flex items-center gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {p.stockQty === 0 ? "Out" : "Buy Now"}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
