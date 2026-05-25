"use client";

import React from "react";
import Image from "next/image";
import { useUIStore } from "../store/useUIStore";
import { useProductStore } from "../store/useProductStore";
import { Car, Mail, Phone, ShieldCheck, MapPin, Truck, HelpCircle } from "lucide-react";

export default function Footer() {
  const { setView, setSelectedProduct } = useUIStore();
  const { setFilterBrand } = useProductStore();

  const selectBrand = (slug: string) => {
    setFilterBrand(slug);
    setSelectedProduct(null);
    setView('shop');
  };

  return (
    <footer className="border-t border-brand-border bg-slate-950/80 pt-16 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-border">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setSelectedProduct(null); setView('home'); }}>
              <div className="relative flex h-10 w-28 items-center justify-center rounded bg-white overflow-hidden border border-brand-border/60 transition-colors group-hover:border-brand-orange p-1">
                <Image 
                  src="/marque-new-logo.png" 
                  alt="MARQUE Logo" 
                  fill
                  sizes="112px"
                  className="object-contain mix-blend-multiply" 
                />
              </div>
              <span className="font-display text-xl font-bold uppercase tracking-tighter text-white transition-colors group-hover:text-brand-orange">
                MARQUE
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              India's premier e-commerce portal for hobby-grade remote control cars and performance accessories. Stocking international legends: Traxxas, Arrma, FMS, and Rlaarlo. We deliver track-ready engineering straight to your door with certified GST-inclusive pricing.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Payments Security</span>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-brand-gold" />
                <span>PCI-Compliant Razorpay Gateway</span>
              </div>
            </div>
          </div>

          {/* Col 2: Brands */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
              Elite Brands
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => selectBrand('traxxas')} className="hover:text-brand-orange transition-colors">
                  Traxxas High-Performance
                </button>
              </li>
              <li>
                <button onClick={() => selectBrand('arrma')} className="hover:text-brand-orange transition-colors">
                  Arrma Designed Fast Tough
                </button>
              </li>
              <li>
                <button onClick={() => selectBrand('rlaarlo')} className="hover:text-brand-orange transition-colors">
                  Rlaarlo Aluminum Upgrades
                </button>
              </li>
              <li>
                <button onClick={() => selectBrand('fms')} className="hover:text-brand-orange transition-colors">
                  FMS Scale Realism
                </button>
              </li>
              <li>
                <button onClick={() => selectBrand('mjx')} className="hover:text-brand-orange transition-colors">
                  MJX Hyper Go Bashers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: India Operations */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
              GST & Shipping Rules
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <Truck className="h-4.5 w-4.5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  <strong>MARQUE Logistics Desk</strong>. All consignments tracked and updated manually by admin command.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <span>
                  <strong>GST (18%) auto-applied</strong>. HSN Code 9503 standard. Business input credit (GSTIN invoices auto-generated).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4.5 w-4.5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  <strong>Chennai Fulfillment Hub</strong>. Located at Medavakkam main road, Madipakkam, Chennai 600091. Courier coverage to over 24,000 PIN codes.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Support */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
              MARQUE Technical Garage
            </h3>
            <p className="text-xs">
              Need technical support or custom part compatibility advice? Our expert RC pilots are ready to help.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a href="tel:+918754498038" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>+91 87544 98038</span>
              </a>
              <a href="mailto:marque0125@gmail.com" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span>marque0125@gmail.com</span>
              </a>
              <p className="text-[10px] text-slate-500">
                Mon - Sat: 10:00 AM - 7:00 PM IST
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>© 2026 <a href="https://marque.co.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange font-bold">MARQUE</a> Premium RC India. All rights reserved.</p>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="https://marque.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold font-semibold">marque.co.in</a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-orange">Privacy Policy</a>
            <button onClick={() => { setView('terms'); window.scrollTo(0, 0); }} className="hover:text-brand-orange">Terms of Service</button>
            <button onClick={() => { setView('shipping'); window.scrollTo(0, 0); }} className="hover:text-brand-orange">Shipping Rates</button>
            <a href="#" className="hover:text-brand-orange">Refund & Replacements</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
