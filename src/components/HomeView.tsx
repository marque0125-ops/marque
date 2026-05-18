"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useMarqueStore } from "../store/store";
import { BRANDS, RC_GUIDES, Product, RCGuide } from "../data/mockData";
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
  X
} from "lucide-react";

// Load our hyper-realistic client-side 3D WebGL engine dynamically with SSR disabled
const ThreeDShowcase = dynamic(() => import("./ThreeDShowcase"), { ssr: false });

export default function HomeView() {
  const {
    products,
    reviews,
    setView,
    setFilterBrand,
    setFilterTerrain,
    setSelectedProduct,
    addToCart,
    cart
  } = useMarqueStore();

  const [activeGuide, setActiveGuide] = useState<RCGuide | null>(null);

  // Take featured products
  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);

  // Take top brands
  const topBrands = BRANDS;

  const handleBrandClick = (slug: string) => {
    setFilterBrand(slug);
    setSelectedProduct(null);
    setView('shop');
  };

  const handleTerrainClick = (terrain: 'On-Road' | 'Off-Road' | 'Crawler' | 'Drift') => {
    setFilterTerrain(terrain);
    setSelectedProduct(null);
    setView('shop');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.variants[0], 1);
  };

  return (
    <div className="space-y-20 pb-20">

      {/* 1. HERO SPOTLIGHT BANNER */}
      <section className="relative carbon-overlay overflow-hidden rounded-3xl border border-brand-border bg-slate-950 py-24 px-8 sm:px-16 lg:px-24">
        {/* Neon Orange & Gold Background Radial Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5" />
            Spotlight: Traxxas X-Maxx 8S
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            BRUTAL SPEED.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">
              UNMATCHED DURABILITY.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience 130+ km/h runs, fully waterproof brushless motors, and aircraft-grade carbon fiber/alloy constructs. MARQUE brings the world's most extreme RC brands to Indian bashers and track racers.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => { setFilterBrand('ALL'); setView('shop'); }}
              className="group flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-bold text-black hover:bg-brand-gold hover:shadow-glow transition-all duration-300 uppercase tracking-wider"
            >
              Explore Track Rigs
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleBrandClick('traxxas')}
              className="rounded-xl border border-brand-border bg-slate-900/60 hover:bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:border-brand-orange transition-all duration-300 uppercase tracking-wider"
            >
              Shop Traxxas VXL
            </button>
          </div>
        </div>

        {/* Floating Accent Specifications Badge */}
        <div className="absolute bottom-8 right-8 hidden xl:flex flex-col items-end gap-1.5 p-4 rounded-2xl glass-panel text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Top Velocity Record</span>
          <span className="font-display text-3xl font-black text-brand-gold leading-none">134+ KM/H</span>
          <span className="text-[10px] text-slate-400">Arrma Infraction 6S BLX</span>
        </div>
      </section>

      {/* INTERACTIVE 3D SHOWROOM & DRIVING SIMULATOR */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive 3D Showroom & Driving Arena
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            EXPERIENCE THE ULTRA-REALISM
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Rotate the chassis, choose custom metallic finishes, or click to slide off the body shell to inspect brushless internals. Switch to **Drive Mode** (WASD / Arrows) to steer and drift on our simulated physics sandbox!
          </p>
        </div>

        <div className="rounded-3xl border border-brand-border bg-slate-950/80 overflow-hidden shadow-glow">
          <ThreeDShowcase />
        </div>
      </section>

      {/* 2. TERRAIN-BASED FILTER GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Choose Your Battlefield
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Curated rigs built explicitly for the dirt, paved high-speed circuits, or technical rock trails.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Off-Road', icon: Trophy, label: 'Monster Trucks & Buggies', color: 'from-orange-600 to-red-600', desc: 'Crush fields, ramps, and sand dunes.' },
            { name: 'On-Road', icon: Zap, label: 'Street Speed & High Speed Pulls', color: 'from-blue-600 to-indigo-600', desc: 'Precision tarmac grip & insane highway blasts.' },
            { name: 'Crawler', icon: Compass, label: 'Technical Trial & Scale crawling', color: 'from-green-600 to-emerald-600', desc: 'Low-gear torque for rock piles and scale realism.' },
            { name: 'Drift', icon: Sparkles, label: 'Slick Slide & Gyro-locked control', color: 'from-amber-600 to-yellow-600', desc: 'Oversteer masteries & perfect hairpin slides.' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleTerrainClick(item.name as any)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-brand-border bg-slate-900/40 p-6 hover:border-brand-orange hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-glow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-orange group-hover:bg-brand-orange group-hover:text-black transition-all">
                <item.icon className="h-5 w-5 stroke-[2.5]" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mt-4">{item.name}</h3>
              <p className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">{item.label}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHOP BY BRAND LOGO GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              The Legend Board
            </h2>
            <p className="text-slate-400 text-xs">
              Direct authorized inventory of the absolute highest-performance RC brands on Earth.
            </p>
          </div>
          <button
            onClick={() => { setFilterBrand('ALL'); setView('shop'); }}
            className="text-xs text-brand-orange font-bold uppercase hover:underline flex items-center gap-1"
          >
            All Brands <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {topBrands.map(b => (
            <div
              key={b.id}
              onClick={() => handleBrandClick(b.slug)}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-brand-border bg-slate-900/30 p-4 flex flex-col items-center justify-center text-center hover:border-brand-orange hover:bg-slate-900/90 transition-all duration-300"
            >
              <div className="h-10 w-full flex items-center justify-center filter grayscale group-hover:grayscale-0 contrast-125 transition-all">
                {/* Brand Name Title Styled Premium instead of actual image, or standard logo visual */}
                <span className="font-display text-base font-black tracking-widest text-slate-400 group-hover:text-brand-orange transition-colors uppercase">
                  {b.name}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                {b.country}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCT SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              Featured Speed Machines
            </h2>
            <p className="text-slate-400 text-xs">
              Out-of-the-box VXL power and detailed scale rigs highly requested by Indian hobbyists.
            </p>
          </div>
          <button
            onClick={() => { setFilterBrand('ALL'); setView('shop'); }}
            className="text-xs text-brand-orange font-bold uppercase hover:underline flex items-center gap-1"
          >
            View Full Garage <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const variant = p.variants[0];
            const brand = BRANDS.find(b => b.id === p.brandId);

            return (
              <div
                key={p.id}
                onClick={() => handleProductClick(p)}
                className="group cursor-pointer relative flex flex-col rounded-2xl border border-brand-border bg-slate-900/30 overflow-hidden hover:border-brand-orange hover:bg-slate-900/80 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Accent Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-orange border border-brand-orange/30 uppercase tracking-wider">
                      {p.scale} Scale
                    </span>
                    <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                      {p.speedKmh}+ KM/H
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="rounded-full bg-slate-950/80 p-1.5 text-xs text-brand-gold font-bold flex items-center gap-0.5 border border-slate-800">
                      <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                      {p.averageRating}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest font-display">
                      {brand?.name}
                    </span>
                    <h3 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Specifications badges row */}
                    <div className="flex gap-2 text-[9px] font-bold text-slate-400 border-t border-brand-border pt-2.5">
                      <span>{p.terrainType}</span>
                      <span>•</span>
                      <span>{p.buildType} (Ready-to-Race)</span>
                    </div>

                    {/* Price and Cart */}
                    <div className="flex items-center justify-between border-t border-brand-border pt-3">
                      <div>
                        <span className="text-[10px] text-slate-500 line-through block">
                          ₹{p.comparePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-base font-black text-brand-gold font-display">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, p)}
                        className="rounded-lg bg-brand-orange text-black px-3 py-1.5 text-xs font-bold uppercase hover:bg-brand-gold transition-colors"
                      >
                        Buy Rig
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. EXPERT RC GUIDES */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-widest">
            <BookOpen className="h-4 w-4" />
            Curated Hobbyist Guides
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            MARQUE Tech Hub
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            RC is more than just driving — it's a deep hobby. Learn lipo safety, scale comparisons, and build custom speedruns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RC_GUIDES.map(guide => (
            <div
              key={guide.id}
              onClick={() => setActiveGuide(guide)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-brand-border bg-slate-900/30 flex flex-col justify-between hover:border-brand-orange transition-all duration-300"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 border border-brand-border text-[9px] font-bold text-brand-orange uppercase px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold block">{guide.readTime}</span>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-brand-orange transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1 group-hover:text-brand-gold transition-colors">
                  Read Article <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. IMMERSIVE CUSTOMER REVIEW CAROUSEL */}
      <section className="rounded-3xl border border-brand-border bg-slate-900/10 py-12 px-6 sm:px-12 relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-brand-gold text-brand-gold" />
            ))}
          </div>

          {/* Testimonial text from list */}
          <div className="space-y-4">
            <blockquote className="font-display text-lg sm:text-2xl font-medium text-slate-200 leading-relaxed italic">
              "Purchased the Solar Flare Orange X-Maxx and it has been absolute insanity. Handled rocky terrains in Ooty and water streams effortlessly. The self-righting works perfectly when it rolls over on high grass. Unbelievable construction and raw power!"
            </blockquote>
            <div>
              <span className="font-bold text-white block text-sm sm:text-base">Vikram Malhotra</span>
              <span className="text-xs text-brand-orange font-bold uppercase tracking-widest">Verified Traxxas X-Maxx Owner • Chennai</span>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE POPUP DETAIL DIALOG */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-brand-border bg-slate-950 p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setActiveGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                {activeGuide.category} • {activeGuide.readTime}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
                {activeGuide.title}
              </h2>
              <img
                src={activeGuide.imageUrl}
                alt={activeGuide.title}
                className="w-full h-56 object-cover rounded-xl border border-brand-border"
              />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {activeGuide.content}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                onClick={() => setActiveGuide(null)}
                className="bg-brand-orange text-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-brand-gold transition-colors"
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
