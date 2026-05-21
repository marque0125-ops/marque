"use client";

import React from "react";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { BRANDS, Product } from "../data/mockData";
import {
  Heart,
  Star,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign
} from "lucide-react";
import { ProductCardItem } from "./ProductCardItem";

export default function ShopView() {
  const { addToCart } = useCartStore();
  const {
    products,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterBrand,
    setFilterBrand,
    filterTerrain,
    setFilterTerrain,
    filterScale,
    setFilterScale,
    filterBuildType,
    setFilterBuildType,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
    wishlist,
    toggleWishlist
  } = useProductStore();
  const {
    setView,
    setSelectedProduct
  } = useUIStore();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // add first variant with qty 1
    addToCart(product, product.variants[0], 1);
  };

  // 1. FILTER LOGIC
  const filteredProducts = products.filter(p => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const brand = BRANDS.find(b => b.id === p.brandId);
      const matchBrand = brand ? brand.name.toLowerCase().includes(q) : false;
      const matchTerrain = p.terrainType.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand && !matchTerrain) return false;
    }

    // Brand filter
    if (filterBrand !== "ALL") {
      const brand = BRANDS.find(b => b.id === p.brandId);
      if (!brand || brand.slug !== filterBrand) return false;
    }

    // Category filter
    if (filterCategory !== "ALL") {
      if (p.categoryId !== filterCategory) return false;
    }

    // Terrain filter
    if (filterTerrain !== "ALL") {
      if (p.terrainType !== filterTerrain) return false;
    }

    // Scale filter
    if (filterScale !== "ALL") {
      if (p.scale !== filterScale) return false;
    }

    // Build type filter (RTR vs Kit)
    if (filterBuildType !== "ALL") {
      if (p.buildType !== filterBuildType) return false;
    }

    // Price range filter
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

    return true;
  });

  // 2. SORT LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'newest':
      default:
        // simulate sort by ID/date
        return b.id.localeCompare(a.id);
    }
  });

  const activeFiltersCount =
    (filterCategory !== "ALL" ? 1 : 0) +
    (filterBrand !== "ALL" ? 1 : 0) +
    (filterTerrain !== "ALL" ? 1 : 0) +
    (filterScale !== "ALL" ? 1 : 0) +
    (filterBuildType !== "ALL" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 150000 ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0);

  return (
    <div className="space-y-8 pb-12">

      {/* Search status header banner */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">RC Performance Inventory</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1">
            {filterBrand !== "ALL" ? `${filterBrand} Garage` : "The Main Track"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {sortedProducts.length} high-velocity models. Fully tested and waterproofed.
          </p>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-brand-border bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 focus:border-brand-orange outline-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LEFT FILTER SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0 rounded-2xl border border-brand-border/50 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl p-6 space-y-6 sticky top-28 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-20 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-orange" />
              Tune Filters
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-brand-orange font-bold uppercase hover:underline flex items-center gap-0.5"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Search Query field in sidebar */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Search</label>
            <input
              type="text"
              placeholder="e.g. brushless, 8s..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-inner"
            />
          </div>

          {/* Filter Brand */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-inner outline-none"
            >
              <option value="ALL">All Brands</option>
              {BRANDS.map(b => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Scale */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Chassis Scale</label>
            <select
              value={filterScale}
              onChange={(e) => setFilterScale(e.target.value)}
              className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-inner outline-none"
            >
              <option value="ALL">All Scales</option>
              <option value="1:8">1:8 (Giant Heavy Duty)</option>
              <option value="1:10">1:10 (Standard Basher)</option>
              <option value="1:12">1:12 (Pocket Rocket)</option>
              <option value="1:14">1:14 (Mini Basher)</option>
              <option value="1:24">1:24 (Micro Scale Crawler)</option>
            </select>
          </div>

          {/* Filter Terrain */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Terrain Specialization</label>
            <select
              value={filterTerrain}
              onChange={(e) => setFilterTerrain(e.target.value)}
              className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-inner outline-none"
            >
              <option value="ALL">All Terrains</option>
              <option value="Off-Road">Off-Road (Basher)</option>
              <option value="On-Road">On-Road (Speed Runs)</option>
              <option value="Crawler">Crawler (Rock Trails)</option>
              <option value="Drift">Drift (Hairpin Slides)</option>
            </select>
          </div>

          {/* Filter Build Type (RTR vs Kit) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Build Type</label>
            <div className="flex gap-2">
              {['ALL', 'RTR', 'Kit'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterBuildType(type)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded border transition-all ${filterBuildType === type ? 'bg-brand-orange text-black border-brand-orange' : 'border-brand-border bg-slate-900 hover:border-slate-700 text-slate-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Price Slider (Standard Input Range) */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Max Budget</span>
              <span className="text-brand-gold">₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={5000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-brand-orange cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
              <span>₹5,000</span>
              <span>₹1,50,000</span>
            </div>
          </div>
        </aside>

        {/* RIGHT PRODUCT LISTINGS GRID */}
        <div className="flex-1 space-y-6 w-full">
          {/* Active Filter Badges header */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center bg-slate-950 p-4 rounded-xl border border-brand-border">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Specs:</span>
              {searchQuery && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">
                  Search: "{searchQuery}"
                </span>
              )}
              {filterCategory !== "ALL" && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200 uppercase">
                  Category: {filterCategory}
                </span>
              )}
              {filterBrand !== "ALL" && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200 uppercase">
                  Brand: {filterBrand}
                </span>
              )}
              {filterScale !== "ALL" && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">
                  Scale: {filterScale}
                </span>
              )}
              {filterTerrain !== "ALL" && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">
                  Terrain: {filterTerrain}
                </span>
              )}
              {filterBuildType !== "ALL" && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">
                  Type: {filterBuildType}
                </span>
              )}
              {priceRange[1] < 150000 && (
                <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">
                  Under ₹{priceRange[1].toLocaleString('en-IN')}
                </span>
              )}
            </div>
          )}

          {/* Product grid or empty state */}
          {sortedProducts.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 py-20 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-orange flex items-center justify-center mx-auto text-brand-orange">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">No track rigs match your specifications</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your budget, clearing search queries, or exploring a different terrain configuration.
              </p>
              <button
                onClick={resetFilters}
                className="bg-brand-orange text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCardItem 
                  key={p.id}
                  p={p}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
