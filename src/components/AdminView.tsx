"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Loader2, Bell } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

let sharedAudioCtx: AudioContext | null = null;

const LoadingFallback = () => (
  <div className="py-20 flex justify-center items-center">
    <Loader2 className="h-8 w-8 text-brand-orange animate-spin" />
  </div>
);

const AnalyticsTab = dynamic(() => import('./admin/AnalyticsTab').then(mod => mod.AnalyticsTab), { ssr: false, loading: LoadingFallback });
const CategoriesTab = dynamic(() => import('./admin/CategoriesTab').then(mod => mod.CategoriesTab), { ssr: false, loading: LoadingFallback });
const InventoryTab = dynamic(() => import('./admin/InventoryTab').then(mod => mod.InventoryTab), { ssr: false, loading: LoadingFallback });
const OrdersTab = dynamic(() => import('./admin/OrdersTab').then(mod => mod.OrdersTab), { ssr: false, loading: LoadingFallback });
const BlogTab = dynamic(() => import('./admin/BlogTab'), { ssr: false, loading: LoadingFallback });
const BannersTab = dynamic(() => import('./admin/BannersTab').then(mod => mod.BannersTab), { ssr: false, loading: LoadingFallback });
const VideosTab = dynamic(() => import('./admin/VideosTab').then(mod => mod.VideosTab), { ssr: false, loading: LoadingFallback });
const RacingVideosTab = dynamic(() => import('./admin/RacingVideosTab').then(mod => mod.RacingVideosTab), { ssr: false, loading: LoadingFallback });
const SiteContentTab = dynamic(() => import('./admin/SiteContentTab').then(mod => mod.SiteContentTab), { ssr: false, loading: LoadingFallback });

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'categories' | 'inventory' | 'orders' | 'blog' | 'banners' | 'videos' | 'racing' | 'site_content'>('analytics');
  
  const { orders, fetchOrders } = useOrderStore();
  const [newOrderCount, setNewOrderCount] = useState(0);
  const topOrderIdRef = useRef(orders[0]?.id);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      if (topOrderIdRef.current && orders[0].id !== topOrderIdRef.current) {
        setNewOrderCount(prev => prev + 1);
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            if (!sharedAudioCtx) {
              sharedAudioCtx = new AudioContextClass();
            }
            if (sharedAudioCtx.state === 'suspended') {
              sharedAudioCtx.resume();
            }
            const playTone = (freq: number, startTime: number, duration: number) => {
              if (!sharedAudioCtx) return;
              const oscillator = sharedAudioCtx.createOscillator();
              const gainNode = sharedAudioCtx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(freq, sharedAudioCtx.currentTime + startTime);
              gainNode.gain.setValueAtTime(0, sharedAudioCtx.currentTime + startTime);
              gainNode.gain.linearRampToValueAtTime(0.5, sharedAudioCtx.currentTime + startTime + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.01, sharedAudioCtx.currentTime + startTime + duration);
              oscillator.connect(gainNode);
              gainNode.connect(sharedAudioCtx.destination);
              oscillator.start(sharedAudioCtx.currentTime + startTime);
              oscillator.stop(sharedAudioCtx.currentTime + startTime + duration);
            };
            playTone(880, 0, 0.3);
            playTone(1046.50, 0.15, 0.4);
          }
        } catch (e) {
          console.warn('Audio playback failed', e);
        }
      }
      topOrderIdRef.current = orders[0].id;
    }
  }, [orders]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    if (tabId === 'orders') {
      setNewOrderCount(0);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Admin Title Area */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block">Control Console</span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white mt-1">
              MARQUE Operational HQ
            </h1>
            <p className="text-xs text-slate-400">
              Authorized admin portal. Manage product stocks, order fulfillment manifests, and live telemetry parameters.
            </p>
          </div>
          <div className="hidden md:flex relative shrink-0">
            <button onClick={() => handleTabClick('orders')} className="p-3 rounded-xl bg-slate-950 border border-brand-border text-slate-400 hover:text-brand-orange hover:border-brand-orange transition-all relative">
              <Bell className="h-6 w-6" />
              {newOrderCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse border-2 border-slate-900 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {newOrderCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'categories', label: 'Categories' },
            { id: 'inventory', label: 'Inventory (CRUD)' },
            { id: 'orders', label: 'Order Dispatch' },
            { id: 'blog', label: 'Blog Articles' },
            { id: 'banners', label: 'Hero Banners' },
            { id: 'site_content', label: 'Site Content' },
            { id: 'videos', label: 'Unboxing Videos' },
            { id: 'racing', label: 'Racing Videos' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-normal uppercase border transition-all relative ${activeTab === tab.id ? 'bg-brand-orange text-white sm:text-black border-brand-orange' : 'border-brand-border bg-slate-900 hover:border-slate-700 text-slate-300'}`}
            >
              {tab.label}
              {tab.id === 'orders' && newOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
              )}
              {tab.id === 'orders' && newOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'blog' && <BlogTab />}
      {activeTab === 'banners' && <BannersTab />}
      {activeTab === 'site_content' && <SiteContentTab />}
      {activeTab === 'videos' && <VideosTab />}
      {activeTab === 'racing' && <RacingVideosTab />}
    </div>
  );
}
