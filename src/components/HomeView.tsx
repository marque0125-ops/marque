"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { BRANDS, Product, RCGuide } from "../data/mockData";
import {
  Trophy,
  Flame,
  Compass,
  Zap,
  ChevronRight,
  Star,
  ShieldAlert,
  BookOpen,
  Map,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  Search,
  Sliders,
  Car,
  Settings,
  CheckCircle2,
  Quote,
  Layers,
  HelpCircle,
  Truck,
  Heart,
  User
} from "lucide-react";
import { ProductCardItem } from "./ProductCardItem";

export default function HomeView() {
  const { addToCart } = useCartStore();
  const {
    categories,
    products,
    reviews,
    wishlist,
    toggleWishlist,
    setFilterBrand,
    setFilterTerrain,
    setSearchQuery,
    setFilterCategory,
    resetFilters,
    guides
  } = useProductStore();
  const {
    setSelectedProduct,
    heroBanners,
    promoBanners,
    heroTitleLine1,
    heroTitleLine2,
    heroDescription,
    brandsBadge, brandsTitle, brandsSubtitle, brandsList,
    aboutBadge, aboutTitleLine1, aboutTitleLine2, aboutSubtitle, aboutDescription, aboutBullets, aboutImage, aboutImageOverlayTitle, aboutImageOverlaySubtitle,
    testimonialsBadge, testimonialsTitle, testimonialsList
  } = useUIStore();
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);

  useEffect(() => {
    if (!heroBanners || heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners]);

  useEffect(() => {
    if (!promoBanners || promoBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % promoBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promoBanners]);

  const [activeGuide, setActiveGuide] = useState<RCGuide | null>(null);

  // Impel tabbed search panel states
  const [searchQueryLocal, setSearchQueryLocal] = useState("");
  const [selectedBrandLocal, setSelectedBrandLocal] = useState("ALL");
  const [selectedTerrainLocal, setSelectedTerrainLocal] = useState("ALL");

  // Impel "Explore All Vehicles" tab state
  const [exploreTab, setExploreTab] = useState<'ALL' | 'Off-Road' | 'On-Road' | 'Crawler' | 'Drift'>('ALL');

  // Impel testimonials slider index simulator
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleBrandClick = (slug: string) => {
    resetFilters();
    setFilterBrand(slug);
    setSelectedProduct(null);
    router.push('/shop');
  };

  const handleCategoryClick = (categoryId: string) => {
    resetFilters();
    setFilterCategory(categoryId);
    setSelectedProduct(null);
    router.push('/shop');
  };

  const handleTerrainClick = (terrain: 'On-Road' | 'Off-Road' | 'Crawler' | 'Drift') => {
    setFilterTerrain(terrain);
    setSelectedProduct(null);
    router.push('/shop');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    router.push(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.variants[0], 1);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchQueryLocal);
    setFilterBrand(selectedBrandLocal);
    setFilterTerrain(selectedTerrainLocal);
    setSelectedProduct(null);
    router.push('/shop');
  };

  // Filter explore rigs dynamically
  const exploreFilteredProducts = products
    .filter((p) => {
      if (exploreTab === "ALL") return p.isActive;
      return p.isActive && p.terrainType === exploreTab;
    })
    .slice(0, 6); // Impel displays 6 items in this showcase

  return (

    <div className="space-y-8 sm:space-y-24 pb-12 sm:pb-24">
      {/* ==================== 6.5 STANDALONE PROMO BANNER ==================== */}
      {promoBanners && promoBanners.length > 0 && (
        <section className="relative w-screen ml-[calc(50%-50vw)] -mt-10 sm:mt-0 overflow-hidden group aspect-[2.5/1] bg-slate-950">
          {promoBanners.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => {
                if (slide.productId) {
                  const product = products.find(p => p.id === slide.productId);
                  if (product) {
                    setSelectedProduct(product);
                    router.push(`/product/${product.slug}`);
                    window.scrollTo(0, 0);
                  }
                }
              }}
              className={`absolute inset-0 transition-opacity duration-1000 ${slide.productId ? 'cursor-pointer' : ''} ${idx === currentPromoSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              {/* Full Width Banner Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.titleMain || "Promo Banner"}
                fill
                sizes="(max-width: 1152px) 100vw, 1152px"
                priority={idx === 0}
                quality={80}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* 3D Animated Overlay Button (Positioned Bottom Left) - Only show if there is text */}
              {(slide.badgeText || slide.titleMain) && (
                <div 
                  className="absolute bottom-4 left-6 sm:bottom-8 sm:left-12 z-20"
                >
                  <div
                    className="group/btn relative flex flex-col items-center justify-center p-[2px] rounded-2xl bg-gradient-to-br from-brand-orange via-red-500 to-brand-gold shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(249,115,22,0.7)] hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-[14px] bg-slate-950/80 backdrop-blur-md relative overflow-hidden">
                      {/* Inner ambient glow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/20 to-transparent opacity-80 pointer-events-none" />
                      
                      {/* Hover light sweep effect */}
                      <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transform -translate-x-full group-hover/btn:translate-x-full transition-all duration-1000 ease-in-out rotate-45 pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center gap-0.5 transform group-hover/btn:scale-110 transition-transform duration-500 ease-out text-center">
                        {slide.badgeText && (
                          <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-orange to-brand-gold drop-shadow-md uppercase leading-none">
                            {slide.badgeText}
                          </span>
                        )}
                        {slide.titleMain && (
                          <span className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-[0.2em] drop-shadow-lg mt-1">
                            {slide.titleMain}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Slider Dots */}
          {promoBanners.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-2 z-20">
              {promoBanners.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to promo slide ${idx + 1}`}
                  onClick={() => setCurrentPromoSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentPromoSlide ? "bg-brand-orange w-6" : "bg-black/50 w-2 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ==================== 1. HERO SPOTLIGHT BANNER ==================== */}
      <section className="relative carbon-overlay overflow-hidden rounded-3xl border border-brand-border bg-slate-950 py-12 px-8 sm:px-12 lg:px-16 lg:py-16">
        {/* Neon Orange & Gold Background Radial Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (Copy and CTA) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-tight text-white leading-none">
              {heroTitleLine1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">
                {heroTitleLine2}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <button
                onClick={() => router.push('/new-arrival')}
                className="group flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-normal text-white sm:text-black hover:bg-brand-gold hover:shadow-glow transition-all duration-300 uppercase tracking-wider"
              >
                WATCH UNBOXING VIDEOS 👇
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/racing')}
                className="rounded-xl border border-brand-border bg-slate-900/60 hover:bg-slate-900 px-6 py-3.5 text-sm font-normal text-white hover:border-brand-orange transition-all duration-300 uppercase tracking-wider"
              >
                WATCH LIVE RACING & BASHING 🎬
              </button>
            </div>
          </div>

          {/* Right Column — hidden on mobile */}
          <div className="hidden lg:flex lg:col-span-5 relative w-full justify-center items-center h-[350px] lg:h-[400px] cursor-pointer">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-brand-orange to-brand-gold opacity-30 blur-lg pointer-events-none"></div>
            <div className="relative w-full h-full rounded-3xl border border-white/5 overflow-hidden bg-slate-950 group shadow-2xl">
              {heroBanners.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.titleMain || "Banner"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={idx === 0}
                    quality={80}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 p-3 rounded-xl bg-slate-950/80 backdrop-blur border border-white/10 text-right">
                    <span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">{slide.badgeText}</span>
                    <span className="font-display text-xl font-normal text-brand-gold leading-none">{slide.titleMain}</span>
                    <span className="text-[9px] text-slate-300">{slide.titleSub}</span>
                  </div>
                </div>
              ))}

              {/* Slider Dots */}
              {heroBanners.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                  {heroBanners.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Go to hero slide ${idx + 1}`}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-brand-orange w-6" : "bg-white/30 w-2 hover:bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* ==================== MOBILE QUICK SEARCH (mobile only) ==================== */}
      <div className="block sm:hidden -mt-2">
        <button
          onClick={() => { setSelectedProduct(null); router.push('/shop'); }}
          className="w-full flex items-center gap-3 rounded-2xl border border-brand-border/60 bg-slate-900/80 px-4 py-3.5 text-sm text-slate-400 text-left"
        >
          <Search className="h-4 w-4 text-slate-500 shrink-0" />
          Search crawlers, bashers, accessories...
          <span className="ml-auto rounded-lg bg-brand-orange px-3 py-1 text-[10px] font-normal text-white sm:text-black uppercase shrink-0">Go</span>
        </button>
      </div>

      {/* ==================== 3. BROWSE BY CATEGORY ==================== */}
      <section className="space-y-6 sm:space-y-12 sm:py-8">
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-orange uppercase tracking-widest">
            <Sliders className="h-4 w-4" />
            Shop by Category
          </div>
          <h2 className="font-display text-2xl sm:text-5xl font-normal  tracking-tight text-white">
            Explore our RC collections
          </h2>
        </div>

        {/* Mobile: 2-column grid */}
        <div className="grid sm:hidden grid-cols-2 gap-x-6 gap-y-8 px-4 pt-2 pb-6">
          {categories.map((cat, idx) => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="w-[140px] h-[140px] rounded-full bg-white border border-slate-800 shadow-sm overflow-hidden flex items-center justify-center relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="140px"
                    className="object-contain p-4"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-base font-normal text-white block leading-tight">{cat.name}</span>
                  <span className="text-xs text-slate-400 block">{count} products</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop: full grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-12 w-full max-w-7xl mx-auto px-4 pt-4">
          {categories.map((cat, idx) => {
            const count = products.filter(p => p.categoryId === cat.id).length;

            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center text-center cursor-pointer space-y-4"
              >
                {/* Circular Image Container */}
                <div className="relative w-full aspect-square rounded-full border border-white/20 bg-white group-hover:border-brand-orange shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="font-display text-sm sm:text-base font-normal text-white group-hover:text-brand-orange transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    {count} {count === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== BRANDS INFINITY SCROLLING MARQUEE ==================== */}
      <section className="space-y-6 overflow-hidden">
        {/* Style block for reverse marquee animation keyframe */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 30s linear infinite;
          }
          .animate-marquee-normal {
            animation: marquee 30s linear infinite;
          }
        `}} />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-gold uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            {brandsBadge}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white tracking-tight">
            {brandsTitle}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            {brandsSubtitle}
          </p>
        </div>

        {/* Outer Scrolling Container */}
        <div className="relative space-y-8 py-6 pointer-events-auto">
          {/* Parallax Left-scrolling ribbon */}
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="flex gap-8 shrink-0 animate-marquee-normal hover:[animation-play-state:paused] py-2">
              {brandsList.concat(brandsList).map((brand, idx) => {
                let glowColor = "rgba(239, 68, 68, 0.25)"; // Default Red
                if (brand.name === "ARRMA") glowColor = "rgba(220, 38, 38, 0.3)";
                if (brand.name === "RLAARLO") glowColor = "rgba(34, 197, 94, 0.3)";
                if (brand.name === "MJX") glowColor = "rgba(234, 179, 8, 0.3)";
                if (brand.name === "FMS") glowColor = "rgba(16, 185, 129, 0.3)";
                if (brand.name === "MN MODEL") glowColor = "rgba(245, 158, 11, 0.3)";
                if (brand.name === "HOT WHEELS") glowColor = "rgba(249, 115, 22, 0.3)";

                return (
                  <div
                    key={idx}
                    onClick={() => handleBrandClick(brand.name.toLowerCase().replace(' ', '-'))}
                    className="group cursor-pointer flex flex-col items-center justify-center relative w-48 shrink-0 transition-all duration-300 hover:-translate-y-1.5 py-4"
                  >
                    {/* Unique Ambient Pulsing Radial Backglow */}
                    <div
                      className="absolute h-28 w-28 rounded-full blur-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundColor: glowColor }}
                    />

                    {/* Huge Floating Logo Image */}
                    <div className="relative z-10 h-20 w-36 flex items-center justify-center">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} Logo`}
                        fill
                        sizes="144px"
                        className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                      />
                    </div>

                    {/* Minimalist Subtext */}
                    <div className="relative z-10 mt-3 text-center space-y-0.5">
                      <span className="font-display text-xs font-normal tracking-widest text-slate-400 group-hover:text-white transition-colors block uppercase">
                        {brand.name}
                      </span>
                      <span className="text-[9px] text-slate-600 font-normal uppercase tracking-wider group-hover:text-brand-orange transition-colors flex items-center justify-center gap-1">
                        {brand.country} {brand.flag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 6. EXPLORE ALL VEHICLES ==================== */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-brand-border pb-4 sm:pb-6">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[10px] text-brand-gold font-normal uppercase tracking-widest block">
              Direct Garage Clearance
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-normal uppercase text-white tracking-tight">
              Featured Products
            </h2>
          </div>

          {/* Tabs — scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', name: 'All' },
              { id: 'Off-Road', name: 'Off-Road' },
              { id: 'On-Road', name: 'On-Road' },
              { id: 'Crawler', name: 'Crawler' },
              { id: 'Drift', name: 'Drift' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setExploreTab(tab.id as any)}
                className={`shrink-0 rounded-lg px-3 sm:px-4 py-2 text-xs font-normal uppercase tracking-wider transition-all duration-300 ${exploreTab === tab.id
                  ? "bg-brand-orange text-white sm:text-black font-normal shadow-glow"
                  : "border border-brand-border bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-orange"
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {exploreFilteredProducts.map((p) => (
            <ProductCardItem
              key={p.id}
              p={p}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              onProductClick={handleProductClick}
            />
          ))}
        </div>

        {/* View All button */}
        <div className="text-center pt-2">
          <button
            onClick={() => { resetFilters(); router.push('/shop'); }}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-slate-900 hover:border-brand-orange hover:bg-slate-950 px-8 py-3.5 text-sm font-normal uppercase tracking-wider text-white transition-all"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>



      {/* ==================== 4. DUAL CALL-TO-ACTION CARDS ==================== */}
      <section className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Card 1: Ready-To-Run */}
        <div className="group relative rounded-3xl overflow-hidden border border-brand-orange/20 bg-slate-950 hover:border-brand-orange transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] flex flex-col justify-between min-h-[260px] cursor-pointer" onClick={() => { setFilterBrand("ALL"); router.push('/shop'); }}>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-orange/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-orange/30 transition-colors duration-500" />

          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-normal text-brand-orange uppercase border border-brand-orange/30 px-3 py-1 rounded-full bg-brand-orange/10 tracking-widest inline-block shadow-sm">
                Casual & Expert Drivers
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-normal uppercase tracking-tight text-white group-hover:text-brand-orange transition-colors duration-300">
                Looking For a Ready-To-Run Rig?
              </h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Ready-To-Run (RTR) models come fully assembled and painted. Just plug in your battery and shred the tarmac!
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 text-sm font-normal uppercase text-white sm:text-black bg-brand-orange group-hover:bg-brand-gold px-6 py-3.5 rounded-xl transition-all duration-300 tracking-wider w-fit shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              Explore RTR Garage <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Hardcore Builders */}
        <div className="group relative rounded-3xl overflow-hidden border border-brand-gold/20 bg-slate-950 hover:border-brand-gold transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col justify-between min-h-[260px] cursor-pointer" onClick={() => { setFilterBrand("ALL"); router.push('/shop'); }}>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-gold/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-gold/30 transition-colors duration-500" />

          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-normal text-brand-gold uppercase border border-brand-gold/30 px-3 py-1 rounded-full bg-brand-gold/10 tracking-widest inline-block shadow-sm">
                Scale Builders & Tuners
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-normal uppercase tracking-tight text-white group-hover:text-brand-gold transition-colors duration-300">
                Want to Build Custom Kits?
              </h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                We stock raw chassis kits, carbon fiber upgrade parts, high-torque servos, and brushless motors for ultimate tuners.
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 text-sm font-normal uppercase text-white sm:text-black bg-brand-gold group-hover:bg-brand-orange px-6 py-3.5 rounded-xl transition-all duration-300 tracking-wider w-fit shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              Browse Tuning Kits <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 5. WELCOME ABOUT SECTION ==================== */}
      <section className="hidden sm:block relative max-w-6xl mx-auto py-16 sm:py-24 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <span className="flex items-center gap-3 text-xs text-brand-orange font-normal uppercase tracking-[0.2em]">
                <span className="w-8 h-px bg-brand-orange/50"></span>
                {aboutBadge}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-tight text-white leading-[1.05]">
                {aboutTitleLine1}<br />{aboutTitleLine2}<br />
                <span className="text-slate-400 font-normal tracking-normal normal-case text-2xl sm:text-3xl block mt-4">
                  {aboutSubtitle}
                </span>
              </h2>
            </div>

            <p className="text-slate-300 text-base leading-relaxed max-w-lg">
              {aboutDescription}
            </p>

            <ul className="space-y-4 pt-2">
              {aboutBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 bg-brand-orange rounded-full p-0.5 shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-black" />
                  </div>
                  <span className="text-sm text-slate-200">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={() => { setFilterBrand("ALL"); router.push('/shop'); }}
                className="group inline-flex items-center justify-center gap-3 text-sm font-normal uppercase text-white bg-transparent border border-white/20 hover:border-brand-orange hover:bg-brand-orange hover:text-white sm:text-black px-8 py-4 rounded-full transition-all duration-300 tracking-widest"
              >
                Explore Vehicles <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative w-full aspect-square sm:aspect-[4/3] rounded-[2rem] overflow-hidden group border border-white/5 shadow-2xl">
            <Image
              src={aboutImage}
              alt="Premium RC Engineering"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 z-10">
              <div className="inline-flex items-center gap-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="text-white font-normal text-sm sm:text-base tracking-wide">{aboutImageOverlayTitle}</p>
                  <p className="text-slate-300 text-xs sm:text-sm font-normal">{aboutImageOverlaySubtitle}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 7. STATISTICS COUNTER PANEL ==================== */}
      <section className="hidden sm:block relative rounded-3xl border border-brand-border bg-slate-950 py-10 px-6 max-w-6xl mx-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-brand-gold/5 opacity-50" />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-border">
          {[
            { value: "150+", label: "Speed Rigs In-Stock" },
            { value: "24K+", label: "PIN Codes Covered" },
            { value: "98.7%", label: "Happy Basher Reviews" },
            { value: "1-Day", label: "Local Hub Dispatch" }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1.5 pt-6 md:pt-0">
              <span className="font-display text-3xl sm:text-4xl font-normal text-brand-orange block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-normal tracking-widest block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. WHY CHOOSE US? ==================== */}
      <section className="hidden sm:block space-y-10 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-gold font-normal uppercase tracking-widest block">
            Why Choose MARQUE?
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-normal uppercase text-white tracking-tight">
            We Set The Performance Standard
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Hobby-grade remote control is a mechanical art. We structure our India operations to provide a stress-free experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Elite International Brands",
              desc: "Official distribution stock of Traxxas, Arrma, FMS, and Rlaarlo machines.",
              icon: Car
            },
            {
              title: "Transparent GST Invoicing",
              desc: "Standard 18% inclusive GST pricing on all parts, accessories, and RTR vehicles.",
              icon: Layers
            },
            {
              title: "Expert Technical Garage",
              desc: "Live part cross-referencing and diagnostic advice from veteran RC pilots.",
              icon: Settings
            },
            {
              title: "Fast Indian Logistics",
              desc: "1-Day dispatch from Madipakkam, Chennai hub covering 24,000+ PIN codes.",
              icon: Truck
            }
          ].map((perk, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 space-y-4 hover:border-brand-orange hover:bg-slate-950 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-950 border border-brand-border flex items-center justify-center text-brand-orange">
                <perk.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display text-sm font-normal text-white uppercase tracking-tight">
                  {perk.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 9. TESTIMONIALS ==================== */}
      <section className="hidden sm:block relative rounded-3xl border border-brand-border bg-slate-950 py-12 px-6 sm:px-12 relative overflow-hidden text-center max-w-4xl mx-auto shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-brand-orange font-normal uppercase tracking-widest block">
              {testimonialsBadge}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-normal uppercase text-white">
              {testimonialsTitle}
            </h2>
          </div>

          {/* Testimonial Active Slide */}
          <div className="space-y-6">
            <Quote className="mx-auto h-8 w-8 text-brand-orange/30 rotate-180" />
            <blockquote className="font-display text-sm sm:text-lg font-normal text-slate-200 leading-relaxed italic max-w-2xl mx-auto">
              "{testimonialsList[testimonialIndex]?.quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-brand-border text-brand-orange shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="font-normal text-white block text-xs sm:text-sm">
                  {testimonialsList[testimonialIndex]?.name}
                </span>
                <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider block">
                  {testimonialsList[testimonialIndex]?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial Slide Buttons */}
          <div className="flex justify-center gap-2 pt-2">
            {testimonialsList.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to testimonial ${idx + 1}`}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === testimonialIndex ? "bg-brand-orange w-6" : "bg-brand-orange/20 hover:bg-brand-orange/50 w-2"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 10. ARTICLES ==================== */}
      <section className="hidden sm:block space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-6">
          <div className="space-y-2">
            <span className="text-[10px] text-brand-gold font-normal uppercase tracking-widest block">
              Knowledge Database
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white tracking-tight">
              Recent News & Articles
            </h2>
          </div>
          <span className="text-xs text-slate-400 uppercase font-normal tracking-widest">
            Hobby Garage Blog
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setActiveGuide(guide)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-brand-border bg-slate-950 flex flex-col justify-between hover:border-brand-orange hover:shadow-2xl transition-all duration-300"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900 border-b border-brand-border">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 border border-brand-border text-[8px] font-normal text-brand-orange uppercase px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  <span className="text-[9px] text-slate-500 font-normal block">{guide.readTime}</span>
                  <h3 className="font-display text-sm font-normal text-white group-hover:text-brand-orange transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-[10px] font-normal text-brand-orange uppercase tracking-widest flex items-center gap-1 group-hover:text-brand-gold transition-colors">
                  Read Article <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 11. GUIDE POPUP DETAIL DIALOG ==================== */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-brand-border bg-slate-950 p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              aria-label="Close Guide"
              onClick={() => setActiveGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <span className="text-[9px] text-brand-orange font-normal uppercase tracking-wider bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                {activeGuide.category} • {activeGuide.readTime}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-normal text-white leading-tight">
                {activeGuide.title}
              </h2>
              <div className="relative w-full h-56 rounded-xl border border-brand-border overflow-hidden">
                <Image
                  src={activeGuide.imageUrl}
                  alt={activeGuide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {activeGuide.content}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                onClick={() => setActiveGuide(null)}
                className="bg-brand-orange text-white sm:text-black px-5 py-2.5 rounded-lg text-xs font-normal uppercase hover:bg-brand-gold transition-colors"
              >
                Close tech guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
