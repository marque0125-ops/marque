"use client";

import React from "react";
import { Shield, FileText, AlertTriangle, Box, Battery } from "lucide-react";

export default function TermsView() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-brand-orange mb-4 shadow-glow">
          <FileText className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal uppercase tracking-tight text-white leading-none">
          Terms & Conditions
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Please read these Terms and Conditions carefully before purchasing or operating MARQUE RC models. By using our site and products, you agree to the following terms.
        </p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm">
        {/* Section 1 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4">
            <Shield className="h-5 w-5 text-brand-orange" />
            <h2 className="font-display text-xl font-normal uppercase text-white">1. General Usage & Liability</h2>
          </div>
          <p>
            MARQUE RC provides hobby-grade remote control models designed for experienced enthusiasts. These are not toys. They contain small parts and involve complex mechanical systems. 
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-brand-orange">
            <li>Users under the age of 14 must be strictly supervised by an adult at all times during operation.</li>
            <li>MARQUE is not liable for any property damage, personal injury, or third-party liabilities resulting from the improper use, assembly, or modification of our RC vehicles.</li>
            <li>Always operate your RC vehicles in safe, designated, and legal open spaces away from pedestrians and active roadways.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Battery className="h-48 w-48 text-brand-orange" />
          </div>
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4 relative z-10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="font-display text-xl font-normal uppercase text-white">2. LiPo Battery Safety & Handling</h2>
          </div>
          <p className="relative z-10">
            Lithium Polymer (LiPo) batteries require strict adherence to safety guidelines. Mishandling, overcharging, or physical damage can lead to catastrophic failure, including fire.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-red-500 relative z-10">
            <li>Never leave a charging LiPo battery unattended. Always use a fire-retardant charging bag.</li>
            <li>Use only balance chargers explicitly approved for LiPo chemistry. Never use NiMH/NiCd chargers.</li>
            <li>Do not operate vehicles with punctured, swollen, or physically deformed batteries.</li>
            <li>MARQUE assumes zero liability for fire damage, injury, or loss caused by the improper charging, storage, or discharging of LiPo batteries.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4">
            <Box className="h-5 w-5 text-brand-gold" />
            <h2 className="font-display text-xl font-normal uppercase text-white">3. Returns, Refunds & Warranty</h2>
          </div>
          <p>
            Due to the nature of hobby-grade electronics and mechanics, our return policy is strict to ensure the integrity of our inventory.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-brand-gold">
            <li><strong>Unopened Items:</strong> Can be returned within 7 days of delivery for a full refund (minus shipping costs). The factory seal must be intact.</li>
            <li><strong>Opened/Operated Items:</strong> Once a vehicle has been driven, crashed, or modified, it cannot be returned for a refund.</li>
            <li><strong>DOA (Dead on Arrival):</strong> If an electronic component (ESC, Motor, Receiver) is defective out of the box, you must report it within 48 hours of delivery. We will replace the defective component free of charge upon verification.</li>
            <li>Damage resulting from crashes, water submersion (for non-waterproof models), or unauthorized modifications voids any implied warranty.</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center text-xs text-slate-500">
        <p>Last Updated: May 2026</p>
        <p>For legal inquiries, please contact legal@marque.co.in</p>
      </div>
    </div>
  );
}
