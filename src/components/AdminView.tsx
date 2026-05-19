"use client";

import React, { useState } from "react";
import { useMarqueStore, Order } from "../store/store";
import { BRANDS } from "../data/mockData";
import { 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  Car, 
  AlertTriangle,
  ClipboardList,
  Edit2,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  DollarSign,
  Plus,
  Trash2,
  X,
  Layers,
  Settings
} from "lucide-react";

export default function AdminView() {
  const {
    orders,
    products,
    updateProductStock,
    advanceOrderStatus,
    cancelOrder,
    lowStockAlerts,
    clearLowStockAlerts,
    addProduct,
    updateProduct,
    deleteProduct,
    announcementText,
    setAnnouncementText
  } = useMarqueStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [announcementInput, setAnnouncementInput] = useState(announcementText);
  
  // Inline stock edit helper states
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  // Dynamic Product Add/Edit states
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formComparePrice, setFormComparePrice] = useState<number>(0);
  const [formBrandId, setFormBrandId] = useState("b1");
  const [formScale, setFormScale] = useState("1/10");
  const [formTerrainType, setFormTerrainType] = useState<'On-Road' | 'Off-Road' | 'Crawler' | 'Drift'>('Off-Road');
  const [formBuildType, setFormBuildType] = useState<'RTR' | 'Kit'>('RTR');
  const [formSpeedKmh, setFormSpeedKmh] = useState<number>(60);
  const [formWeightGrams, setFormWeightGrams] = useState<number>(3500);
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formWhatsInTheBox, setFormWhatsInTheBox] = useState("RC Vehicle, 2.4GHz Transmitter, Quick-Start Guide");
  
  // Custom Specs state
  const [formMotorSpec, setFormMotorSpec] = useState("Brushless 3300Kv");
  const [formEscSpec, setFormEscSpec] = useState("Waterproof ESC 3S");
  const [formServoSpec, setFormServoSpec] = useState("High-Torque Metal Gear");

  // Variants builder state
  const [formVariants, setFormVariants] = useState<{
    id: string;
    name: string;
    sku: string;
    stockQty: number;
    attributes: { color?: string; battery?: string };
  }[]>([]);

  // Sub-states to add a single variant to the form list
  const [newVarColor, setNewVarColor] = useState("Orange");
  const [newVarBattery, setNewVarBattery] = useState("3S LiPo");
  const [newVarStock, setNewVarStock] = useState<number>(5);

  const resetProductForm = () => {
    setFormName("");
    setFormSku("");
    setFormPrice(0);
    setFormComparePrice(0);
    setFormBrandId("b1");
    setFormScale("1/10");
    setFormTerrainType("Off-Road");
    setFormBuildType("RTR");
    setFormSpeedKmh(60);
    setFormWeightGrams(3500);
    setFormDescription("");
    setFormImageUrl("https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80");
    setFormWhatsInTheBox("RC Vehicle, 2.4GHz Transmitter, Quick-Start Guide");
    setFormMotorSpec("Brushless 3300Kv");
    setFormEscSpec("Waterproof ESC 3S");
    setFormServoSpec("High-Torque Metal Gear");
    setFormVariants([
      { id: `var-1-${Date.now()}`, name: "Standard Orange", sku: "SKU-ORANGE", stockQty: 5, attributes: { color: "Orange", battery: "3S LiPo" } },
      { id: `var-2-${Date.now()}`, name: "Standard Blue", sku: "SKU-BLUE", stockQty: 4, attributes: { color: "Blue", battery: "3S LiPo" } }
    ]);
    setSelectedProductId(null);
    setIsAddingProduct(false);
    setIsEditingProduct(false);
  };

  const handleOpenEditProduct = (p: any) => {
    setSelectedProductId(p.id);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormPrice(p.price);
    setFormComparePrice(p.comparePrice || p.price);
    setFormBrandId(p.brandId);
    setFormScale(p.scale);
    setFormTerrainType(p.terrainType);
    setFormBuildType(p.buildType);
    setFormSpeedKmh(p.speedKmh || 60);
    setFormWeightGrams(p.weightGrams || 3000);
    setFormDescription(p.description);
    setFormImageUrl(p.images[0] || "");
    setFormWhatsInTheBox(p.whatsInTheBox ? p.whatsInTheBox.join(", ") : "RC Vehicle, Transmitter");
    setFormMotorSpec(p.specs?.Motor || "Brushless");
    setFormEscSpec(p.specs?.ESC || "Waterproof ESC");
    setFormServoSpec(p.specs?.Servo || "Metal Gear Servo");
    setFormVariants(p.variants || []);
    setIsEditingProduct(true);
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku || formPrice <= 0) {
      alert("Please fill in Name, SKU, and a valid Price.");
      return;
    }

    const isEdit = !!selectedProductId;
    const finalProductId = isEdit ? selectedProductId! : `p-${Date.now()}`;
    const totalStock = formVariants.reduce((sum, v) => sum + v.stockQty, 0);

    const productData: any = {
      id: finalProductId,
      brandId: formBrandId,
      categoryId: "rc-cars",
      name: formName,
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formDescription,
      price: formPrice,
      comparePrice: formComparePrice || Math.round(formPrice * 1.15),
      sku: formSku,
      weightGrams: formWeightGrams,
      scale: formScale,
      terrainType: formTerrainType,
      isFeatured: false,
      isActive: true,
      speedKmh: formSpeedKmh,
      buildType: formBuildType,
      images: [formImageUrl],
      whatsInTheBox: formWhatsInTheBox.split(",").map(i => i.trim()),
      specs: {
        Motor: formMotorSpec,
        ESC: formEscSpec,
        Servo: formServoSpec,
        DriveSystem: "4WD Shaft Drive",
        Differential: "Sealed Steel Gear"
      },
      compatibleParts: [
        { name: "Sway Bar Kit", price: 1200, sku: "PART-SWAY" },
        { name: "Heavy Duty Suspension Arms", price: 1800, sku: "PART-HDARM" }
      ],
      variants: formVariants.length > 0 ? formVariants : [
        { id: `var-std-${Date.now()}`, name: "Standard", sku: `${formSku}-STD`, stockQty: 10, attributes: { color: "Standard" } }
      ],
      stockQty: totalStock,
      averageRating: isEdit ? (products.find(p => p.id === selectedProductId)?.averageRating || 4.8) : 5.0,
      reviewCount: isEdit ? (products.find(p => p.id === selectedProductId)?.reviewCount || 1) : 0
    };

    if (isEdit) {
      updateProduct(productData);
      alert(`Success: ${formName} has been successfully updated!`);
    } else {
      addProduct(productData);
      alert(`Success: ${formName} has been successfully added to the catalog!`);
    }

    resetProductForm();
  };

  const handleAddVariantToFormList = () => {
    if (!newVarColor && !newVarBattery) return;
    const name = `${newVarColor} (${newVarBattery})`;
    const sku = `${formSku}-${newVarColor.toUpperCase()}-${newVarBattery.replace(/\s+/g, "").toUpperCase()}`;
    const newV = {
      id: `var-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      name,
      sku,
      stockQty: newVarStock,
      attributes: {
        color: newVarColor,
        battery: newVarBattery
      }
    };
    setFormVariants([...formVariants, newV]);
  };

  const handleRemoveVariantFromFormList = (id: string) => {
    setFormVariants(formVariants.filter(v => v.id !== id));
  };

  const handleDeleteProductClick = (productId: string, productName: string) => {
    if (confirm(`CRITICAL DELETION: Are you sure you want to permanently remove ${productName} from the database?`)) {
      deleteProduct(productId);
      alert(`Deleted: ${productName} successfully removed.`);
    }
  };

  // Dynamic metrics
  const totalOrders = orders.length;
  const gmv = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
  const aov = totalOrders > 0 ? Math.round(gmv / totalOrders) : 0;
  const baseConversionRate = 3.6;
  const calculatedConversion = totalOrders > 0 ? parseFloat((baseConversionRate + (totalOrders * 0.2)).toFixed(1)) : baseConversionRate;

  const handleStockUpdate = (productId: string, variantId: string) => {
    updateProductStock(productId, variantId, editingStockVal);
    setEditingVariantId(null);
  };

  const startEditing = (variantId: string, currentStock: number) => {
    setEditingVariantId(variantId);
    setEditingStockVal(currentStock);
  };

  const handleUpdateAnnouncement = () => {
    if (!announcementInput.trim()) {
      alert("Announcement ticker text cannot be empty!");
      return;
    }
    setAnnouncementText(announcementInput);
    alert("Ticker content broadcasted successfully! Marquee updated on all pages.");
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Admin Title Area */}
      <div className="rounded-2xl border border-brand-border bg-slate-900/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Control Console</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
            MARQUE Operational HQ
          </h1>
          <p className="text-xs text-slate-400">
            Authorized admin portal. Manage product stocks, order fulfillment manifests, and live telemetry parameters.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2">
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'inventory', label: 'Inventory (CRUD)' },
            { id: 'orders', label: 'Order Dispatch' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeTab === tab.id ? 'bg-brand-orange text-black border-brand-orange' : 'border-brand-border bg-slate-900 hover:border-slate-700 text-slate-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: DYNAMIC ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Analytics Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat: GMV */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-3xl font-black text-white font-display">₹{gmv.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-green-400 font-bold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +14%</span>
              </div>
              <p className="text-[10px] text-slate-500">Excludes cancelled order volumes</p>
            </div>

            {/* Stat: AOV */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-3xl font-black text-brand-gold font-display">₹{aov.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-500">Based on {totalOrders} placed manifests</p>
            </div>

            {/* Stat: Conversion */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Store Conversion Rate</span>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-3xl font-black text-white font-display">{calculatedConversion}%</span>
                <span className="text-[9px] text-green-400 font-bold leading-none">+0.4% this week</span>
              </div>
              <p className="text-[10px] text-slate-500">Typesense Instant Search speed &lt; 80ms</p>
            </div>

            {/* Stat: Orders */}
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Manifest Orders Placed</span>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-3xl font-black text-brand-orange font-display">{totalOrders}</span>
              </div>
              <p className="text-[10px] text-slate-500">Fulfillment managed via Admin Command Console</p>
            </div>

          </div>

          {/* Live Alert Feeds panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Low Stock notification log */}
            <div className="md:col-span-8 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-brand-orange" />
                  Telemetry Low Stock alerts board ({lowStockAlerts.length})
                </h3>
                {lowStockAlerts.length > 0 && (
                  <button 
                    onClick={clearLowStockAlerts}
                    className="text-[10px] text-slate-500 hover:text-brand-orange font-bold uppercase underline"
                  >
                    Reset log
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {lowStockAlerts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    All inventory levels healthy. No alerts triggered. Go to 'Inventory' to decrease stock below 3 to simulate notification alerts!
                  </div>
                ) : (
                  lowStockAlerts.map((alert, idx) => (
                    <div key={idx} className="p-3 rounded bg-slate-900 border-l border-brand-orange text-xs text-slate-300 flex justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider block">Critical Limit reached</span>
                        <p>{alert.message}</p>
                      </div>
                      <span className="font-mono text-[9px] text-slate-500 shrink-0 font-semibold">{alert.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Banners & Marquee management */}
            <div className="md:col-span-4 rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
              
              {/* Campaign Banners */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-brand-border pb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-brand-gold" />
                  Storefront Campaigns
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-brand-border/60">
                    <span className="text-[8px] bg-brand-orange text-black px-1 font-bold uppercase rounded block w-max">Active Banner</span>
                    <span className="font-bold text-white block mt-1.5">Traxxas X-Maxx 8S Extreme basher</span>
                    <span className="text-[10px] text-slate-500 block">CTR: 4.8% • conversion: 32 orders</span>
                  </div>

                  <div className="p-3 bg-slate-900/30 rounded border border-brand-border/20 text-slate-500">
                    <span className="text-[8px] bg-slate-800 text-slate-400 px-1 font-bold uppercase rounded block w-max">Draft campaign</span>
                    <span className="font-bold block mt-1.5">Arrma Infraction 6S Asphalt Slider</span>
                    <span className="text-[10px] block">Scheduled: Monsoon racing tournament 2026</span>
                  </div>
                </div>
              </div>

              {/* Live Announcement Marquee Editor */}
              <div className="space-y-4 pt-4 border-t border-brand-border/55">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Settings className="h-4.5 w-4.5 text-brand-orange" />
                  Header Announcement Marquee
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Ticker Text Content</label>
                    <textarea 
                      value={announcementInput}
                      onChange={(e) => setAnnouncementInput(e.target.value)}
                      placeholder="Enter announcement text..."
                      rows={3}
                      className="w-full rounded-lg border border-brand-border bg-slate-900 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange resize-none text-[11px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateAnnouncement}
                      className="w-full bg-brand-orange hover:bg-brand-gold text-black py-2 rounded font-bold uppercase text-[10px] transition-all hover:shadow-glow"
                    >
                      Update Ticker
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultVal = "⚡ EXTREME 8S BRUSHLESS ACTION • GST-INCLUSIVE PRICES • FREE SHIPPING ABOVE ₹10,000 ⚡";
                        setAnnouncementInput(defaultVal);
                        setAnnouncementText(defaultVal);
                      }}
                      className="border border-brand-border hover:border-slate-500 text-slate-300 px-3 py-2 rounded text-[10px]"
                      title="Reset to Default"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Preview Bar */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[8px] text-slate-500 font-bold uppercase block">Live Telemetry Preview:</span>
                    <div className="w-full bg-gradient-to-r from-brand-orange to-brand-gold py-1 text-[9px] font-bold uppercase tracking-wider text-black rounded overflow-hidden select-none relative">
                      <div className="flex whitespace-nowrap animate-marquee gap-4">
                        <div className="flex shrink-0 items-center justify-around gap-4 min-w-full">
                          <span>{announcementText}</span>
                        </div>
                        <div className="flex shrink-0 items-center justify-around gap-4 min-w-full" aria-hidden="true">
                          <span>{announcementText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY CRUD & STOCK ADJUSTER */}
      {activeTab === 'inventory' && (
        <div className="space-y-8">
          
          {/* Header controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-6 rounded-2xl border border-brand-border">
            <div className="space-y-1">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-brand-orange" />
                Warehouse Inventory Registry & CRUD
              </h3>
              <p className="text-xs text-slate-400">
                Register new scale models, edit vehicle metadata/images, or adjust variant stock quantities instantly.
              </p>
            </div>
            
            {!isAddingProduct && !isEditingProduct && (
              <button
                onClick={() => {
                  resetProductForm();
                  setIsAddingProduct(true);
                }}
                className="bg-brand-orange hover:bg-brand-gold text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4" /> Add New RC Model
              </button>
            )}
          </div>

          {/* DYNAMIC FORM: ADD / EDIT PRODUCT */}
          {(isAddingProduct || isEditingProduct) ? (
            <form onSubmit={handleSaveProduct} className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-brand-border backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h4 className="font-display text-base font-bold uppercase text-white flex items-center gap-2">
                  <Car className="h-5 w-5 text-brand-orange" />
                  {isEditingProduct ? `Edit Model: ${formName}` : "Register New RC Model Chassis"}
                </h4>
                <button type="button" onClick={resetProductForm} className="text-slate-500 hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Model Name</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Traxxas X-Maxx 8S Brushless"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                {/* Chassis SKU */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chassis SKU Code</label>
                  <input 
                    type="text" 
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. TRX-86086-4"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                    required
                  />
                </div>

                {/* Brand Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Brand Manufacturer</label>
                  <select 
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  >
                    {BRANDS.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price (₹ INR Inclusive GST)</label>
                  <input 
                    type="number" 
                    value={formPrice || ""}
                    onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 84900"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                    required
                  />
                </div>

                {/* Compare Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compare Price (₹ M.R.P.)</label>
                  <input 
                    type="number" 
                    value={formComparePrice || ""}
                    onChange={(e) => setFormComparePrice(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 99000"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                  />
                </div>

                {/* Scale Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chassis Scale Size</label>
                  <select 
                    value={formScale}
                    onChange={(e) => setFormScale(e.target.value)}
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  >
                    {['1/5', '1/7', '1/8', '1/10', '1/16', '1/18', '1/24'].map(scale => (
                      <option key={scale} value={scale}>{scale} Scale</option>
                    ))}
                  </select>
                </div>

                {/* Terrain Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Terrain Class</label>
                  <select 
                    value={formTerrainType}
                    onChange={(e) => setFormTerrainType(e.target.value as any)}
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  >
                    {['On-Road', 'Off-Road', 'Crawler', 'Drift'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Build Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Build State</label>
                  <select 
                    value={formBuildType}
                    onChange={(e) => setFormBuildType(e.target.value as any)}
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  >
                    <option value="RTR">RTR (Ready-To-Run)</option>
                    <option value="Kit">Kit (Assembly Needed)</option>
                  </select>
                </div>

                {/* Max Speed */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Max Velocity (km/h)</label>
                  <input 
                    type="number" 
                    value={formSpeedKmh || ""}
                    onChange={(e) => setFormSpeedKmh(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 80"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                  />
                </div>

                {/* Weight in Grams */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chassis Weight (Grams)</label>
                  <input 
                    type="number" 
                    value={formWeightGrams || ""}
                    onChange={(e) => setFormWeightGrams(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 4500"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange font-mono"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Primary Chassis Image URL</label>
                  <input 
                    type="text" 
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /images/..."
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Model Description Overview</label>
                  <textarea 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain the vehicle details, motor system, shock towers, and power handling..."
                    rows={3}
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange resize-none"
                    required
                  />
                </div>

                {/* Box Inclusions */}
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">What's In The Box (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formWhatsInTheBox}
                    onChange={(e) => setFormWhatsInTheBox(e.target.value)}
                    placeholder="e.g. RC Vehicle, Transmitter, Manual, Suspension Spacers"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Specs Sub-sections */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Motor Spec</label>
                  <input 
                    type="text" 
                    value={formMotorSpec}
                    onChange={(e) => setFormMotorSpec(e.target.value)}
                    placeholder="Brushless 2200Kv"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">ESC System Spec</label>
                  <input 
                    type="text" 
                    value={formEscSpec}
                    onChange={(e) => setFormEscSpec(e.target.value)}
                    placeholder="Velineon VXL-8S Waterproof"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">Steering Servo Spec</label>
                  <input 
                    type="text" 
                    value={formServoSpec}
                    onChange={(e) => setFormServoSpec(e.target.value)}
                    placeholder="High-Torque Metal Gear Waterproof"
                    className="w-full rounded-lg border border-brand-border bg-slate-950 py-2 px-3 text-slate-200 outline-none focus:border-brand-orange"
                  />
                </div>

              </div>

              {/* VARIANTS CONFIGURATOR SECTION */}
              <div className="border-t border-brand-border pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">Livery and Power Configurations Builder</span>
                  <p className="text-[10px] text-slate-400">Add color variants and battery packages for this chassis model to track stock levels.</p>
                </div>

                {/* Variant Inputs Form Row */}
                <div className="bg-slate-950/80 p-3 rounded-lg border border-brand-border flex flex-wrap items-center gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-slate-400 font-bold uppercase block">Color Option</label>
                    <input 
                      type="text" 
                      value={newVarColor} 
                      onChange={(e) => setNewVarColor(e.target.value)}
                      placeholder="e.g. Red, Carbon"
                      className="w-24 rounded bg-slate-900 border border-brand-border p-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-slate-400 font-bold uppercase block">Power Bundle Option</label>
                    <input 
                      type="text" 
                      value={newVarBattery} 
                      onChange={(e) => setNewVarBattery(e.target.value)}
                      placeholder="e.g. 4S LiPo, No Battery"
                      className="w-32 rounded bg-slate-900 border border-brand-border p-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-slate-400 font-bold uppercase block">Stock Units</label>
                    <input 
                      type="number" 
                      value={newVarStock} 
                      onChange={(e) => setNewVarStock(parseInt(e.target.value) || 0)}
                      className="w-14 rounded bg-slate-900 border border-brand-border p-1.5 text-xs text-white text-center font-mono"
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleAddVariantToFormList}
                    className="bg-brand-orange hover:bg-brand-gold text-black text-[9px] font-bold uppercase px-3 py-2 rounded mt-4"
                  >
                    + Add Configuration
                  </button>
                </div>

                {/* Added Variants List */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Configured Variants List ({formVariants.length}):</span>
                  {formVariants.length === 0 ? (
                    <div className="text-[10px] text-slate-500 py-2 border-dashed border border-slate-800 text-center rounded">
                      No variants configured yet. Add at least one configuration above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {formVariants.map((v, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 rounded border border-brand-border/60 flex items-center justify-between gap-2 font-display">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block">{v.name}</span>
                            <span className="text-[8px] text-slate-500 font-mono block">SKU: {v.sku}</span>
                            <span className="text-[8px] text-brand-orange font-bold block">Stock: {v.stockQty} units</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveVariantFromFormList(v.id)}
                            className="text-red-400 hover:text-red-500 p-1 font-bold"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button 
                  type="button" 
                  onClick={resetProductForm}
                  className="border border-brand-border text-slate-400 hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-orange text-black hover:bg-brand-gold px-5 py-2.5 rounded-lg text-xs font-bold uppercase hover:shadow-glow transition-all"
                >
                  {isEditingProduct ? "Apply Content Changes" : "Publish RC Model to Catalog"}
                </button>
              </div>

            </form>
          ) : (
            
            /* PRODUCTS REGISTRY GRID VIEW */
            <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
              <div className="divide-y divide-brand-border text-xs">
                {products.map((p) => {
                  const brand = BRANDS.find(b => b.id === p.brandId);
                  
                  return (
                    <div key={p.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                      
                      {/* Product Header Info Grid */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded object-cover border border-brand-border" />
                          <div>
                            <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider block font-display">
                              {brand?.name || "Premium RC"}
                            </span>
                            <span className="font-bold text-white text-sm block">{p.name}</span>
                            <div className="flex gap-2 text-[9px] text-slate-500 font-mono mt-0.5">
                              <span>Chassis SKU: {p.sku}</span>
                              <span>•</span>
                              <span>Scale: {p.scale}</span>
                              <span>•</span>
                              <span>Price: ₹{p.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Top-Level actions (Edit Content & Delete Product) */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="border border-brand-orange bg-brand-orange/5 text-brand-orange hover:bg-brand-orange hover:text-black px-3 py-1.5 rounded font-bold uppercase text-[9px] flex items-center gap-1 transition-all"
                          >
                            <Edit2 className="h-3 w-3" /> Edit Product Content
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProductClick(p.id, p.name)}
                            className="border border-brand-border hover:border-red-500 text-slate-500 hover:text-red-400 px-3 py-1.5 rounded font-bold uppercase text-[9px] flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="h-3 w-3" /> Remove Chassis
                          </button>
                        </div>
                      </div>

                      {/* Variants and stock adjusters inside this product */}
                      <div className="space-y-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Variant Stock Adjustments:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {p.variants.map((v) => {
                            const isEditing = editingVariantId === v.id;

                            return (
                              <div key={v.id} className="p-3 rounded-lg border border-brand-border/60 bg-slate-900/60 flex items-center justify-between gap-3 font-display">
                                <div className="space-y-0.5 max-w-[60%]">
                                  <span className="text-[10px] text-slate-300 font-bold block truncate leading-tight">
                                    {v.attributes.color || "Standard"}
                                  </span>
                                  <span className="text-[8px] text-slate-500 font-mono block truncate">
                                    {v.attributes.battery || "No Battery"}
                                  </span>
                                  <span className={`text-[9px] font-bold block ${v.stockQty === 0 ? 'text-red-500' : v.stockQty < 3 ? 'text-brand-orange animate-pulse' : 'text-slate-400'}`}>
                                    Stock: {v.stockQty} left
                                  </span>
                                </div>

                                {/* Inline editor inputs */}
                                {isEditing ? (
                                  <div className="flex items-center gap-1.5">
                                    <input 
                                      type="number" 
                                      value={editingStockVal}
                                      onChange={(e) => setEditingStockVal(parseInt(e.target.value) || 0)}
                                      className="w-12 rounded bg-slate-950 border border-brand-orange p-1 text-center font-bold text-xs text-white"
                                    />
                                    <button
                                      onClick={() => handleStockUpdate(p.id, v.id)}
                                      className="bg-brand-orange text-black px-2 py-1 rounded text-[9px] font-bold uppercase hover:bg-brand-gold"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditing(v.id, v.stockQty)}
                                    className="text-[9px] text-brand-orange font-bold uppercase hover:underline flex items-center gap-0.5"
                                  >
                                    <Edit2 className="h-3 w-3" /> Adjust
                                  </button>
                                )}

                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: ORDER DISPATCH / FULFILLMENT BOARD */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
              Courier Dispatch manifest console
            </h3>
            <p className="text-xs text-slate-400">
              Manage order delivery stages, ship consignments, generate AWB tracking barcodes, or fulfill refunds.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-slate-950 py-16 text-center text-xs text-slate-500">
              No orders logged. Place test orders from checkout to manage them here.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-brand-border bg-slate-950 p-5 space-y-4">
                  
                  {/* Row 1: Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white uppercase">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${order.paymentStatus === 'paid' ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'}`}>
                        Payment: {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                      Status Node: <strong className="text-brand-orange uppercase">{order.status}</strong>
                    </span>
                  </div>

                  {/* Row 2: Customer Delivery details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-brand-border pb-3 text-slate-400">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Receiver</span>
                      <span className="text-slate-200 font-bold block">{order.shippingAddress.name}</span>
                      <span className="block mt-0.5">{order.shippingAddress.phone}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Address</span>
                      <span className="text-slate-200 block truncate">{order.shippingAddress.addressLine}</span>
                      <span className="block mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Consignment Value</span>
                      <span className="font-mono text-slate-200 font-bold block">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      {order.shippingAddress.gstin && (
                        <span className="text-[9px] text-brand-gold font-bold block mt-1 uppercase">B2B GSTIN INCLUDED</span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Actions */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-mono">AWB Code: {order.trackingNumber}</span>
                    
                    <div className="flex gap-2">
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => advanceOrderStatus(order.id)}
                          className="bg-brand-orange text-black px-3.5 py-1.5 rounded font-bold uppercase text-[9px] hover:bg-brand-gold"
                        >
                          Fulfill / Advance Status
                        </button>
                      )}

                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="border border-brand-border hover:border-red-500 text-slate-400 hover:text-red-500 px-3.5 py-1.5 rounded font-bold uppercase text-[9px]"
                        >
                          Cancel & Refund
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
