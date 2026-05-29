import React, { useEffect } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { Loader2 } from "lucide-react";
import { OrderTrackingMap } from "../OrderTrackingMap";

export function OrdersTab() {
  const { orders, isLoading, advanceOrderStatus, cancelOrder, fetchOrders } = useOrderStore();

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
        <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200">
          Courier Dispatch manifest console
        </h3>
        <p className="text-xs text-slate-400">
          Manage order delivery stages, ship consignments, generate AWB tracking barcodes, or fulfill refunds.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-slate-950 py-16 text-center text-xs text-slate-500">
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
                <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wide">
                  Status Node: <strong className="text-brand-orange uppercase">{order.status}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-brand-border pb-3 text-slate-400">
                <div>
                  <span className="text-[9px] text-slate-500 font-normal uppercase tracking-wider block">Receiver</span>
                  <span className="text-slate-200 font-normal block">{order.shippingAddress.name}</span>
                  <span className="block mt-0.5">{order.shippingAddress.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-normal uppercase tracking-wider block">Address</span>
                  <span className="text-slate-200 block truncate">{order.shippingAddress.addressLine}</span>
                  <span className="block mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-normal uppercase tracking-wider block">Consignment Value</span>
                  <span className="font-mono text-slate-200 font-normal block">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  {order.shippingAddress.gstin && (
                    <span className="text-[9px] text-brand-gold font-normal block mt-1 uppercase">B2B GSTIN INCLUDED</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-brand-border/40">
                <OrderTrackingMap status={order.status} />
              </div>

              <div className="flex justify-between items-center gap-4 pt-2">
                <span className="text-[10px] text-slate-500 font-mono">AWB Code: {order.trackingNumber}</span>
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
