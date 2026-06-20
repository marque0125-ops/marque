"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "../../../store/useOrderStore";
import { useCartStore } from "../../../store/useCartStore";
import { useUIStore } from "../../../store/useUIStore";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import { trackPurchase } from "../../../utils/analytics";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Adding a slight delay to allow stores to hydrate
    const timer = setTimeout(() => {
      const cartStore = useCartStore.getState();
      const orderStore = useOrderStore.getState();
      const uiStore = useUIStore.getState();

      if (status === "PAYMENT_SUCCESS") {
        // Only create order if cart has items to prevent duplicate orders on refresh
        if (cartStore.cart.length > 0) {
          const grandTotal = cartStore.cart.reduce((sum, item) => sum + ((item.variant.priceOverride || item.product.price) * item.qty), 0);
          
          const isCodAdvance = orderId?.startsWith('CODADV_');
          const order = orderStore.createOrder(isCodAdvance ? 'COD' : 'UPI'); // Use COD or UPI
          
          order.id = orderId || order.id; // Override with PhonePe order ID if available
          order.status = "confirmed";
          order.paymentMethod = isCodAdvance ? 'COD' : 'Card';
          
          // Track PhonePe Purchase
          trackPurchase(order.id, grandTotal, 'INR');

          cartStore.clearCart();
          uiStore.showDialog({ 
            title: 'Notice', 
            message: `PAYMENT SUCCESSFUL! Your order ${order.id} is confirmed via PhonePe!` 
          });
        }
        
        router.push("/account");
      } else {
        uiStore.showDialog({ 
          title: 'Notice', 
          message: "Payment Failed or Canceled. Please try again." 
        });
        router.push("/cart");
      }
      
      setIsProcessing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, orderId, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="rounded-2xl border border-brand-border bg-slate-950 p-8 max-w-md w-full text-center space-y-6 animate-pulse-glow">
        <div className="flex justify-center">
          {status === 'PAYMENT_SUCCESS' ? (
             <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center text-green-400">
               <Check className="h-8 w-8" />
             </div>
          ) : status === 'PAYMENT_ERROR' ? (
             <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center text-red-400">
               <AlertTriangle className="h-8 w-8" />
             </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-brand-orange/10 border border-brand-orange flex items-center justify-center text-brand-orange animate-spin">
              <Loader2 className="h-8 w-8" />
            </div>
          )}
        </div>
        
        <h1 className="font-display text-2xl font-normal text-white uppercase">
          {status === 'PAYMENT_SUCCESS' ? 'Payment Successful' : status === 'PAYMENT_ERROR' ? 'Payment Failed' : 'Verifying Payment...'}
        </h1>
        
        <p className="text-slate-400 text-sm font-normal">
          {status === 'PAYMENT_SUCCESS' 
            ? 'Your payment was securely processed. Redirecting to your account dashboard...' 
            : status === 'PAYMENT_ERROR'
              ? 'There was an issue processing your payment. Redirecting back to cart...'
              : 'Please wait while we confirm your transaction with PhonePe.'}
        </p>
      </div>
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 text-brand-orange animate-spin" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
