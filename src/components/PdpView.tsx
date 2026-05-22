"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { BRANDS, Product, ProductVariant } from "../data/mockData";
import { 
  Heart, 
  Star, 
  ChevronLeft, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Check, 
  MessageSquare,
  Sparkles,
  Play,
  RotateCw,
  Eye,
  AlertTriangle,
  X
} from "lucide-react";

export default function PdpView() {
  const { addToCart } = useCartStore();
  const { 
    products,
    reviews,
    addProductReview,
    wishlist,
    toggleWishlist
  } = useProductStore();
  const {
    selectedProduct,
    setSelectedProduct,
    setView
  } = useUIStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'standard' | '360'>('standard');
  const [rotatorAngle, setRotatorAngle] = useState(0);
  
  // Selected variant state
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBattery, setSelectedBattery] = useState("");
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  
  // Upgrade parts selection
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  
  // Video overlay
  const [showVideo, setShowVideo] = useState(false);
  
  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Sync state on product change
  useEffect(() => {
    if (selectedProduct) {
      // Set default attributes from first variant
      const firstVariant = selectedProduct.variants[0];
      setSelectedColor(firstVariant.attributes.color || "");
      setSelectedBattery(firstVariant.attributes.battery || "");
      setActiveVariant(firstVariant);
      setActiveImageIndex(0);
      setViewMode('standard');
      setSelectedParts([]);
      setReviewSuccess(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const brand = BRANDS.find(b => b.id === selectedProduct.brandId);
  const isWished = wishlist.includes(selectedProduct.id);

  // Find variant matching current attributes
  const handleAttributeChange = (newColor: string, newBattery: string) => {
    let found = selectedProduct.variants.find(
      v => (v.attributes.color === newColor || !v.attributes.color) && 
           (v.attributes.battery === newBattery || !v.attributes.battery)
    );

    if (!found) {
      if (newColor !== selectedColor) {
        found = selectedProduct.variants.find(v => v.attributes.color === newColor);
        if (found) newBattery = found.attributes.battery || "";
      } else if (newBattery !== selectedBattery) {
        found = selectedProduct.variants.find(v => v.attributes.battery === newBattery);
        if (found) newColor = found.attributes.color || "";
      }
    }

    setSelectedColor(newColor);
    setSelectedBattery(newBattery);

    if (found) {
      setActiveVariant(found);
      if (found.imageUrl) {
        const idx = selectedProduct.images.indexOf(found.imageUrl);
        if (idx !== -1) {
          setActiveImageIndex(idx);
        } else {
          setActiveImageIndex(-1);
        }
      }
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:video')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  // Get active price
  const activePrice = activeVariant?.priceOverride || selectedProduct.price;
  const activeComparePrice = selectedProduct.comparePrice;

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);

  // Add to cart
  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCart(selectedProduct, activeVariant, 1);
    
    // Also add selected upgrade parts
    selectedParts.forEach(partSku => {
      const part = selectedProduct.compatibleParts.find(p => p.sku === partSku);
      if (part) {
        // Build a mock accessory product
        const accessoryProduct: Product = {
          id: `part-${part.sku}`,
          brandId: selectedProduct.brandId,
          categoryId: "parts",
          name: `${part.name} (Compatible with ${selectedProduct.name})`,
          slug: `part-${part.sku}`,
          description: `Authorized upgrade part. SKU: ${part.sku}`,
          price: part.price,
          comparePrice: Math.round(part.price * 1.15),
          sku: part.sku,
          weightGrams: 200,
          scale: selectedProduct.scale,
          terrainType: selectedProduct.terrainType,
          isFeatured: false,
          isActive: true,
          speedKmh: 0,
          buildType: "RTR",
          images: [selectedProduct.images[0]],
          whatsInTheBox: ["Authorized accessory pack"],
          specs: {},
          compatibleParts: [],
          variants: [{ id: `var-${part.sku}`, name: "Standard", sku: part.sku, stockQty: 99, attributes: {} }],
          stockQty: 99,
          averageRating: 5,
          reviewCount: 1
        };
        addToCart(accessoryProduct, accessoryProduct.variants[0], 1);
      }
    });

    // Send to cart
    setView('cart');
  };

  const handleTogglePart = (sku: string) => {
    if (selectedParts.includes(sku)) {
      setSelectedParts(selectedParts.filter(s => s !== sku));
    } else {
      setSelectedParts([...selectedParts, sku]);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !newTitle || !newBody) return;

    addProductReview({
      productId: selectedProduct.id,
      userName: reviewerName,
      rating: newRating,
      title: newTitle,
      body: newBody,
      verifiedPurchase: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
    });

    setReviewSuccess(true);
    setNewTitle("");
    setNewBody("");
    setReviewerName("");
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Related products (same brand or same terrain)
  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.brandId === selectedProduct.brandId || p.terrainType === selectedProduct.terrainType))
    .slice(0, 3);

  // Available variants fields
  const uniqueColors = Array.from(new Set(selectedProduct.variants.map(v => v.attributes.color).filter(Boolean)));
  const uniqueBatteries = Array.from(new Set(selectedProduct.variants.map(v => v.attributes.battery).filter(Boolean)));

  return (
    <div className="space-y-12 pb-20">
      
      {/* Back button */}
      <button 
        onClick={() => { setSelectedProduct(null); setView('shop'); }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-orange uppercase transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to RC Garage
      </button>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Images Gallery & Interactive 360 Rotator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-border bg-slate-950 flex items-center justify-center">
            
            {/* View Mode: STANDARD vs 360 */}
            {viewMode === 'standard' ? (
              <img 
                src={activeImageIndex === -1 ? activeVariant?.imageUrl : selectedProduct.images[activeImageIndex]} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative">
                <img 
                  src={selectedProduct.images[rotatorAngle % selectedProduct.images.length]} 
                  alt="360 rotation view"
                  className="w-full h-full object-cover"
                />
                
                {/* 360 degree radial scanner overlay effect */}
                <div className="absolute inset-0 border border-brand-orange/20 rounded-2xl pointer-events-none carbon-overlay opacity-30" />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase bg-black/80 px-2 py-1 rounded border border-brand-orange/30">
                  <RotateCw className="h-3.5 w-3.5 animate-spin" /> Interactive 360° Booth
                </div>
              </div>
            )}

            {/* Video overlay play trigger */}
            {selectedProduct.videoUrl && viewMode === 'standard' && (
              <button 
                onClick={() => setShowVideo(true)}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-black hover:bg-brand-gold shadow-md uppercase tracking-wider"
              >
                <Play className="h-4 w-4 fill-black stroke-none" /> Play Track Video
              </button>
            )}
          </div>



          {/* Controls depending on mode */}
          {viewMode === 'standard' ? (
            <div className="grid grid-cols-4 gap-4">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square w-full rounded-xl overflow-hidden border bg-slate-950 transition-all ${activeImageIndex === idx ? 'border-brand-orange shadow-glow' : 'border-brand-border opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-brand-border">
              <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wide">
                <span>Drag to Rotate Vehicle</span>
                <span className="text-brand-orange font-mono">Angle Frame: {rotatorAngle + 1} / {selectedProduct.images.length}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={selectedProduct.images.length - 1}
                value={rotatorAngle}
                onChange={(e) => setRotatorAngle(parseInt(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 text-center">
                Simulates real product photo turntable testing angles. Drag right to rotate 360°.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Specifications and Purchase configurations */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Brand story & titles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-orange font-bold uppercase tracking-widest font-display">
                {brand?.name} AUTHORIZED
              </span>
              <button 
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="p-2 rounded-full border border-brand-border bg-slate-900 text-slate-400 hover:text-brand-orange"
              >
                <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
              </button>
            </div>
            
            <h1 className="font-display text-3xl font-black uppercase text-white leading-tight">
              {selectedProduct.name}
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-0.5 text-brand-gold">
                <Star className="h-4.5 w-4.5 fill-brand-gold" />
                {selectedProduct.averageRating} ({selectedProduct.reviewCount} customer reviews)
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 uppercase tracking-wider">{selectedProduct.buildType} Class</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Pricing panel */}
          <div className="p-4 rounded-xl border border-brand-border bg-slate-900/40 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MARQUE Direct pricing (inclusive of 18% GST)</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-gold font-display">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-slate-500 line-through">
                ₹{activeComparePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-green-400 font-bold uppercase">
                Save ₹{(activeComparePrice - activePrice).toLocaleString('en-IN')}!
              </span>
            </div>
          </div>

          {/* COLOR SWATCH SELECTOR */}
          {uniqueColors.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Livery Color: <span className="text-brand-orange font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {uniqueColors.map((color: any, idx) => {
                  const matchingVariant = selectedProduct.variants.find(v => v.attributes.color === color);
                  const isOutOfStock = matchingVariant ? matchingVariant.stockQty === 0 : false;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAttributeChange(color, selectedBattery)}
                      disabled={isOutOfStock}
                      className={`relative px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${isOutOfStock ? 'border-dashed border-slate-800 text-slate-600 cursor-not-allowed bg-slate-950/40' : selectedColor === color ? 'bg-brand-orange text-black border-brand-orange shadow-glow' : 'border-brand-border bg-slate-900 hover:border-slate-600 text-slate-300'}`}
                    >
                      {color}
                      {matchingVariant && matchingVariant.stockQty < 3 && matchingVariant.stockQty > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-brand-gold text-[8px] font-black text-black px-1 leading-normal animate-pulse">
                          Low
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BATTERY BUNDLE SELECTOR */}
          {uniqueBatteries.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Power Bundle (Includes Chargers & High-Discharge LiPos):
              </label>
              <div className="space-y-2">
                {uniqueBatteries.map((battery: any, idx) => {
                  const matchingVariant = selectedProduct.variants.find(v => v.attributes.battery === battery);
                  const activePriceForThis = matchingVariant?.priceOverride || selectedProduct.price;
                  const stock = matchingVariant?.stockQty || 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAttributeChange(selectedColor, battery)}
                      disabled={stock === 0}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${stock === 0 ? 'opacity-40 border-slate-800 cursor-not-allowed' : selectedBattery === battery ? 'bg-brand-orange/10 border-brand-orange text-white' : 'border-brand-border bg-slate-900/60 hover:bg-slate-900 text-slate-300'}`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{battery}</span>
                        <span className="text-[10px] text-slate-400">Stock Status: {stock > 0 ? `${stock} available` : "Out of stock"}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-gold">₹{activePriceForThis.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* LIVE STOCK BADGES & CTA BUTTONS */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-xs">
              {activeVariant && activeVariant.stockQty === 0 ? (
                <div className="flex items-center gap-1.5 text-red-500 font-bold uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" /> Out of stock for this configuration
                </div>
              ) : activeVariant && activeVariant.stockQty < 3 ? (
                <div className="flex items-center gap-1.5 text-brand-orange font-bold uppercase tracking-wider animate-pulse">
                  <AlertTriangle className="h-4 w-4" /> HURRY! Only {activeVariant.stockQty} rigs remaining in Chennai warehouse!
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-400 font-bold uppercase tracking-wider">
                  <Check className="h-4 w-4" /> Ready to Race - Leaves fulfillment warehouse in 24 hours
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={!activeVariant || activeVariant.stockQty === 0}
                className="flex-1 group flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-4 text-sm font-bold text-black hover:bg-brand-gold hover:shadow-glow disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none transition-all uppercase tracking-wider"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                Configure & Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* COMPATIBLE HIGH-PERFORMANCE UPGRADE PARTS CROSS-SELL */}
      {selectedProduct.compatibleParts.length > 0 && (
        <section className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 md:p-8 space-y-6">
          <div>
            <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">Technical Upgrades</span>
            <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Recommended Accessories & Power Packs</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select compatible factory parts below. They will be added to your bundle when you buy the rig.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedProduct.compatibleParts.map((part) => {
              const isChecked = selectedParts.includes(part.sku);

              return (
                <div 
                  key={part.sku}
                  onClick={() => handleTogglePart(part.sku)}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${isChecked ? 'bg-brand-orange/5 border-brand-orange' : 'border-brand-border bg-slate-900/40 hover:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-brand-orange border-brand-orange text-black' : 'border-slate-800 bg-slate-950'}`}>
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{part.name}</span>
                      <span className="text-[9px] text-slate-500 block font-mono">SKU: {part.sku}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-gold">₹{part.price.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CORE SPECIFICATIONS TABLE & WHAT'S IN THE BOX */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Specs Table */}
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-white uppercase border-b border-brand-border pb-3">
            Chassis Specifications
          </h3>
          <div className="divide-y divide-brand-border text-xs">
            {Object.entries(selectedProduct.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2.5">
                <span className="text-slate-400 font-medium">{key}</span>
                <span className="text-slate-200 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's In the Box */}
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-white uppercase border-b border-brand-border pb-3">
            What's in the Box?
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-300">
            {selectedProduct.whatsInTheBox.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="h-4.5 w-4.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* VERIFIED CUSTOMER REVIEWS & ADD REVIEW FEEDBACK FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-orange" />
            Verified Customer Debriefs ({productReviews.length})
          </h3>

          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-brand-border rounded-xl">
                No reviews yet. Be the first racing mechanic to share a debriefing!
              </div>
            ) : (
              productReviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl border border-brand-border bg-slate-900/20 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.userName} className="h-9 w-9 rounded-full object-cover border border-brand-border" />
                      <div>
                        <span className="text-xs font-bold text-white block">{r.userName}</span>
                        <span className="text-[9px] text-slate-500 block font-mono">{r.date}</span>
                      </div>
                    </div>
                    <span className="rounded bg-brand-gold/10 border border-brand-gold/30 px-2 py-0.5 text-[9px] font-bold text-brand-gold uppercase">
                      Verified Buyer
                    </span>
                  </div>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-brand-gold text-brand-gold' : 'text-slate-700'}`} />
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">{r.title}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{r.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Review Form */}
        <div className="lg:col-span-5 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-white uppercase border-b border-brand-border pb-3">
            Submit a Pit Report
          </h3>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            {reviewSuccess && (
              <div className="p-3 rounded bg-green-500/10 border border-green-500 text-green-400 font-bold uppercase text-[10px] text-center">
                Review submitted successfully! Recalculated vehicle ratings.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 rounded bg-slate-900 border border-brand-border text-brand-gold hover:scale-110 transition-transform"
                  >
                    <Star className={`h-5 w-5 ${star <= newRating ? 'fill-brand-gold' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mechanic Name</label>
              <input 
                type="text" 
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Debrief Title</label>
              <input 
                type="text" 
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Unbelievable acceleration, shredding tires!"
                className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Detailed Review Summary</label>
              <textarea 
                required
                rows={4}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Talk about shocks, handling, speed on Indian dust tracks, battery limits..."
                className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-orange resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-orange text-black font-bold uppercase py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
            >
              Post Review to Registry
            </button>
          </form>
        </div>

      </section>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-brand-border">
          <h3 className="font-display text-xl font-bold uppercase text-white mb-6">
            Related Gear & Upgrades
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => {
              const brand = BRANDS.find(b => b.id === p.brandId);
              const isWished = wishlist.includes(p.id);

              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer relative flex flex-col rounded-2xl border border-brand-border bg-slate-900/30 overflow-hidden hover:border-brand-orange hover:bg-slate-900/80 transition-all duration-300 shadow-lg hover:shadow-glow"
                >
                  {/* Primary Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                    <img 
                      src={p.images[0]} 
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Scale and Speed Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-orange border border-brand-orange/30 uppercase tracking-wider">
                        {p.categoryId === 'accessories' ? 'Accessory' : `${p.scale} Scale`}
                      </span>
                      {p.categoryId === 'accessories' ? (
                        p.specs.Pieces && (
                          <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                            {p.specs.Pieces}
                          </span>
                        )
                      ) : (
                        <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                          {p.speedKmh}+ KM/H
                        </span>
                      )}
                    </div>

                    {/* Wishlist button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-3 right-3 z-10 rounded-full bg-slate-950/80 p-2 border border-slate-800 text-slate-400 hover:text-brand-orange transition-colors"
                    >
                      <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
                    </button>

                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      {p.stockQty === 0 ? (
                        <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                          Out of stock
                        </span>
                      ) : p.stockQty < 3 ? (
                        <span className="rounded bg-brand-orange px-2 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider animate-pulse">
                          Only {p.stockQty} Left!
                        </span>
                      ) : (
                        <span className="rounded bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-green-400 uppercase tracking-wider">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specifications detail text */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider font-display">
                          {brand?.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          SKU: {p.sku.slice(0, 8)}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Star rating and key spec */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-brand-border pt-2">
                      <span className="flex items-center gap-0.5 text-brand-gold">
                        <Star className="h-3 w-3 fill-brand-gold" />
                        {p.averageRating} ({p.reviewCount})
                      </span>
                      {p.categoryId === 'accessories' ? (
                        <span>{p.specs["Age Range"] ? `Ages ${p.specs["Age Range"]}` : 'Accessory'} • {p.buildType}</span>
                      ) : (
                        <span>{p.terrainType} • {p.buildType}</span>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between border-t border-brand-border pt-3">
                      <div>
                        <span className="text-[10px] text-slate-500 line-through block leading-none">
                          ₹{p.comparePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-base font-black text-brand-gold font-display leading-none block mt-1">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button className="flex items-center justify-center rounded-lg bg-brand-orange px-3 py-1.5 text-[10px] font-bold text-black uppercase hover:bg-brand-gold transition-colors">
                        {p.categoryId === 'accessories' ? 'Buy Item' : 'Buy Rig'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIDEO POPUP OVERLAY DIALOG */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-brand-border bg-black shadow-2xl">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white hover:text-brand-orange z-10 bg-black/80 p-2 rounded-full border border-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedProduct.videoUrl?.startsWith('data:video') ? (
              <video 
                src={selectedProduct.videoUrl} 
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <iframe 
                src={getEmbedUrl(selectedProduct.videoUrl || '')} 
                title="Video player" 
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
