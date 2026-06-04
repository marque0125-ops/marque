"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { Car, Mail, Phone, ShieldCheck, MapPin, Truck, HelpCircle } from "lucide-react";

export default function Footer() {
  const { setSelectedProduct } = useUIStore();
  const { setFilterBrand } = useProductStore();

  const selectBrand = (slug: string) => {
    setFilterBrand(slug);
    setSelectedProduct(null);
  };

  return (
    <footer className="border-t border-[#1e293b] bg-[#020617] pt-16 pb-8 text-[#9ca3af]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#1e293b]">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col gap-2 cursor-pointer group" onClick={() => setSelectedProduct(null)}>
              <div className="relative flex h-14 w-36 items-center justify-center rounded-xl bg-[#ffffff] overflow-hidden transition-transform duration-300 group-hover:scale-105 p-2">
                <Image 
                  src="/logo.png" 
                  alt="MARQUE Logo" 
                  fill
                  sizes="144px"
                  className="object-contain mix-blend-multiply" 
                />
              </div>
              <span className="font-display text-xl font-normal uppercase tracking-tighter text-[#ffffff] transition-colors group-hover:text-brand-orange mt-2">
                MARQUE
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#9ca3af]">
              India's premier e-commerce portal for hobby-grade remote control cars and performance accessories. Stocking international legends: Traxxas, Arrma, FMS, and Rlaarlo. We deliver track-ready engineering straight to your door with certified GST-inclusive pricing.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-normal text-[#64748b] tracking-wider">Payments Security</span>
              <div className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                <ShieldCheck className="h-4 w-4 text-brand-gold" />
                <span>PCI-Compliant Razorpay Gateway</span>
              </div>
            </div>
          </div>

          {/* Col 2: Brands */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-[#e2e8f0]">
              Elite Brands
            </h3>
            <ul className="space-y-2 text-xs text-[#9ca3af]">
              <li>
                <Link href="/shop" onClick={() => selectBrand('traxxas')} className="hover:text-brand-orange transition-colors">
                  Traxxas High-Performance
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => selectBrand('arrma')} className="hover:text-brand-orange transition-colors">
                  Arrma Designed Fast Tough
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => selectBrand('rlaarlo')} className="hover:text-brand-orange transition-colors">
                  Rlaarlo Aluminum Upgrades
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => selectBrand('fms')} className="hover:text-brand-orange transition-colors">
                  FMS Scale Realism
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => selectBrand('mjx')} className="hover:text-brand-orange transition-colors">
                  MJX Hyper Go Bashers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: India Operations */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-[#e2e8f0]">
              GST & Shipping Rules
            </h3>
            <ul className="space-y-3 text-xs text-[#9ca3af]">
              <li className="flex items-start gap-2">
                <Truck className="h-4.5 w-4.5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  <strong>MARQUE Logistics Desk</strong>: ST courier, DDTC COURIER, DELIVERY IN. All consignments tracked and updated manually by admin command.
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
            <h3 className="font-display text-sm font-normal uppercase tracking-wider text-[#e2e8f0]">
              MARQUE Technical Garage
            </h3>
            <p className="text-xs text-[#9ca3af]">
              Need technical support or custom part compatibility advice? Our expert RC pilots are ready to help.
            </p>
            <div className="space-y-2.5 text-xs text-[#cbd5e1]">
              <a href="tel:+918754498038" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>+91 87544 98038</span>
              </a>
              <a href="mailto:marque0125@gmail.com" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span>marque0125@gmail.com</span>
              </a>
              <p className="text-[10px] text-[#64748b]">
                Mon - Sat: 10:00 AM - 7:00 PM IST
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>© 2026 <a href="https://marque.co.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange font-normal text-[#ffffff]">MARQUE</a> Premium RC India. All rights reserved.</p>
            <span className="hidden md:inline text-[#334155]">|</span>
            <a href="https://marque.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold font-normal">marque.co.in</a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-orange">Privacy Policy</a>
            <Link href="/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-brand-orange">Terms of Service</Link>
            <Link href="/shipping" onClick={() => window.scrollTo(0, 0)} className="hover:text-brand-orange">Shipping Rates</Link>
            <a href="#" className="hover:text-brand-orange">Refund & Replacements</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
