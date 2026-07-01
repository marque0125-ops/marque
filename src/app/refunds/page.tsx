"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto py-12 px-6">
      <div className="space-y-6 border-b border-brand-border pb-8">
        <div className="h-12 w-12 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange mb-6">
          <RefreshCcw className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-white uppercase tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-slate-400 text-sm">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none mt-10 space-y-8 text-slate-300">
        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">1. Cancellation Policy</h2>
          <p>
            You may cancel your order at any time before it has been dispatched from our Chennai fulfillment hub. Once an order is dispatched (indicated by the generation of an AWB tracking number), it cannot be canceled.
          </p>
          <p>
            To request a cancellation, please email <strong>marque0125@gmail.com</strong> immediately with your Order ID.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">2. Return & Refund Conditions</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong>Unopened Items:</strong> Can be returned within 7 days of delivery for a full refund (minus two-way shipping costs). The factory seal and shrink wrap must be completely intact.</li>
            <li><strong>Opened/Operated Items:</strong> Due to the high-performance nature of hobby-grade RC vehicles, once a box is opened and a vehicle is driven, crashed, or modified, it is strictly non-returnable and non-refundable.</li>
            <li><strong>DOA (Dead on Arrival):</strong> If an electronic component (ESC, Motor, Receiver) is defective out of the box, you must report it with a clear unboxing video within 48 hours of delivery. We will arrange a replacement of the defective component free of charge upon technical verification.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">3. Refund Processing</h2>
          <p>
            Once your return is received and inspected by our Technical Garage, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and a credit will automatically be applied to your original method of payment (PhonePe/Razorpay/Card) within 5-7 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
