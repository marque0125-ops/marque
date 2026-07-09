"use client";

import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { Loader2 } from "lucide-react";
import { OrderTrackingMap } from "../OrderTrackingMap";
import toast from "react-hot-toast";

export function OrdersTab() {
  const { orders, isLoading, advanceOrderStatus, cancelOrder, fetchOrders, updateOrderTracking } = useOrderStore();
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-brand-orange">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200">
          Courier Dispatch manifest console
        </h2>
        <p className="text-xs text-slate-400">
          Manage order delivery stages, ship consignments, generate AWB tracking barcodes, or fulfill refunds.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-slate-950 py-16 text-center text-xs text-slate-400">
          No orders logged. Place test orders from checkout to manage them here.
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-brand-border bg-slate-950 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-normal text-white uppercase">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-normal uppercase border ${order.paymentStatus === 'paid' ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'}`}>
                    Payment: {order.paymentStatus} ({order.paymentMethod})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wide">
                  Status Node: <strong className="text-brand-orange uppercase">{order.status}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-brand-border pb-3 text-slate-400">
                <div>
                  <span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider block">Receiver</span>
                  <span className="text-slate-200 font-normal block">{order.shippingAddress.name}</span>
                  <span className="block mt-0.5">{order.shippingAddress.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider block">Address</span>
                  <span className="text-slate-200 block truncate">{order.shippingAddress.addressLine}</span>
                  <span className="block mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider block">Consignment Value</span>
                  <span className="font-mono text-slate-200 font-normal block">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  {order.paymentMethod === 'COD' && order.advancePaidAmount !== undefined && (
                    <div className="mt-1 pt-1 border-t border-brand-border/40">
                      <span className="text-[9px] text-slate-500 block leading-none">Adv Paid: <span className="text-green-400 font-mono">₹{order.advancePaidAmount.toLocaleString('en-IN')}</span></span>
                      <span className="text-[9px] text-brand-orange font-bold uppercase block mt-1 leading-none">To Collect: <span className="font-mono font-bold">₹{(order.totalAmount - order.advancePaidAmount).toLocaleString('en-IN')}</span></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="py-2 border-b border-brand-border">
                <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider block mb-2">Order Items</span>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-900/50 p-2 rounded">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 rounded object-cover border border-brand-border" />
                      <div className="flex-1">
                        <span className="text-xs font-normal text-white block line-clamp-1">{item.product.name}</span>
                        <span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider block">
                          Qty: {item.qty} &bull; {item.variant.name}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-normal text-brand-gold">
                        ₹{((item.variant.priceOverride || item.product.price) * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-brand-border/40">
                <OrderTrackingMap status={order.status} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2">
                {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-mono">AWB Tracking:</span>
                    <input
                      type="text"
                      value={trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : order.trackingNumber}
                      onChange={(e) => setTrackingInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                      className="bg-slate-900 border border-brand-border/60 focus:border-brand-orange rounded px-2 py-0.5 text-[10px] text-white font-mono w-32 sm:w-40 outline-none transition-all"
                      placeholder="Enter Tracking ID..."
                    />
                    <button
                      onClick={() => {
                        updateOrderTracking(order.id, trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : order.trackingNumber);
                        toast.success("Tracking ID saved!");
                      }}
                      className="bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white px-2 py-0.5 rounded text-[9px] uppercase font-normal transition-all"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">AWB Code: {order.trackingNumber}</span>
                )}
                <div className="flex gap-2">
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button onClick={() => advanceOrderStatus(order.id)} className="bg-brand-orange text-white sm:text-black px-3.5 py-1.5 rounded font-normal uppercase text-[9px] hover:bg-brand-gold">
                      Fulfill / Advance Status
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button onClick={() => cancelOrder(order.id)} className="border border-brand-border hover:border-red-500 text-slate-400 hover:text-red-500 px-3.5 py-1.5 rounded font-normal uppercase text-[9px]">
                      Cancel & Refund
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
