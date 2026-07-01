"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto py-12 px-6">
      <div className="space-y-6 border-b border-brand-border pb-8">
        <div className="h-12 w-12 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange mb-6">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-white uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none mt-10 space-y-8 text-slate-300">
        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">1. Information We Collect</h2>
          <p>
            When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number, and email address. We use this information solely to fulfill your order and provide technical support.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">2. Consent & Usage</h2>
          <p>
            How do you get my consent? When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
          </p>
          <p>
            If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">3. Disclosure & Third-Party Services</h2>
          <p>
            We may disclose your personal information if we are required by law to do so. Our store utilizes third-party payment gateways (Razorpay and PhonePe) which have their own strict privacy policies regarding the information we are required to provide them for your purchase-related transactions.
          </p>
          <p>
            We recommend you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">4. Security</h2>
          <p>
            To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-display text-white uppercase">5. Contact Information</h2>
          <p>
            If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information, contact our Technical Garage support at <strong>marque0125@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
