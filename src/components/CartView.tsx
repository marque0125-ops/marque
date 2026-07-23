"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUIStore } from "../store/useUIStore";
import { useOrderStore } from "../store/useOrderStore";
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
  Zap,
  Search,
  CheckCircle2,
  Package
} from "lucide-react";
import { trackInitiateCheckout, trackPurchase } from "../utils/analytics";

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
    pincode,
    pinDetail,
    pinLoading,
    pinError,
    checkPincode,
    showDialog,
    brandsList
  } = useUIStore();
  const router = useRouter();

  const {
    address,
    setAddress,
    isAuthenticated
  } = useAuthStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
  const productShippingTotal = cart.reduce((sum, item) => sum + (item.product.shippingPrice || 0) * item.qty, 0);

  const shippingCost = productShippingTotal > 0 ? productShippingTotal : (pinDetail ? pinDetail.shippingCost : 200);

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

  const handleProceed = () => {
    if (cart.length === 0) return;

    if (!isAuthenticated) {
      showDialog({ 
        title: 'Authentication Required', 
        message: 'To ensure a secure checkout and proper order tracking, please sign in or create an account first.' 
      });
      setTimeout(() => {
        router.push('/account');
      }, 1500);
      return;
    }

    if (!address.city || !address.state || !address.pincode) {
      showDialog({ title: 'Notice', message: "DELIVERY DETAILS REQUIRED: Please fill in your city, state, and pincode." });
      return;
    }

    if (!address.name || !address.phone || !address.addressLine) {
      showDialog({ title: 'Notice', message: "DELIVERY DETAILS REQUIRED: Please fill in receiver's name, phone, and complete street address." });
      return;
    }

    // Track InitiateCheckout event
    trackInitiateCheckout(grandTotal, cart.length, 'INR');

    setCheckoutStep(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const [checkoutStep, setCheckoutStep] = useState(false);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const scriptId = 'razorpay-checkout-js';
      if (document.getElementById(scriptId)) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (method: 'UPI' | 'Card' | 'COD') => {
    if (method === 'COD') {
      const store = useOrderStore.getState();
      const order = store.createOrder(method);
      
      // Track COD Purchase
      trackPurchase(order.id, grandTotal, 'INR');

      router.push('/account');
      setCheckoutStep(false);
      clearCart();
      setTimeout(() => showDialog({ title: 'Notice', message: `Order ${order.id} placed via Cash on Delivery!` }), 500);
      return;
    }

    // Ensure Razorpay script is loaded dynamically right before we need it
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      showDialog({ title: 'Notice', message: "Failed to load Razorpay SDK. Please check your internet connection or adblocker." });
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
        showDialog({ title: 'Notice', message: "Payment initialization failed from backend. Please try again." });
        return;
      }

      // Ensure NEXT_PUBLIC_RAZORPAY_KEY_ID is available (fallback to the string if env variable failed to load in browser)
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SoL1lxm6LzPqie";

      // Initialize Razorpay Popup
      const options = {
        key: rzpKey,
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
          order.status = "confirmed";
          order.paymentMethod = method;

          // Track Razorpay Purchase
          trackPurchase(order.id, grandTotal, 'INR');

          router.push('/account');
          setCheckoutStep(false);
          clearCart();
          setTimeout(() => {
            showDialog({ title: 'Notice', message: `PAYMENT SUCCESSFUL! Razorpay Payment ID: ${response.razorpay_payment_id}. Your order ${order.id} is confirmed!` });
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

      const RazorpayConstructor = (window as any).Razorpay;
      if (!RazorpayConstructor) {
        showDialog({ title: 'Notice', message: "Razorpay is not available on window. Please try again." });
        return;
      }

      const rzp = new RazorpayConstructor(options);
      rzp.on('payment.failed', function (response: any) {
        showDialog({ title: 'Notice', message: `Payment Failed: ${response.error.description}` });
      });
      rzp.open();

    } catch (err: any) {
      console.error("Razorpay trigger error:", err);
      showDialog({ title: 'Notice', message: `Error securely contacting payment gateway: ${err.message}` });
    }
  };

  const handlePhonePeCheckout = async (isCodAdvance: boolean = false) => {
    try {
      showDialog({ title: 'Notice', message: "Initializing PhonePe Secure Checkout..." });
      
      const paymentAmount = isCodAdvance ? Math.round(grandTotal * 0.4) : grandTotal;

      const res = await fetch('/api/phonepe/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paymentAmount, isCodAdvance })
      });

      const data = await res.json();

      if (!data || !data.redirectUrl) {
        showDialog({ title: 'Notice', message: "PhonePe initialization failed from backend. Please try again." });
        return;
      }

      // Redirect the user to PhonePe page
      window.location.href = data.redirectUrl;

    } catch (err: any) {
      console.error("PhonePe trigger error:", err);
      showDialog({ title: 'Notice', message: `Error securely contacting payment gateway: ${err.message}` });
    }
  };

  // If in Checkout step, let's render the checkout page. We can handle it in the same file or write it dynamically!
  if (checkoutStep) {
    return (
      <div className="space-y-8 pb-20">
        {/* Checkout Header */}
        <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6">
          <button
            onClick={() => setCheckoutStep(false)}
            className="text-xs text-slate-400 hover:text-brand-orange uppercase font-normal flex items-center gap-1 mb-2"
          >
            <Minus className="h-3 w-3" /> Back to Shopping Cart
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white">
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
              <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
                1. Delivery Manifest & Destination
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase font-normal text-[9px]">Receiver Name</span>
                  <span className="text-slate-200 font-normal">{address.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-normal text-[9px]">Contact Mobile</span>
                  <span className="text-slate-200 font-normal">{address.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block uppercase font-normal text-[9px]">Street Address</span>
                  <span className="text-slate-200 font-normal leading-relaxed">{address.addressLine}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-normal text-[9px]">City</span>
                  <span className="text-slate-200 font-normal">{address.city}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-normal text-[9px]">State & Pincode</span>
                  <span className="text-slate-200 font-normal">{address.state} - {address.pincode}</span>
                </div>
              </div>
            </div>

            {/* SECURE PAYMENT GATEWAY DRAWER */}
            <div className="rounded-2xl border border-brand-orange bg-slate-900/10 p-6 space-y-6 relative overflow-hidden animate-pulse-glow">
              <div className="absolute top-0 right-0 bg-brand-orange text-white sm:text-black font-normal uppercase text-[9px] px-3 py-1 rounded-bl">
                Secure Live Checkout
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block">Select Secure Payment Gateway</span>
                <h3 className="font-display text-base font-normal text-white uppercase flex items-center gap-1.5">
                  <Zap className="h-5 w-5 text-brand-orange animate-bounce" />
                  India UPI / Credit Card Portal
                </h3>
              </div>

              {/* PhonePe Option */}
              <button
                  onClick={() => handlePhonePeCheckout(false)}
                  className="w-full p-4 rounded-xl border border-brand-border bg-slate-950 text-left hover:border-brand-orange hover:bg-slate-900 flex flex-col justify-between transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-normal uppercase block flex items-center gap-1">
                      <Zap className="h-3 w-3 text-brand-orange" />
                      PhonePe PG
                    </span>
                    <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30">Recommended</span>
                  </div>
                  <span className="text-xs font-normal text-slate-200 mt-2 block">All UPI Apps, Cards, Netbanking via PhonePe</span>
              </button>

              <div className="grid grid-cols-1 gap-4">
                {/* Razorpay Option - Hidden as requested, uncomment to bring back
                <button
                  onClick={() => handlePlaceOrder('Card')}
                  className="p-4 rounded-xl border border-brand-border bg-slate-950 text-left hover:border-brand-orange hover:bg-slate-900 flex flex-col justify-between transition-all"
                >
                  <span className="text-[10px] text-slate-500 font-normal uppercase block">Razorpay PG</span>
                  <span className="text-xs font-normal text-slate-200 mt-2 block">Alternative Gateway</span>
                </button>
                */}

                {/* COD option */}
                {grandTotal <= 5000 && (
                  <button
                    onClick={() => handlePhonePeCheckout(true)}
                    className="p-4 rounded-xl border flex flex-col justify-between transition-all border-brand-border bg-slate-950 hover:border-brand-orange hover:bg-slate-900 text-slate-200 cursor-pointer"
                  >
                    <div className="flex justify-between w-full gap-2">
                      <span className="text-[10px] text-slate-500 font-normal uppercase">Cash on Delivery (40% Advance)</span>
                    </div>
                    <span className="text-xs font-normal mt-2 block text-left">
                      Pay ₹{Math.round(grandTotal * 0.4).toLocaleString('en-IN')} Advance Online, Rest to Courier
                    </span>
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                By pressing any gateway method above, you will be securely redirected to the payment provider. System automatically reserves stock.
              </p>
            </div>

          </div>

          {/* Right Side: Invoice Subtotal Summary */}
          <div className="lg:col-span-5 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
              Order Receipt Invoice
            </h3>

            <div className="divide-y divide-brand-border text-xs space-y-3.5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between pt-3.5 first:pt-0">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-slate-200 font-normal block">
                      {item.product.name} {item.variant.id.includes('-with-battery') ? '+ Power Bundle' : ''}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-display">
                      Variant: {item.variant.attributes.color || "Default"} • Qty: {item.qty}
                    </span>
                  </div>
                  <span className="font-mono font-normal text-slate-300">
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
                <div className="flex justify-between text-green-400 font-normal">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-mono text-slate-300">₹{shippingCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm font-normal text-brand-gold border-t border-brand-border pt-2.5">
                <span className="font-display uppercase">Net Payable INR (₹)</span>
                <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-8 pb-20">

      {/* Page Header */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6">
        <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block">Shopping Basket</span>
        <h1 className="font-display text-2xl sm:text-3xl font-normal uppercase text-white mt-1">
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
          <h3 className="font-display text-lg font-normal text-white uppercase">Your cart is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore our collection of brushless monster trucks, street bashers, or scale crawlers to build your fleet.
          </p>
          <button
            onClick={() => { router.push('/shop'); }}
            className="bg-brand-orange text-white sm:text-black font-normal text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
          >
            Visit Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-brand-border bg-slate-950 overflow-hidden">
              <div className="p-4 bg-slate-900/60 border-b border-brand-border flex items-center justify-between text-xs font-normal text-slate-300">
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
                  const brand = brandsList.find(b => b.id === item.product.brandId);

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
                          <span className="text-[10px] text-brand-orange font-normal uppercase tracking-wider block leading-none font-display">
                            {brand?.name}
                          </span>
                          <span className="text-xs font-normal text-white block leading-snug">
                            {item.product.name}
                          </span>
                          <span className="text-[9px] text-slate-500 block leading-none font-mono">
                            SKU: {item.variant.sku}
                          </span>
                          <div className="flex flex-col gap-1 pt-1 text-[9px] text-slate-400 font-normal font-display">
                            <div className="flex gap-2">
                              <span>Color: {item.variant.attributes.color || "Standard"}</span>
                              <span>•</span>
                              <span>Power: {item.variant.attributes.battery || "Rechargeable"}</span>
                            </div>
                            {item.variant.id.includes('-with-battery') && item.product.batteryAddonPrice && (
                              <div className="text-brand-orange">
                                + Power Bundle Add-on (₹{item.product.batteryAddonPrice.toLocaleString('en-IN')})
                              </div>
                            )}
                            {item.product.shippingPrice && item.product.shippingPrice > 0 ? (
                              <div className="text-slate-400">
                                + Shipping (₹{item.product.shippingPrice.toLocaleString('en-IN')} / unit)
                              </div>
                            ) : null}
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
                          <span className="w-8 text-center text-xs font-normal font-mono text-white">
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
                          <span className="font-mono text-sm font-normal text-brand-gold block mt-1 leading-none">
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
              <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2 flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-brand-orange" />
                2. Regional Delivery Check
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                {/* Name, Phone, and Address inputs */}
                <div className="space-y-3 md:col-span-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">Receiver Full Name</label>
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
                      <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">Contact Number (SMS tracking)</label>
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
                    <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">Street Address / Landmark</label>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ city: e.target.value })}
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider block">State</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ state: e.target.value })}
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-normal uppercase tracking-wider block">Pincode (6 Digits)</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ pincode: e.target.value })}
                      placeholder="e.g. 400001"
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Checkout Invoicing Sidebar */}
          <div className="lg:col-span-5 space-y-6">


            {/* Checkout Pricing Manifest */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
              <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 border-b border-brand-border pb-2">
                Order Billing Manifest
              </h3>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Cart Subtotal (GST Inclusive)</span>
                  <span className="font-mono text-slate-300">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400 font-normal">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-mono text-slate-300">₹{shippingCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-normal text-brand-gold border-t border-brand-border pt-2.5">
                  <span className="font-display uppercase">Net Payable</span>
                  <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-4 text-xs font-normal uppercase text-white sm:text-black hover:bg-brand-gold hover:shadow-glow transition-all"
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
