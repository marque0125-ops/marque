import React, { useState } from "react";
import { User, Mail, MapPin, Phone, ShieldCheck, Box, LogOut, ChevronRight, Truck, Heart, Edit2, X, Save } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrderStore } from "../../store/useOrderStore";
import { useProductStore } from "../../store/useProductStore";
import { useUIStore } from "../../store/useUIStore";
import { OrderTrackingMap } from "../OrderTrackingMap";

export function Dashboard() {
  const { userEmail, address, setAddress, logout } = useAuthStore();
  const { orders, fetchOrders, cancelOrder } = useOrderStore();
  const { showDialog } = useUIStore();
  const { products, wishlist } = useProductStore();
  const { setView, setSelectedProduct } = useUIStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
  const activeOrder = orders.find((o: any) => o.id === selectedOrderId);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: address.name || "",
    phone: address.phone || "",
    addressLine: address.addressLine || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    gstin: address.gstin || ""
  });

  const handleEditOpen = () => {
    setEditForm({
      name: address.name || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      gstin: address.gstin || ""
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(editForm);
    setIsEditingProfile(false);
  };

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
                <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block">Pilot Profile</span>
                <span className="font-display font-normal text-lg text-white">{address.name || "Guest Pilot"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isEditingProfile && (
                <button onClick={handleEditOpen} className="p-2 text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-all" title="Edit Profile">
                  <Edit2 className="h-4.5 w-4.5" />
                </button>
              )}
              <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Sign Out">
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
          
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-normal uppercase block">Email Address (Read-Only)</label>
                  <input type="text" value={userEmail || "Not Provided"} disabled className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs text-slate-500 cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Full Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Phone Number</label>
                  <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Street Address</label>
                  <input type="text" value={editForm.addressLine} onChange={e => setEditForm({...editForm, addressLine: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">City</label>
                  <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">State</label>
                  <input type="text" value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Pincode</label>
                  <input type="text" value={editForm.pincode} onChange={e => setEditForm({...editForm, pincode: e.target.value})} required className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">B2B GSTIN (Optional)</label>
                  <input type="text" value={editForm.gstin} onChange={e => setEditForm({...editForm, gstin: e.target.value})} className="w-full rounded-xl bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange font-mono" />
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-brand-border/40">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-2 text-xs font-normal uppercase rounded-lg border border-brand-border text-slate-400 hover:bg-slate-800">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-xs font-normal uppercase rounded-lg bg-brand-orange text-white sm:text-black hover:bg-brand-gold flex justify-center items-center gap-1.5">
                  <Save className="h-4 w-4" /> Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <div><span className="text-[9px] text-slate-500 font-normal uppercase block">Registered Email</span><span className="text-xs text-slate-200 font-mono">{userEmail || "Not Provided"}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <div><span className="text-[9px] text-slate-500 font-normal uppercase block">Contact Number</span><span className="text-xs text-slate-200 font-mono">{address.phone || "Not Provided"}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <div><span className="text-[9px] text-slate-500 font-normal uppercase block">Default Delivery Address</span><span className="text-xs text-slate-200">{address.addressLine}</span><span className="text-xs text-slate-200 block">{address.city}, {address.state} - {address.pincode}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <div><span className="text-[9px] text-slate-500 font-normal uppercase block">B2B GSTIN</span><span className="text-xs text-slate-200 font-mono">{address.gstin || "Not Registered for B2B"}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-lg font-normal uppercase text-white flex items-center gap-2">
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
                      <span className="font-mono text-xs font-normal text-white uppercase">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-normal uppercase border ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5"><p>Placed: {order.createdAt}</p><p className="font-mono text-[9px] text-slate-500">AWB Tracking: {order.trackingNumber}</p></div>
                  </div>
                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-brand-border/40 pt-3 sm:border-none sm:pt-0">
                    <span className="text-[10px] text-slate-500 font-normal block uppercase leading-none">Net Value</span>
                    <span className="font-mono text-sm font-normal text-brand-gold mt-1 block leading-none">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-none">{order.items.reduce((sum: number, i: any) => sum + i.qty, 0)} items</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <h3 className="font-display text-xl font-normal uppercase text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-brand-orange" />MARQUE Logistics Desk
        </h3>

        {!activeOrder ? (
          <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 text-center text-xs text-slate-500">
            Select an order from your log grid to view the active shipment status bar and real-time dispatch details.
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
            <div className="border-b border-brand-border pb-4 space-y-1.5 text-xs">
              <div className="flex justify-between font-normal"><span className="text-slate-400 uppercase tracking-wider">AWB Consignment</span><span className="text-white font-mono">{activeOrder.trackingNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Logistics Carrier</span><span className="text-slate-200">BlueDart Express Air</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Destination PIN</span><span className="text-slate-200">{activeOrder.shippingAddress.pincode} ({activeOrder.shippingAddress.city})</span></div>
            </div>

            <OrderTrackingMap status={activeOrder.status} />

            {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
              <button onClick={() => { 
                showDialog({
                  type: 'confirm',
                  title: 'Cancel Order',
                  message: 'Are you sure you want to cancel this order? This action cannot be undone.',
                  onConfirm: () => cancelOrder(activeOrder.id)
                });
              }} className="w-full text-center text-[10px] text-red-400 hover:text-red-500 font-normal uppercase tracking-wider underline block pt-2">
                Cancel Order and Request Refund
              </button>
            )}

            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 font-normal uppercase tracking-widest block">Consignment Movement Logs</span>
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {activeOrder.logs.map((log: any, idx: number) => (
                  <div key={idx} className="p-3 rounded bg-slate-900 text-[11px] text-slate-400 flex justify-between gap-4 border-l border-brand-orange">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[9px] text-brand-orange font-normal uppercase tracking-wide font-display block leading-none">{log.status}</span>
                      <p className="leading-relaxed">{log.message}</p>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 shrink-0 font-normal">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2 flex items-center gap-1.5">
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
                      <div><span className="text-xs font-normal text-white block line-clamp-1">{p.name}</span><span className="text-[9px] text-brand-orange font-normal uppercase tracking-wider">{p.scale} Scale • {p.speedKmh} km/h</span></div>
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
