"use client";

import React, { useState } from "react";
import { Heart, Car } from "lucide-react";
import { Product } from "../data/mockData";
import { BRANDS } from "../data/mockData";
import { useCartStore } from "../store/useCartStore";
import { useUIStore } from "../store/useUIStore";

interface ProductCardItemProps {
  p: Product;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  onProductClick: (p: Product) => void;
}

// Map color names to approximate hex codes for swatches
const getColorHex = (colorName: string): string => {
  const name = colorName.toLowerCase();
  if (name.includes("red")) return "#EF4444";
  if (name.includes("blue")) return "#3B82F6";
  if (name.includes("green")) return "#10B981";
  if (name.includes("orange")) return "#F97316";
  if (name.includes("yellow")) return "#EAB308";
  if (name.includes("black")) return "#111827";
  if (name.includes("white")) return "#F9FAFB";
  if (name.includes("silver")) return "#9CA3AF";
  return "#6B7280"; // fallback gray
};

export function ProductCardItem({ p, wishlist, toggleWishlist, onProductClick }: ProductCardItemProps) {
  const { addToCart } = useCartStore();
  const { showDialog } = useUIStore();
  const brand = BRANDS.find((b) => b.id === p.brandId);
  const [selectedVariant, setSelectedVariant] = useState(p.variants[0]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    showDialog({
      title: 'Added to Cart',
      message: `${product.name} (${selectedVariant.attributes.color || "Standard"}) has been added to your cart.`
    });
  };

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    const variantForColor = p.variants.find(v => v.attributes.color === color);
    if (variantForColor) {
      setSelectedVariant(variantForColor);
    }
  };

  const currentImage = selectedVariant?.imageUrl || p.images[0];
  const uniqueColors = Array.from(new Set(p.variants.map(v => v.attributes.color).filter(Boolean))) as string[];

  return (
    <div
      onClick={() => onProductClick(p)}
      className="group cursor-pointer flex flex-col rounded-2xl border border-brand-border bg-slate-950 overflow-hidden hover:border-brand-orange hover:shadow-2xl transition-all duration-300 relative"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 border-b border-brand-border">
        <img
          src={currentImage}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Absolute Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[8px] font-bold text-brand-orange border border-brand-orange/30 uppercase tracking-wider">
            {p.scale} Scale
          </span>
          <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[8px] font-bold text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
            {p.speedKmh}+ KM/H
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(p.id);
          }}
          className="absolute top-3 right-3 z-10 rounded-full bg-slate-950/80 p-2 border border-slate-800 text-slate-400 hover:text-brand-orange hover:scale-110 transition-all"
        >
          <Heart className={`h-3.5 w-3.5 ${wishlist.includes(p.id) ? 'fill-brand-orange text-brand-orange' : ''}`} />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider font-display">
              {brand?.name}
            </span>
            <span className="text-base font-black text-brand-gold font-display">
              ₹{p.price.toLocaleString('en-IN')}
            </span>
          </div>
          <h3 className="font-display text-sm font-black text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
            {p.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2">
            {p.description}
          </p>
        </div>

        {/* Color Swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            {uniqueColors.map((color, idx) => {
              const isSelected = selectedVariant.attributes.color === color;
              return (
                <button
                  key={idx}
                  onClick={(e) => handleColorClick(e, color)}
                  title={color}
                  className={`h-4 w-4 rounded-full border-2 transition-all ${isSelected ? 'border-brand-orange scale-110 shadow-glow' : 'border-slate-800 hover:border-slate-500'}`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              );
            })}
          </div>
        )}

        {/* Impel styled car specs row */}
        <div className="grid grid-cols-3 gap-2 border-t border-brand-border pt-4 text-center">
          <div className="bg-slate-900/50 rounded-lg p-2 border border-brand-border">
            <span className="text-[8px] text-slate-500 block uppercase font-bold">Terrain</span>
            <span className="text-[10px] text-slate-300 font-extrabold block uppercase truncate">{p.terrainType}</span>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 border border-brand-border">
            <span className="text-[8px] text-slate-500 block uppercase font-bold">Build</span>
            <span className="text-[10px] text-slate-300 font-extrabold block uppercase truncate">{p.buildType}</span>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 border border-brand-border">
            <span className="text-[8px] text-slate-500 block uppercase font-bold">ESC Max</span>
            <span className="text-[10px] text-slate-300 font-extrabold block uppercase truncate">{selectedVariant?.attributes?.battery?.split(' ')[0] || p.variants[0]?.attributes?.battery?.split(' ')[0] || "LiPo"}</span>
          </div>
        </div>

        {/* Cart Action */}
        <div className="border-t border-brand-border pt-4 flex items-center justify-between">
          <span className="text-[9px] text-slate-500 line-through">
            ₹{p.comparePrice.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => handleQuickAdd(e, p)}
            className="rounded-lg bg-brand-orange hover:bg-brand-gold text-black font-black uppercase px-4 py-2 text-xs transition-colors flex items-center gap-1"
          >
            <Car className="h-3.5 w-3.5" />
            Buy Rig
          </button>
        </div>
      </div>
    </div>
  );
}
