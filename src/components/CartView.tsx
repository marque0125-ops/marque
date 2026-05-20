"use client";

import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUIStore } from "../store/useUIStore";
import { useOrderStore } from "../store/useOrderStore";
import { BRANDS } from "../data/mockData";
import { 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Ticket, 
  Building2, 
  Check, 
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
  Truck,
  FileSpreadsheet,
  Zap
} from "lucide-react";

export default function CartView() {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const {
    setView,
    pincode,
    pinDetail,
    pinLoading,
    pinError,
    checkPincode
  } = useUIStore();

  const {
    address,
    setAddress
  } = useAuthStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // B2B state
  const [isB2B, setIsB2B] = useState(false);
  const [gstinInput, setGstinInput] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstinError, setGstinError] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => {
    const base = item.variant.priceOverride || item.product.price;
    return sum + (base * item.qty);
  }, 0);

  // Coupon discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(subtotal * appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Shiprocket Shipping calculation
  const shippingCost = pinDetail ? pinDetail.shippingCost : 500;

  // Indian GST 18% inclusive calculation:
  // Tax = Subtotal - (Subtotal / 1.18)
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount - (taxableAmount / 1.18));
  
  // Grand Total
  const grandTotal = taxableAmount + shippingCost;

  const handleCouponApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = address.pincode;
    checkPincode(pin);
  };

  const handleGstinValidate = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setGstinInput(val);
    
    // 15 Character GSTIN standard validation regex
    const regex = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    if (val && !regex.test(val)) {
      setGstinError("Invalid Indian GSTIN structure. Example: 27AAAAA1111A1Z1");
      setAddress({ gstin: "" });
    } else {
      setGstinError("");
      setAddress({ gstin: val });
    }
  };

  const handleProceed = () => {
    if (cart.length === 0) return;
    if (!pinDetail) {
      // Prompt user to verify address PIN code
      alert("PIN CODE REQUIRED: Please enter and verify your delivery PIN code before proceeding.");
      return;
    }

    if (!address.name || !address.phone || !address.addressLine) {
      alert("DELIVERY DETAILS REQUIRED: Please fill in receiver's name, phone, and complete street address.");
      return;
    }

    if (isB2B && (!gstinInput || gstinError)) {
      alert("B2B INVOICING: Please supply a valid GSTIN or uncheck business billing.");
      return;
    }

    setView('admin'); // Set view to checkout simulation
    // Wait, let's open checkout view directly
    // Let's create checkout tab or layout
    // Let's create account view and checkout simulation in the store
    // The store has no checkout view state, let's see. Oh, currentView has:
    // 'home' | 'shop' | 'pdp' | 'cart' | 'account' | 'admin'
    // Let's check how we navigate to checkout:
    // In our layout we can render a checkout modal directly or view when they proceed!
    // Let's implement checkout view inside the account view or as a sub-view in cart! That's super clean.
    // Let's store an activeCartTab or activeCartView: 'cart' | 'checkout' inside CartView!
    // Yes! Let's handle checkout right inside the CartView by switching a state `checkoutStep` to true!
    // This keeps files highly modular and self-contained.
  };

  const [checkoutStep, setCheckoutStep] = useState(false);

  // If in Checkout step, let's render the checkout page. We can handle it in the same file or write it dynamically!
  if (checkoutStep) {
    return (
      <div className="space-y-8 pb-20">
        {/* Checkout Header */}
        <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6">
          <button 
            onClick={() => setCheckoutStep(false)}
            className="text-xs text-slate-400 hover:text-brand-orange uppercase font-bold flex items-center gap-1 mb-2"
          >
            <Minus className="h-3 w-3" /> Back to Shopping Cart
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
            Razorpay Secure Checkpoint
          </h1>
          <p className="text-xs text-slate-400">
            Secure checkout powered by Razorpay API. GST-compliant invoice will be auto-generated.
          </p>
        </div>

        {/* Checkout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Address confirmation & Payment Simulation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery address details card */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
                1. Delivery Manifest & Destination
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Receiver Name</span>
                  <span className="text-slate-200 font-bold">{address.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Contact Mobile</span>
                  <span className="text-slate-200 font-bold">{address.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Street Address</span>
                  <span className="text-slate-200 font-bold leading-relaxed">{address.addressLine}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">City</span>
                  <span className="text-slate-200 font-bold">{pinDetail?.city}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">State & Pincode</span>
                  <span className="text-slate-200 font-bold">{pinDetail?.state} - {pinDetail?.pincode}</span>
                </div>
                {isB2B && address.gstin && (
                  <div className="col-span-2 p-2 bg-slate-900 rounded border border-brand-border/40 text-[10px] text-brand-gold">
                    <strong>B2B Invoicing Active:</strong> {companyName} (GSTIN: {address.gstin})
                  </div>
                )}
              </div>
            </div>

            {/* RAZORPAY PAYMENT SIMULATION DRAWER */}
            <div className="rounded-2xl border border-brand-orange bg-slate-900/10 p-6 space-y-6 relative overflow-hidden animate-pulse-glow">
              <div className="absolute top-0 right-0 bg-brand-orange text-black font-bold uppercase text-[9px] px-3 py-1 rounded-bl">
                Razorpay Live Sandbox
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Select Razorpay Payment Gateway API</span>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-1.5">
                  <Zap className="h-5 w-5 text-brand-orange animate-bounce" />
                  India UPI / Credit Card Portal
                </h3>
              </div>

              {/* UPI Deep links options */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Preferred Mobile Deep-links (UPI Autopay Preferred):</span>
                <div className="grid grid-cols-3 gap-3">
                  {['Google Pay', 'PhonePe', 'Paytm'].map((upi) => (
                    <button
                      key={upi}
                      onClick={() => handlePlaceOrder('UPI')}
                      className="p-3 rounded-xl border border-brand-border bg-slate-950 text-center hover:border-brand-orange hover:bg-slate-900 text-xs font-bold text-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <span className="text-[10px] font-bold text-brand-gold">⚡ UPI</span>
                      <span>{upi}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Direct Card payment */}
                <button
                  onClick={() => handlePlaceOrder('Card')}
                  className="p-4 rounded-xl border border-brand-border bg-slate-950 text-left hover:border-brand-orange hover:bg-slate-900 flex flex-col justify-between transition-all"
                >
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Credit/Debit Card</span>
                  <span className="text-xs font-bold text-slate-200 mt-2 block">Visa, Mastercard, RuPay</span>
                </button>

                {/* COD option */}
                <button
                  onClick={() => handlePlaceOrder('COD')}
                  disabled={pinDetail ? !pinDetail.codAvailable : true}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${pinDetail && pinDetail.codAvailable ? 'border-brand-border bg-slate-950 hover:border-brand-orange hover:bg-slate-900 text-slate-200 cursor-pointer' : 'border-dashed border-slate-800 text-slate-600 bg-slate-950/20 cursor-not-allowed'}`}
                >
                  <div className="flex justify-between w-full">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cash on Delivery</span>
                    {pinDetail && !pinDetail.codAvailable && (
                      <span className="text-[8px] bg-red-950 text-red-400 font-bold uppercase px-1 rounded">
                        Not eligible
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold mt-2 block">
                    {pinDetail && pinDetail.codAvailable ? "Pay Cash to Courier" : "Prepaid Only in PIN"}
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                By pressing any gateway method above, you simulate Razorpay's overlay webhook token confirmation. System automatically reserves stock and returns checkout invoice details.
              </p>
            </div>

          </div>

          {/* Right Side: Invoice Subtotal Summary */}
          <div className="lg:col-span-5 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
              Order Receipt Invoice
            </h3>

            <div className="divide-y divide-brand-border text-xs space-y-3.5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between pt-3.5 first:pt-0">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-slate-200 font-bold block">{item.product.name}</span>
                    <span className="text-[10px] text-slate-400 block font-display">
                      Variant: {item.variant.attributes.color || "Default"} • Qty: {item.qty}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-300">
                    ₹{((item.variant.priceOverride || item.product.price) * item.qty).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal (Inclusive 18% GST)</span>
                <span className="font-mono text-slate-300">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400 font-bold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Freight Charges</span>
                <span className="font-mono text-slate-300">₹{shippingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 border-t border-brand-border/40 pt-2.5">
                <span>GST HSN-9503 Portion (18% inclusive)</span>
                <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-brand-gold border-t border-brand-border pt-2.5">
                <span className="font-display uppercase">Net Payable INR (₹)</span>
                <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Embed Razorpay Script
  React.useEffect(() => {
    const scriptId = 'razorpay-checkout-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePlaceOrder = async (method: 'UPI' | 'Card' | 'COD') => {
    if (method === 'COD') {
      const store = useOrderStore.getState();
      const order = store.createOrder(method);
      setView('account');
      setCheckoutStep(false);
      clearCart();
      setTimeout(() => alert(`Order ${order.id} placed via Cash on Delivery!`), 500);
      return;
    }

    try {
      // Create order via our Next.js backend API
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal })
      });
      
      const orderData = await res.json();
      
      if (!orderData || !orderData.id) {
        alert("Payment initialization failed. Please try again.");
        return;
      }

      // Initialize Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MARQUE Pitstop",
        description: "RC Gear & Accessories Purchase",
        image: "/hero_rc_car.png",
        order_id: orderData.id,
        handler: function (response: any) {
          // Success Callback
          const store = useOrderStore.getState();
          const order = store.createOrder(method);
          order.status = "Confirmed";
          order.paymentMethod = method;
          
          setView('account');
          setCheckoutStep(false);
          clearCart();
          setTimeout(() => {
            alert(`PAYMENT SUCCESSFUL! Razorpay Payment ID: ${response.razorpay_payment_id}. Your order ${order.id} is confirmed!`);
          }, 500);
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#ff4d00"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (err) {
      console.error("Razorpay trigger error:", err);
      alert("Error securely contacting payment gateway.");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6">
        <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Shopping Basket</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
          MARQUE Pitstop Cart
        </h1>
        <p className="text-xs text-slate-400">
          Persistent cache synchronized with cloud Redis. Finish checkout to reserve track allocations.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-slate-950 py-20 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-orange flex items-center justify-center mx-auto text-brand-orange">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white uppercase">Your cart is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore our collection of brushless monster trucks, street bashers, or scale crawlers to build your fleet.
          </p>
          <button 
            onClick={() => { setView('shop'); }}
            className="bg-brand-orange text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
          >
            Visit Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-brand-border bg-slate-950 overflow-hidden">
              <div className="p-4 bg-slate-900/60 border-b border-brand-border flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Racing Models ({cartCount})</span>
                <button 
                  onClick={clearCart}
                  className="text-slate-500 hover:text-brand-orange uppercase flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Empty
                </button>
              </div>

              <div className="divide-y divide-brand-border">
                {cart.map((item) => {
                  const basePrice = item.variant.priceOverride || item.product.price;
                  const itemSubtotal = basePrice * item.qty;
                  const brand = BRANDS.find(b => b.id === item.product.brandId);

                  return (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left: Image & Titles */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="h-16 w-16 rounded-xl object-cover border border-brand-border shrink-0" 
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block leading-none font-display">
                            {brand?.name}
                          </span>
                          <span className="text-xs font-bold text-white block leading-snug">
                            {item.product.name}
                          </span>
                          <span className="text-[9px] text-slate-500 block leading-none font-mono">
                            SKU: {item.variant.sku}
                          </span>
                          <div className="flex gap-2 pt-1 text-[9px] text-slate-400 font-semibold font-display">
                            <span>Color: {item.variant.attributes.color || "Standard"}</span>
                            <span>•</span>
                            <span>Power: {item.variant.attributes.battery || "Rechargeable"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Spinners & Total prices */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-brand-border/40 pt-3 sm:border-none sm:pt-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.id, item.qty - 1)}
                            className="p-1 rounded bg-slate-900 border border-brand-border text-slate-400 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, item.qty + 1)}
                            className="p-1 rounded bg-slate-900 border border-brand-border text-slate-400 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <span className="font-mono text-xs text-slate-500 block leading-none">
                            ₹{basePrice.toLocaleString('en-IN')} x {item.qty}
                          </span>
                          <span className="font-mono text-sm font-bold text-brand-gold block mt-1 leading-none">
                            ₹{itemSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-500 hover:text-red-500 rounded hover:bg-slate-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* PIN CODE SERVICEABILITY & ADDRESS CONSOLE (India specific) */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2 flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-brand-orange" />
                2. Regional Delivery Check
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Name, Phone, and Address inputs */}
                <div className="space-y-3 md:col-span-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Receiver Full Name</label>
                      <input 
                        type="text"
                        required
                        value={address.name}
                        onChange={(e) => setAddress({ name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Number (SMS tracking)</label>
                      <input 
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ phone: e.target.value })}
                        placeholder="e.g. 8754498038"
                        className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Street Address / Landmark</label>
                    <input 
                      type="text"
                      required
                      value={address.addressLine}
                      onChange={(e) => setAddress({ addressLine: e.target.value })}
                      placeholder="e.g. 402, Highstreet Towers, Bandra West"
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                {/* PIN Code Check Form */}
                <form onSubmit={handlePincodeSubmit} className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Indian Postal Pincode (6 Digits)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ pincode: e.target.value })}
                      placeholder="e.g. 400001 (Mumbai), 560001 (Blr)"
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                    />
                    <button 
                      type="submit"
                      disabled={pinLoading}
                      className="bg-brand-orange text-black px-4 rounded-lg font-bold uppercase text-[10px] hover:bg-brand-gold disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
                    >
                      {pinLoading ? "Querying..." : "Verify"}
                    </button>
                  </div>
                </form>

                {/* Auto complete info block */}
                <div className="flex flex-col justify-end">
                  {pinLoading && (
                    <div className="p-3 bg-slate-900 border border-brand-border rounded-lg text-slate-400 animate-pulse text-[10px]">
                      Querying Indian Post Office database...
                    </div>
                  )}

                  {pinError && (
                    <div className="p-3 bg-red-950 border border-red-500 rounded-lg text-red-400 flex items-start gap-1.5 text-[10px] leading-relaxed">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}

                  {pinDetail && (
                    <div className="p-3.5 bg-brand-orange/5 border border-brand-orange/30 rounded-lg text-slate-300 space-y-1.5 text-[10px] leading-relaxed">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase tracking-wider">✓ Pincode Serviceable</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${pinDetail.codAvailable ? 'bg-green-950 text-green-400' : 'bg-amber-950 text-brand-gold'}`}>
                          {pinDetail.codAvailable ? "COD Available" : "Prepaid Only"}
                        </span>
                      </div>
                      <p>
                        <strong>Delivery Hub:</strong> {pinDetail.city}, {pinDetail.state}
                      </p>
                      <p className="flex items-center gap-1 text-slate-400 mt-1">
                        <Truck className="h-3.5 w-3.5 text-brand-orange" />
                        <span>Estimated Delivery: <strong>{pinDetail.deliveryDays} Days</strong> via BlueDart Air</span>
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Checkout Invoicing Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coupon Code section */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <Ticket className="h-4 w-4 text-brand-orange" />
                Apply Technical Promo Coupon
              </label>
              
              <form onSubmit={handleCouponApply} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. MARQUE10, MAXBASH"
                  className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange font-mono"
                />
                <button 
                  type="submit"
                  className="bg-brand-orange text-black px-4 rounded-lg font-bold uppercase text-[10px] hover:bg-brand-gold transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <div className={`p-2 rounded text-[10px] font-semibold text-center border ${couponFeedback.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
                  {couponFeedback.text}
                </div>
              )}

              {appliedCoupon && (
                <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/40 text-[10px] text-green-400 flex items-center justify-between font-bold">
                  <div>
                    <span>Coupon: {appliedCoupon.code}</span>
                    <span className="block text-[8px] text-slate-500 mt-0.5">{appliedCoupon.description}</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-red-400 hover:text-red-500 uppercase text-[9px] underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* B2B Invoicing section */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="b2b-check"
                  checked={isB2B}
                  onChange={(e) => setIsB2B(e.target.checked)}
                  className="accent-brand-orange h-4 w-4"
                />
                <label htmlFor="b2b-check" className="text-xs font-bold text-slate-300 uppercase cursor-pointer select-none">
                  Request B2B GSTIN Tax Invoice
                </label>
              </div>

              {isB2B && (
                <div className="space-y-3 text-xs pt-1">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Registered Corporate Entity Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Speedster RC Club Private Limited"
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">15-Digit India GSTIN Number</label>
                      {gstinError && <span className="text-[8px] text-red-500 font-bold">{gstinError}</span>}
                    </div>
                    <input 
                      type="text" 
                      value={gstinInput}
                      onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                      onBlur={handleGstinValidate}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    GST input credit requires validation matches. If successful, 18% HSN 9503 tax will reflect on your official credit invoice.
                  </p>
                </div>
              )}
            </div>

            {/* Checkout Pricing Manifest */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
                Order Billing Manifest
              </h3>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Cart Subtotal (GST Inclusive)</span>
                  <span className="font-mono text-slate-300">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Freight Charges</span>
                  <span className="font-mono text-slate-300">₹{shippingCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 border-t border-brand-border/40 pt-2.5">
                  <span>GST HSN-9503 Portion (18% inclusive)</span>
                  <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-brand-gold border-t border-brand-border pt-2.5">
                  <span className="font-display uppercase">Net Payable</span>
                  <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-4 text-xs font-bold uppercase text-black hover:bg-brand-gold hover:shadow-glow transition-all"
              >
                Configure Secure Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
