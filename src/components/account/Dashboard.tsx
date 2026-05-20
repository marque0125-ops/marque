import React, { useState } from "react";
import { User, Mail, MapPin, Phone, ShieldCheck, Box, LogOut, ChevronRight, Truck, Heart } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrderStore } from "../../store/useOrderStore";
import { useProductStore } from "../../store/useProductStore";
import { useUIStore } from "../../store/useUIStore";

export function Dashboard() {
  const { userEmail, address, logout } = useAuthStore();
  const { orders, cancelOrder } = useOrderStore();
  const { products, wishlist } = useProductStore();
  const { setView, setSelectedProduct } = useUIStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
  const activeOrder = orders.find((o: any) => o.id === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
      case 'confirmed': return 'text-brand-orange border-brand-orange/30 bg-brand-orange/10';
      case 'dispatched': return 'text-brand-gold border-brand-gold/30 bg-brand-gold/10';
      case 'out-of-delivery': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'delivered': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'cancelled': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  const handleProductClick = (productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setView('pdp');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-3xl border border-brand-border bg-slate-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
                <User className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Pilot Profile</span>
                <span className="font-display font-bold text-lg text-white">{address.name || "Guest Pilot"}</span>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Sign Out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div><span className="text-[9px] text-slate-500 font-bold uppercase block">Registered Email</span><span className="text-xs text-slate-200 font-mono">{userEmail || "Not Provided"}</span></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div><span className="text-[9px] text-slate-500 font-bold uppercase block">Contact Number</span><span className="text-xs text-slate-200 font-mono">{address.phone || "Not Provided"}</span></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div><span className="text-[9px] text-slate-500 font-bold uppercase block">Default Delivery Address</span><span className="text-xs text-slate-200">{address.addressLine}</span><span className="text-xs text-slate-200 block">{address.city}, {address.state} - {address.pincode}</span></div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              <div><span className="text-[9px] text-slate-500 font-bold uppercase block">B2B GSTIN</span><span className="text-xs text-slate-200 font-mono">{address.gstin || "Not Registered for B2B"}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
            <Box className="h-5 w-5 text-brand-orange" />Order Log Book
          </h3>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 text-center text-xs text-slate-500">
              No orders found. Head to the Shop to acquire new rigs!
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} onClick={() => setSelectedOrderId(order.id)} className={`cursor-pointer rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${selectedOrderId === order.id ? 'bg-slate-900 border-brand-orange shadow-glow' : 'bg-slate-950 border-brand-border hover:border-slate-700'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-white uppercase">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5"><p>Placed: {order.createdAt}</p><p className="font-mono text-[9px] text-slate-500">AWB Tracking: {order.trackingNumber}</p></div>
                  </div>
                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-brand-border/40 pt-3 sm:border-none sm:pt-0">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase leading-none">Net Value</span>
                    <span className="font-mono text-sm font-black text-brand-gold mt-1 block leading-none">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-none">{order.items.reduce((sum: number, i: any) => sum + i.qty, 0)} items</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-brand-orange" />MARQUE Logistics Desk
        </h3>

        {!activeOrder ? (
          <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 text-center text-xs text-slate-500">
            Select an order from your log grid to view the active shipment status bar and real-time dispatch details.
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
            <div className="border-b border-brand-border pb-4 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold"><span className="text-slate-400 uppercase tracking-wider">AWB Consignment</span><span className="text-white font-mono">{activeOrder.trackingNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Logistics Carrier</span><span className="text-slate-200">BlueDart Express Air</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Destination PIN</span><span className="text-slate-200">{activeOrder.shippingAddress.pincode} ({activeOrder.shippingAddress.city})</span></div>
            </div>

            <div className="space-y-4 relative">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shipment Timeline Nodes</span>
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
                      {isCurrent && <div className="h-6.5 w-6.5 rounded-full border-2 bg-brand-orange border-brand-orange text-black flex items-center justify-center font-bold text-[9px] z-20">{idx + 1}</div>}
                      <span className={`uppercase font-display tracking-tighter ${isPassed ? 'text-brand-orange' : 'text-slate-500'}`}>{node.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
              <button onClick={() => { if (confirm("Are you sure you want to cancel this order?")) cancelOrder(activeOrder.id); }} className="w-full text-center text-[10px] text-red-400 hover:text-red-500 font-bold uppercase tracking-wider underline block pt-2">
                Cancel Order and Request Refund
              </button>
            )}

            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Consignment Movement Logs</span>
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {activeOrder.logs.map((log: any, idx: number) => (
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

        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2 flex items-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-brand-orange fill-brand-orange" />Pilot Wishlist Rigs ({wishlist.length})
          </h3>
          {wishlist.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No vehicles bookmarked. Tap the heart on products in catalog!</p>
          ) : (
            <div className="divide-y divide-brand-border">
              {wishlist.map((id: string) => {
                const p = products.find((prod: any) => prod.id === id);
                if (!p) return null;
                return (
                  <div key={p.id} onClick={() => handleProductClick(p.id)} className="cursor-pointer py-3 flex items-center justify-between hover:bg-slate-900/20 px-1 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover border border-brand-border" />
                      <div><span className="text-xs font-bold text-white block line-clamp-1">{p.name}</span><span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider">{p.scale} Scale • {p.speedKmh} km/h</span></div>
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
  );
}
