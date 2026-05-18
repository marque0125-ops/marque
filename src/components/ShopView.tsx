"use client";

import React from "react";
import { useMarqueStore } from "../store/store";
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

export default function ShopView() {
  const {
    products,
    setView,
    setSelectedProduct,
    searchQuery,
    setSearchQuery,
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
    addToCart
  } = useMarqueStore();

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
        <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
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
              className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange"
            />
          </div>

          {/* Filter Brand */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brand</label>
            <select 
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none"
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
              className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none"
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
              className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-brand-orange outline-none"
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
              {sortedProducts.map((p) => {
                const brand = BRANDS.find(b => b.id === p.brandId);
                const isWished = wishlist.includes(p.id);

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleProductClick(p)}
                    className="group cursor-pointer relative flex flex-col rounded-2xl border border-brand-border bg-slate-900/30 overflow-hidden hover:border-brand-orange hover:bg-slate-900/80 transition-all duration-300 shadow-lg hover:shadow-glow"
                  >
                    {/* Primary Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                      <img 
                        src={p.images[0]} 
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Scale and Speed Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-orange border border-brand-orange/30 uppercase tracking-wider">
                          {p.scale} Scale
                        </span>
                        <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                          {p.speedKmh}+ KM/H
                        </span>
                      </div>

                      {/* Wishlist button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 z-10 rounded-full bg-slate-950/80 p-2 border border-slate-800 text-slate-400 hover:text-brand-orange transition-colors"
                      >
                        <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
                      </button>

                      {/* Stock Badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        {p.stockQty === 0 ? (
                          <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            Out of stock
                          </span>
                        ) : p.stockQty < 3 ? (
                          <span className="rounded bg-brand-orange px-2 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider animate-pulse">
                            Only {p.stockQty} Left!
                          </span>
                        ) : (
                          <span className="rounded bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-green-400 uppercase tracking-wider">
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specifications detail text */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider font-display">
                            {brand?.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            SKU: {p.sku.slice(0, 8)}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      {/* Star rating and key spec */}
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-brand-border pt-2">
                        <span className="flex items-center gap-0.5 text-brand-gold">
                          <Star className="h-3 w-3 fill-brand-gold" />
                          {p.averageRating} ({p.reviewCount})
                        </span>
                        <span>{p.terrainType} • {p.buildType}</span>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center justify-between border-t border-brand-border pt-3">
                        <div>
                          <span className="text-[10px] text-slate-500 line-through block leading-none">
                            ₹{p.comparePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-base font-black text-brand-gold font-display leading-none block mt-1">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => handleQuickAdd(e, p)}
                          disabled={p.stockQty === 0}
                          className="rounded-lg bg-brand-orange text-black px-3 py-2 text-xs font-bold uppercase hover:bg-brand-gold disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
                        >
                          {p.stockQty === 0 ? "Out" : "Buy Rig"}
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
