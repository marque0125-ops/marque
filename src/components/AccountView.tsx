"use client";

import React, { useState } from "react";
import { useMarqueStore, Order } from "../store/store";
import { BRANDS } from "../data/mockData";
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  ChevronRight, 
  Clock, 
  Truck, 
  RotateCw,
  Gift,
  FileText,
  AlertCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Key,
  X
} from "lucide-react";

export default function AccountView() {
  const {
    orders,
    wishlist,
    products,
    setSelectedProduct,
    setView,
    advanceOrderStatus,
    cancelOrder,
    address,
    isAuthenticated,
    login,
    logout
  } = useMarqueStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Login form local states
  const [loginName, setLoginName] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setErrorMsg("Please enter your Pilot Call Sign.");
      return;
    }
    if (!/^\+?[\d\s-]{10,15}$/.test(loginPhone.trim())) {
      setErrorMsg("Please enter a valid 10-digit Comms Phone Number.");
      return;
    }
    login(loginName.trim(), loginPhone.trim());
    setErrorMsg("");
  };

  const handleQuickLogin = (name: string, phone: string) => {
    login(name, phone);
    setErrorMsg("");
  };

  const activeOrder = orders.find(o => o.id === selectedOrderId) || null;

  const handleProductClick = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  // If pilot is not authenticated, render the secure telemetry authentication link portal
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="rounded-3xl border border-brand-border bg-slate-950 p-8 space-y-6 shadow-glow relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 -translate-y-1/2 h-[150px] w-[150px] rounded-full bg-brand-orange/15 blur-[50px] pointer-events-none" />
          
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange mb-2">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
              PILOT AUTHORIZATION
            </h2>
            <p className="text-xs text-slate-400">
              Establish a secure telemetry link to access your order logs, logistics tracking, and bookmark hangar.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pilot Call Sign (Name)</label>
              <input 
                type="text" 
                placeholder="e.g. Vikram Malhotra"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full rounded-xl border border-brand-border bg-slate-900 py-3 px-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-brand-orange focus:bg-slate-900/80 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Comms Link (Phone Number)</label>
              <input 
                type="text" 
                placeholder="e.g. 9876543210"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full rounded-xl border border-brand-border bg-slate-900 py-3 px-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-brand-orange focus:bg-slate-900/80 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-orange text-black font-bold uppercase py-3 rounded-xl hover:bg-brand-gold hover:shadow-glow transition-all text-xs tracking-wider"
            >
              Establish Comms Link
            </button>
          </form>

          {/* Quick Access Mock Accounts */}
          <div className="border-t border-brand-border pt-4 space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">Quick Access Mock Accounts</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin("Vikram Malhotra", "9876543210")}
                className="flex flex-col items-start p-3 rounded-xl border border-brand-border bg-slate-900/40 hover:bg-slate-900 hover:border-brand-orange text-left transition-all"
              >
                <span className="text-xs font-bold text-slate-200">Vikram Malhotra</span>
                <span className="text-[9px] text-slate-500">Pro Basher (Chennai)</span>
              </button>
              <button
                onClick={() => handleQuickLogin("Kabir Sen", "9123456789")}
                className="flex flex-col items-start p-3 rounded-xl border border-brand-border bg-slate-900/40 hover:bg-slate-900 hover:border-brand-orange text-left transition-all"
              >
                <span className="text-xs font-bold text-slate-200">Kabir Sen</span>
                <span className="text-[9px] text-slate-500">Scale Crawler (Ooty)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'confirmed':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'dispatched':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'out-of-delivery':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'delivered':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. CUSTOMER PROFILE STATS HEADER */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile info card with Logout Action */}
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-brand-orange text-black font-black flex items-center justify-center text-xl font-display shadow-glow">
              {address.name ? address.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider font-display">Authorized Pilot</span>
              <h2 className="text-base font-bold text-white leading-none">
                {address.name || "Active Pilot"}
              </h2>
              <p className="text-xs text-slate-500 leading-none">
                {address.phone}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              logout();
              setView('home');
            }}
            className="rounded-xl border border-red-500/30 bg-red-950/20 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white hover:shadow-glow transition-all duration-300 uppercase tracking-wider"
          >
            Log Out
          </button>
        </div>

        {/* Loyalty points card */}
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-brand-gold text-brand-gold flex items-center justify-center">
            <Gift className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pit-crew Loyalty points</span>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-2xl font-black text-brand-gold font-display">1,250 PTS</span>
              <span className="text-[9px] text-green-400 font-bold">₹125 value</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-none mt-1">Redeemable on compatible parts bundles</p>
          </div>
        </div>

        {/* Saved Addresses card count */}
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-brand-orange text-brand-orange flex items-center justify-center">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Fulfillment Hub</span>
            <h2 className="text-xs font-bold text-slate-200 leading-tight">
              {address.city ? `${address.city}, ${address.state}` : "No address saved"}
            </h2>
            <p className="text-[9px] text-slate-500 leading-none mt-1">Default PIN: {address.pincode || "Not configured"}</p>
          </div>
        </div>

      </section>

      {/* MAIN ACCOUNT BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Orders History */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-orange" />
              Order Registry Log ({orders.length})
            </h3>
            <p className="text-xs text-slate-400">
              Click on an active order below to track its live shipping timeline, updated directly from the operational admin console.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 py-16 text-center space-y-4">
              <div className="h-10 w-10 rounded-full bg-slate-900 border border-brand-orange flex items-center justify-center mx-auto text-brand-orange">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-bold text-white uppercase">No purchase orders logged yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Once you place an order with Razorpay or Cash on Delivery, your full manifests will appear here.
              </p>
              <button
                onClick={() => setView('shop')}
                className="bg-brand-orange text-black px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-brand-gold transition-colors"
              >
                Assemble Fleet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`cursor-pointer rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${selectedOrderId === order.id ? 'bg-slate-900 border-brand-orange shadow-glow' : 'bg-slate-950 border-brand-border hover:border-slate-700'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        {order.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <p>Placed: {order.createdAt}</p>
                      <p className="font-mono text-[9px] text-slate-500">AWB Tracking: {order.trackingNumber}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-brand-border/40 pt-3 sm:border-none sm:pt-0">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase leading-none">Net Value</span>
                    <span className="font-mono text-sm font-black text-brand-gold mt-1 block leading-none">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-none">{order.items.reduce((sum, i) => sum + i.qty, 0)} items</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Live Tracking Timeline & Webhook Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-brand-orange" />
            MARQUE Logistics Desk
          </h3>

          {!activeOrder ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 text-center text-xs text-slate-500">
              Select an order from your log grid to view the active shipment status bar and real-time dispatch details.
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
              
              {/* Active AWB & Info */}
              <div className="border-b border-brand-border pb-4 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">AWB Consignment</span>
                  <span className="text-white font-mono">{activeOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Logistics Carrier</span>
                  <span className="text-slate-200">BlueDart Express Air</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination PIN</span>
                  <span className="text-slate-200">{activeOrder.shippingAddress.pincode} ({activeOrder.shippingAddress.city})</span>
                </div>
              </div>

              {/* HORIZONTAL TIMELINE GRAPHICS */}
              <div className="space-y-4 relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shipment Timeline Nodes</span>
                
                {/* Node connector line */}
                <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-slate-800 -translate-y-1/2 pointer-events-none" />

                <div className="flex justify-between relative z-10 text-[9px] font-bold">
                  {[
                    { key: 'placed', label: 'Placed' },
                    { key: 'confirmed', label: 'Confirmed' },
                    { key: 'dispatched', label: 'Dispatched' },
                    { key: 'out-of-delivery', label: 'Outbound' },
                    { key: 'delivered', label: 'Delivered' }
                  ].map((node, idx) => {
                    const statusOrder = ['placed', 'confirmed', 'dispatched', 'out-of-delivery', 'delivered', 'cancelled'];
                    const activeIndex = statusOrder.indexOf(activeOrder.status);
                    const nodeIndex = statusOrder.indexOf(node.key);
                    const isPassed = nodeIndex <= activeIndex && activeOrder.status !== 'cancelled';
                    const isCurrent = node.key === activeOrder.status;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div className={`h-6.5 w-6.5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] transition-all ${isPassed ? 'bg-brand-orange border-brand-orange text-black shadow-glow' : 'bg-slate-950 border-slate-800 text-slate-500'} ${isCurrent && 'animate-ping absolute h-6.5 w-6.5 bg-brand-orange/30'}`} />
                        {/* Static duplicate of isCurrent to cover the ping absolute */}
                        {isCurrent && (
                          <div className="h-6.5 w-6.5 rounded-full border-2 bg-brand-orange border-brand-orange text-black flex items-center justify-center font-bold text-[9px] z-20">
                            {idx + 1}
                          </div>
                        )}
                        <span className={`uppercase font-display tracking-tighter ${isPassed ? 'text-brand-orange' : 'text-slate-500'}`}>
                          {node.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Telemetry dispatch prompt */}
              {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                <div className="rounded-xl border border-brand-border bg-slate-950 p-4 text-[10px] text-slate-500 text-center uppercase tracking-wider leading-relaxed">
                  Status updates are managed manually by our dispatcher team. To advance this tracking node, log in as administrator and open the Operational HQ.
                </div>
              )}

              {/* Cancel Order Action */}
              {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this order? This will instantly restore warehouse inventory stock levels!")) {
                      cancelOrder(activeOrder.id);
                    }
                  }}
                  className="w-full text-center text-[10px] text-red-400 hover:text-red-500 font-bold uppercase tracking-wider underline block pt-2"
                >
                  Cancel Order and Request Refund
                </button>
              )}

              {/* Detailed logs feed */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Consignment Movement Logs</span>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {activeOrder.logs.map((log, idx) => (
                    <div key={idx} className="p-3 rounded bg-slate-900 text-[11px] text-slate-400 flex justify-between gap-4 border-l border-brand-orange">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wide font-display block leading-none">{log.status}</span>
                        <p className="leading-relaxed">{log.message}</p>
                      </div>
                      <span className="font-mono text-[9px] text-slate-500 shrink-0 font-semibold">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Dynamic Wishlist Panel */}
          <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2 flex items-center gap-1.5">
              <Heart className="h-4.5 w-4.5 text-brand-orange fill-brand-orange" />
              Pilot Wishlist Rigs ({wishlist.length})
            </h3>
            
            {wishlist.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No vehicles bookmarked. Tap the heart on products in catalog!
              </p>
            ) : (
              <div className="divide-y divide-brand-border">
                {wishlist.map((id) => {
                  const p = products.find(prod => prod.id === id);
                  if (!p) return null;
                  
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handleProductClick(p.id)}
                      className="cursor-pointer py-3 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-slate-900/20 px-1 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover border border-brand-border" />
                        <div>
                          <span className="text-xs font-bold text-white block line-clamp-1">{p.name}</span>
                          <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider">{p.scale} Scale • {p.speedKmh} km/h</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
