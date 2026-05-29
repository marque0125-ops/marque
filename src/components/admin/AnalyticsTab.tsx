import React, { useState } from "react";
import { TrendingUp, AlertTriangle, Sparkles, Settings } from "lucide-react";
import { useOrderStore } from "../../store/useOrderStore";
import { useUIStore } from "../../store/useUIStore";

export function AnalyticsTab() {
  const { showDialog } = useUIStore();
  const orders = useOrderStore(state => state.orders);
  const { lowStockAlerts, clearLowStockAlerts, announcementText, setAnnouncementText } = useUIStore();
  const [announcementInput, setAnnouncementInput] = useState(announcementText);

  const totalOrders = orders.length;
  const gmv = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
  const aov = totalOrders > 0 ? Math.round(gmv / totalOrders) : 0;
  const baseConversionRate = 3.6;
  const calculatedConversion = totalOrders > 0 ? parseFloat((baseConversionRate + (totalOrders * 0.2)).toFixed(1)) : baseConversionRate;

  const handleUpdateAnnouncement = () => {
    if (!announcementInput.trim()) {
      showDialog({ title: 'Validation Error', message: 'Announcement ticker text cannot be empty!' });
      return;
    }
    setAnnouncementText(announcementInput);
    showDialog({ title: 'Success', message: 'Ticker content broadcasted successfully! Marquee updated on all pages.' });
  };

  return (
    <div className="space-y-8">
      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
          <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-3xl font-normal text-white font-display">₹{gmv.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-green-400 font-normal flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +14%</span>
          </div>
          <p className="text-[10px] text-slate-500">Excludes cancelled order volumes</p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
          <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-3xl font-normal text-brand-gold font-display">₹{aov.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on {totalOrders} placed manifests</p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
          <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Store Conversion Rate</span>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-3xl font-normal text-white font-display">{calculatedConversion}%</span>
            <span className="text-[9px] text-green-400 font-normal leading-none">+0.4% this week</span>
          </div>
          <p className="text-[10px] text-slate-500">Typesense Instant Search speed &lt; 80ms</p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
          <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Manifest Orders Placed</span>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-3xl font-normal text-brand-orange font-display">{totalOrders}</span>
          </div>
          <p className="text-[10px] text-slate-500">Fulfillment managed via Admin Command Console</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5 text-brand-orange" />
              Telemetry Low Stock alerts board ({lowStockAlerts.length})
            </h3>
            {lowStockAlerts.length > 0 && (
              <button onClick={clearLowStockAlerts} className="text-[10px] text-slate-500 hover:text-brand-orange font-normal uppercase underline">
                Reset log
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
            {lowStockAlerts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                All inventory levels healthy. No alerts triggered.
              </div>
            ) : (
              lowStockAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 rounded bg-slate-900 border-l border-brand-orange text-xs text-slate-300 flex justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-red-400 font-normal uppercase tracking-wider block">Critical Limit reached</span>
                    <p>{alert.message}</p>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 shrink-0 font-normal">{alert.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-4 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-3 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-brand-gold" />
              Storefront Campaigns
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded border border-brand-border/60">
                <span className="text-[8px] bg-brand-orange text-white sm:text-black px-1 font-normal uppercase rounded block w-max">Active Banner</span>
                <span className="font-normal text-white block mt-1.5">Traxxas X-Maxx 8S Extreme basher</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-brand-border/55">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-brand-orange" />
              Header Announcement Marquee
            </h3>
            <div className="space-y-3 text-xs">
              <textarea 
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="Enter announcement text..."
                rows={3}
                className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange resize-none text-[11px]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpdateAnnouncement}
                  className="w-full bg-brand-orange hover:bg-brand-gold text-white sm:text-black py-2 rounded font-normal uppercase text-[10px] transition-all"
                >
                  Update Ticker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
