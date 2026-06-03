"use client";

import React, { useState } from "react";
import { AnalyticsTab } from "./admin/AnalyticsTab";
import { CategoriesTab } from "./admin/CategoriesTab";
import { InventoryTab } from "./admin/InventoryTab";
import { OrdersTab } from "./admin/OrdersTab";
import BlogTab from "./admin/BlogTab";
import { BannersTab } from "./admin/BannersTab";

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'categories' | 'inventory' | 'orders' | 'blog' | 'banners'>('analytics');

  return (
    <div className="space-y-10 pb-20">
      {/* Admin Title Area */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block">Control Console</span>
          <h1 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white mt-1">
            MARQUE Operational HQ
          </h1>
          <p className="text-xs text-slate-400">
            Authorized admin portal. Manage product stocks, order fulfillment manifests, and live telemetry parameters.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'categories', label: 'Categories' },
            { id: 'inventory', label: 'Inventory (CRUD)' },
            { id: 'orders', label: 'Order Dispatch' },
            { id: 'blog', label: 'Blog Articles' },
            { id: 'banners', label: 'Hero Banners' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-normal uppercase border transition-all ${activeTab === tab.id ? 'bg-brand-orange text-white sm:text-black border-brand-orange' : 'border-brand-border bg-slate-900 hover:border-slate-700 text-slate-300'}`}
            >
              {tab.label}
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
    </div>
  );
}
