"use client";

import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { BRANDS, Product } from "../data/mockData";
import {
  RotateCcw,
  SlidersHorizontal,
  Search,
  X,
  ChevronDown
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
    toggleWishlist,
    isLoading
  } = useProductStore();
  const {
    setView,
    setSelectedProduct
  } = useUIStore();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.variants[0], 1);
  };

  // 1. FILTER LOGIC
  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const brand = BRANDS.find(b => b.id === p.brandId);
      const matchBrand = brand ? brand.name.toLowerCase().includes(q) : false;
      const matchTerrain = p.terrainType.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand && !matchTerrain) return false;
    }
    if (filterBrand !== "ALL") {
      const brand = BRANDS.find(b => b.id === p.brandId);
      if (!brand || brand.slug !== filterBrand) return false;
    }
    if (filterCategory !== "ALL") {
      if (p.categoryId !== filterCategory) return false;
    }
    if (filterTerrain !== "ALL") {
      if (p.terrainType !== filterTerrain) return false;
    }
    if (filterScale !== "ALL") {
      if (p.scale !== filterScale) return false;
    }
    if (filterBuildType !== "ALL") {
      if (p.buildType !== filterBuildType) return false;
    }
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  // 2. SORT LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.averageRating - a.averageRating;
      case 'newest':
      default: return b.id.localeCompare(a.id);
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

  // Shared filter controls (used in sidebar and bottom sheet)
  const FilterControls = () => (
    <div className="flex flex-col space-y-5">
      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Search</label>
        <input
          type="text"
          placeholder="e.g. brushless, 8s..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all"
        />
      </div>

      {/* Brand */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brand</label>
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none transition-all"
        >
          <option value="ALL">All Brands</option>
          {BRANDS.map(b => (
            <option key={b.id} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Scale */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Chassis Scale</label>
        <select
          value={filterScale}
          onChange={(e) => setFilterScale(e.target.value)}
          className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none transition-all"
        >
          <option value="ALL">All Scales</option>
          <option value="1:8">1:8 (Giant Heavy Duty)</option>
          <option value="1:10">1:10 (Standard Basher)</option>
          <option value="1:12">1:12 (Pocket Rocket)</option>
          <option value="1:14">1:14 (Mini Basher)</option>
          <option value="1:24">1:24 (Micro Scale Crawler)</option>
        </select>
      </div>

      {/* Terrain */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Terrain</label>
        <select
          value={filterTerrain}
          onChange={(e) => setFilterTerrain(e.target.value)}
          className="w-full rounded-xl border border-brand-border/50 bg-slate-950/50 py-2.5 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none transition-all"
        >
          <option value="ALL">All Terrains</option>
          <option value="Off-Road">Off-Road (Basher)</option>
          <option value="On-Road">On-Road (Speed Runs)</option>
          <option value="Crawler">Crawler (Rock Trails)</option>
          <option value="Drift">Drift (Hairpin Slides)</option>
        </select>
      </div>

      {/* Build Type */}
      <div className="space-y-1.5">
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

      {/* Price */}
      <div className="space-y-1.5">
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
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-8 pb-12">

      {/* Page Header */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">RC Performance Inventory</span>
          <h1 className="font-display text-xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1">
            {filterBrand !== "ALL" ? `${filterBrand} Garage` : "The Main Track"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {sortedProducts.length} models available
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-brand-border bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 focus:border-brand-orange outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── MOBILE: Sticky Search + Filter Trigger Bar ── */}
      <div className="flex lg:hidden items-center gap-2 sticky top-20 z-30 bg-brand-dark/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-brand-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-brand-border/60 bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-brand-orange transition-all"
          />
        </div>
        <button
          onClick={() => setShowMobileFilters(true)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold uppercase whitespace-nowrap transition-all ${activeFiltersCount > 0 ? 'bg-brand-orange border-brand-orange text-black' : 'border-brand-border bg-slate-900 text-slate-300'}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Desktop Sidebar — hidden on mobile */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col rounded-2xl border border-brand-border/50 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl p-6 space-y-6 sticky top-28 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-20 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-orange" />
              Tune Filters
            </span>
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} className="text-[10px] text-brand-orange font-bold uppercase hover:underline flex items-center gap-0.5">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
          <FilterControls />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-4 w-full">
          {/* Active filter badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center bg-slate-950 p-3 rounded-xl border border-brand-border">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active:</span>
              {searchQuery && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">"{searchQuery}"</span>}
              {filterBrand !== "ALL" && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200 uppercase">{filterBrand}</span>}
              {filterScale !== "ALL" && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">{filterScale}</span>}
              {filterTerrain !== "ALL" && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">{filterTerrain}</span>}
              {filterBuildType !== "ALL" && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">{filterBuildType}</span>}
              {priceRange[1] < 150000 && <span className="rounded bg-slate-900 border border-brand-border px-2 py-0.5 text-[10px] text-slate-200">Under ₹{priceRange[1].toLocaleString('en-IN')}</span>}
              <button onClick={resetFilters} className="ml-auto text-[10px] text-brand-orange font-bold flex items-center gap-0.5 hover:underline">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          )}

          {/* Products or empty state */}
          {sortedProducts.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 py-20 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-orange flex items-center justify-center mx-auto text-brand-orange">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">No rigs match your specs</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try widening your budget, clearing search queries, or exploring a different terrain.</p>
              <button onClick={resetFilters} className="bg-brand-orange text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {isLoading && products.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-slate-950/50 p-4 min-h-[300px] animate-pulse">
                    <div className="h-4 w-16 bg-slate-800 rounded mb-4" />
                    <div className="relative mb-6 h-32 w-full overflow-hidden rounded-xl bg-slate-800" />
                    <div className="h-5 w-3/4 bg-slate-800 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-slate-800 rounded mb-4" />
                    <div className="h-8 w-full bg-slate-800 rounded-lg" />
                  </div>
                ))
              ) : (
                sortedProducts.map((p) => (
                  <ProductCardItem
                    key={p.id}
                    p={p}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    onProductClick={handleProductClick}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE FILTER BOTTOM SHEET ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[90] flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Sheet */}
          <div className="relative bg-slate-950 border-t border-brand-border rounded-t-3xl shadow-2xl flex flex-col max-h-[85dvh]">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-700" />
            </div>
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border">
              <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-orange" />
                Tune Filters
              </span>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-0.5">
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                )}
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Scrollable filter body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <FilterControls />
            </div>
            {/* Apply button */}
            <div className="px-5 py-4 border-t border-brand-border">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full rounded-xl bg-brand-orange text-black font-black uppercase py-3 text-sm tracking-wider hover:bg-brand-gold transition-colors"
              >
                Show {sortedProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
