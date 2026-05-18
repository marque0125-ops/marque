"use client";

import React, { useState } from "react";
import { useMarqueStore } from "../store/store";
import { BRANDS } from "../data/mockData";
import { 
  ShoppingBag, 
  User, 
  Settings, 
  Search, 
  Heart, 
  Bell, 
  Car, 
  AlertTriangle,
  X 
} from "lucide-react";

export default function Header() {
  const {
    currentView,
    setView,
    cart,
    wishlist,
    lowStockAlerts,
    clearLowStockAlerts,
    searchQuery,
    setSearchQuery,
    setFilterBrand,
    setSelectedProduct,
    isAuthenticated
  } = useMarqueStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const handleBrandClick = (slug: string) => {
    setFilterBrand(slug);
    setSelectedProduct(null);
    setView('shop');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedProduct(null);
    setView('shop');
    setShowSearchBox(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/85 backdrop-blur-md">
      {/* Dynamic Promotion Ticker */}
      <div className="w-full bg-gradient-to-r from-brand-orange to-brand-gold py-1 text-center text-xs font-bold uppercase tracking-wider text-black">
        ⚡ Extreme 8S Brushless Action • GST-Inclusive Prices • Free Shipping Above ₹10,000 ⚡
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { setSelectedProduct(null); setView('home'); }} 
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-black shadow-glow">
              <Car className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display text-2xl font-black uppercase tracking-tighter text-white">
                MARQUE
              </span>
              <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange block leading-none">
                RC INDIA
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <button 
              onClick={() => { setSelectedProduct(null); setView('home'); }}
              className={`hover:text-brand-orange transition-colors ${currentView === 'home' ? 'text-brand-orange font-bold' : 'text-slate-300'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setView('shop'); }}
              className={`hover:text-brand-orange transition-colors ${currentView === 'shop' ? 'text-brand-orange font-bold' : 'text-slate-300'}`}
            >
              Catalog
            </button>
            
            {/* Brands Mega-menu dropdown */}
            <div className="relative group py-2">
              <span className="cursor-pointer text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-1">
                Shop Brands
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-brand-border bg-slate-950 p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 gap-2 z-50">
                {BRANDS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleBrandClick(b.slug)}
                    className="flex flex-col items-start p-2 rounded-lg hover:bg-slate-900 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-200">{b.name}</span>
                    <span className="text-[9px] text-slate-500">{b.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Search bar middle */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex relative max-w-md w-full items-center"
          >
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search legendary crawlers, bashers, street racers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-brand-border bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 outline-none transition-all focus:border-brand-orange focus:bg-slate-900/90 focus:shadow-glow"
            />
          </form>

          {/* Icons Right */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="p-2 text-slate-300 hover:text-brand-orange transition-colors lg:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => { setSelectedProduct(null); setView('shop'); }}
              className="relative p-2 text-slate-300 hover:text-brand-orange transition-colors hidden sm:block"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-black text-black">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Low stock Warning alerts indicator */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors ${lowStockAlerts.length > 0 ? 'text-brand-gold animate-bounce' : 'text-slate-300 hover:text-brand-orange'}`}
              >
                <Bell className="h-5 w-5" />
                {lowStockAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
                )}
              </button>

              {/* Notification Overlay Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-xl border border-brand-border bg-slate-950 p-4 shadow-2xl z-50">
                  <div className="flex items-center justify-between border-b border-brand-border pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-brand-orange" />
                      Live Alerts ({lowStockAlerts.length})
                    </span>
                    {lowStockAlerts.length > 0 && (
                      <button 
                        onClick={clearLowStockAlerts}
                        className="text-[10px] text-slate-400 hover:text-brand-orange transition-colors underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                    {lowStockAlerts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        No critical system alerts. Inventory thresholds healthy.
                      </div>
                    ) : (
                      lowStockAlerts.map((alert, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border-l-2 border-brand-orange text-[11px] text-slate-300 leading-relaxed">
                          <p>{alert.message}</p>
                          <span className="text-[9px] text-brand-orange block mt-1 font-mono">{alert.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button 
              onClick={() => { setSelectedProduct(null); setView('cart'); }}
              className={`relative p-2.5 rounded-xl border transition-all ${currentView === 'cart' ? 'bg-brand-orange border-brand-orange text-black' : 'border-brand-border bg-slate-900 hover:border-brand-orange text-slate-300'}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-black text-black shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <button 
              onClick={() => { setSelectedProduct(null); setView('account'); }}
              className={`relative p-2.5 rounded-xl border transition-all ${currentView === 'account' ? 'border-brand-orange text-brand-orange' : 'border-brand-border bg-slate-900 hover:border-brand-orange text-slate-300'}`}
              title={isAuthenticated ? "Pilot Dashboard (Authorized)" : "Pilot Authorization Login"}
            >
              <User className={`h-5 w-5 ${isAuthenticated ? "text-brand-orange" : ""}`} />
              {isAuthenticated && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
              )}
            </button>

            {/* Admin Controls */}
            <button 
              onClick={() => { setSelectedProduct(null); setView('admin'); }}
              className={`p-2.5 rounded-xl border transition-all ${currentView === 'admin' ? 'border-brand-orange text-brand-orange' : 'border-brand-border bg-slate-900 hover:border-brand-orange text-slate-300'}`}
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* Mobile Search Overlay Input */}
        {showSearchBox && (
          <form 
            onSubmit={handleSearchSubmit}
            className="py-3 border-t border-brand-border flex gap-2 lg:hidden"
          >
            <input 
              type="text" 
              placeholder="Search crawlers, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-sm text-slate-200 outline-none focus:border-brand-orange"
            />
            <button type="submit" className="bg-brand-orange text-black px-4 py-2 rounded-lg font-bold text-xs uppercase">
              Go
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
