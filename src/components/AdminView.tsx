"use client";

import React, { useState } from "react";
import { AnalyticsTab } from "./admin/AnalyticsTab";
import { InventoryTab } from "./admin/InventoryTab";
import { OrdersTab } from "./admin/OrdersTab";

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');

  return (
    <div className="space-y-10 pb-20">
      {/* Admin Title Area */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Control Console</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
            MARQUE Operational HQ
          </h1>
          <p className="text-xs text-slate-400">
            Authorized admin portal. Manage product stocks, order fulfillment manifests, and live telemetry parameters.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2">
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'inventory', label: 'Inventory (CRUD)' },
            { id: 'orders', label: 'Order Dispatch' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeTab === tab.id ? 'bg-brand-orange text-black border-brand-orange' : 'border-brand-border bg-slate-900 hover:border-slate-700 text-slate-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'orders' && <OrdersTab />}
    </div>
  );
}
