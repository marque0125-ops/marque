"use client";

import React, { useState } from "react";
import { Layers, Plus, Car, X, Trash2, Edit2 } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useUIStore } from "../../store/useUIStore";
import { BRANDS } from "../../data/mockData";
import toast from "react-hot-toast";

export function InventoryTab() {
  const { showDialog } = useUIStore();
  const { products, categories, addProduct, updateProduct, deleteProduct, updateProductStock } = useProductStore();

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formComparePrice, setFormComparePrice] = useState<number>(0);
  const [formBrandId, setFormBrandId] = useState("b1");
  const [formScale, setFormScale] = useState("1/10");
  const [formTerrainType, setFormTerrainType] = useState('Off-Road');
  const [formBuildType, setFormBuildType] = useState('RTR');
  const [formSpeedKmh, setFormSpeedKmh] = useState<number>(60);
  const [formWeightGrams, setFormWeightGrams] = useState<number>(3500);
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState<string[]>(["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80"]);
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formWhatsInTheBox, setFormWhatsInTheBox] = useState("RC Vehicle, 2.4GHz Transmitter, Quick-Start Guide");
  const [formMotorSpec, setFormMotorSpec] = useState("Brushless 3300Kv");
  const [formEscSpec, setFormEscSpec] = useState("Waterproof ESC 3S");
  const [formServoSpec, setFormServoSpec] = useState("High-Torque Metal Gear");
  const [formCategoryId, setFormCategoryId] = useState("crawler");

  const [formVariants, setFormVariants] = useState<any[]>([]);
  const [newVarColor, setNewVarColor] = useState("Orange");
  const [newVarBattery, setNewVarBattery] = useState("3S LiPo");
  const [newVarStock, setNewVarStock] = useState<number>(5);
  const [newVarImageUrl, setNewVarImageUrl] = useState("");

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset || cloudName.includes("your-cloud-name")) {
      toast.error("Cloudinary is not configured. Please check your .env file.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      console.error("Cloudinary error:", data);
      toast.error("Image upload failed.");
      return null;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Network error during upload.");
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploadingImage(true);
    for (const file of Array.from(files)) {
      if (file.size > 1024 * 1024 * 5) {
        toast.error(`File ${file.name} exceeds 5MB limit.`);
        continue;
      }
      const url = await uploadToCloudinary(file);
      if (url) {
        setFormImages(prev => [...prev, url]);
      }
    }
    setIsUploadingImage(false);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 10) {
        toast.error("Video file size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormVideoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        toast.error("Variant image exceeds 5MB limit.");
        return;
      }
      setIsUploadingImage(true);
      const url = await uploadToCloudinary(file);
      if (url) {
        setNewVarImageUrl(url);
      }
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetProductForm = () => {
    setFormName(""); setFormSku(""); setFormPrice(0); setFormComparePrice(0); setFormBrandId("b1");
    setFormScale("1/10"); setFormTerrainType("Off-Road"); setFormBuildType("RTR"); setFormSpeedKmh(60);
    setFormWeightGrams(3500); setFormDescription("");
    setFormImages(["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80"]);
    setFormVideoUrl("");
    setFormWhatsInTheBox("RC Vehicle, 2.4GHz Transmitter, Quick-Start Guide");
    setFormMotorSpec("Brushless 3300Kv"); setFormEscSpec("Waterproof ESC 3S"); setFormServoSpec("High-Torque Metal Gear");
    setFormCategoryId("crawler");
    setFormVariants([{ id: `var-1-${Date.now()}`, name: "Standard Orange", sku: "SKU-ORANGE", stockQty: 5, attributes: { color: "Orange", battery: "3S LiPo" } }]);
    setSelectedProductId(null); setIsAddingProduct(false); setIsEditingProduct(false);
  };

  const handleOpenEditProduct = (p: any) => {
    setSelectedProductId(p.id); setFormName(p.name); setFormSku(p.sku); setFormPrice(p.price);
    setFormComparePrice(p.comparePrice || p.price); setFormBrandId(p.brandId); setFormScale(p.scale);
    setFormTerrainType(p.terrainType); setFormBuildType(p.buildType); setFormSpeedKmh(p.speedKmh || 60);
    setFormWeightGrams(p.weightGrams || 3000); setFormDescription(p.description); 
    setFormImages(p.images && p.images.length > 0 ? p.images : [""]);
    setFormVideoUrl(p.videoUrl || "");
    setFormWhatsInTheBox(p.whatsInTheBox ? p.whatsInTheBox.join(", ") : "RC Vehicle, Transmitter");
    setFormMotorSpec(p.specs?.Motor || "Brushless"); setFormEscSpec(p.specs?.ESC || "Waterproof ESC");
    setFormServoSpec(p.specs?.Servo || "Metal Gear Servo"); setFormVariants(p.variants || []);
    setFormCategoryId(p.categoryId || "crawler");
    setIsEditingProduct(true); setIsAddingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku || formPrice <= 0) {
      toast.error('Please fill in Name, SKU, and a valid Price.');
      return;
    }
    const isEdit = !!selectedProductId;
    const finalProductId = isEdit ? selectedProductId! : `p-${Date.now()}`;
    const totalStock = formVariants.reduce((sum, v) => sum + v.stockQty, 0);

    const productData: any = {
      id: finalProductId, brandId: formBrandId, categoryId: formCategoryId, name: formName,
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: formDescription,
      price: formPrice, comparePrice: formComparePrice || Math.round(formPrice * 1.15),
      sku: formSku, weightGrams: formWeightGrams, scale: formScale, terrainType: formTerrainType,
      isFeatured: false, isActive: true, speedKmh: formSpeedKmh, buildType: formBuildType,
      images: formImages.length > 0 ? formImages : ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80"], 
      videoUrl: formVideoUrl,
      whatsInTheBox: formWhatsInTheBox.split(",").map(i => i.trim()),
      specs: { Motor: formMotorSpec, ESC: formEscSpec, Servo: formServoSpec, DriveSystem: "4WD Shaft Drive", Differential: "Sealed Steel Gear" },
      compatibleParts: [], variants: formVariants.length > 0 ? formVariants : [{ id: `var-std-${Date.now()}`, name: "Standard", sku: `${formSku}-STD`, stockQty: 10, attributes: { color: "Standard" } }],
      stockQty: totalStock, averageRating: isEdit ? (products.find(p => p.id === selectedProductId)?.averageRating || 4.8) : 5.0,
      reviewCount: isEdit ? (products.find(p => p.id === selectedProductId)?.reviewCount || 1) : 0
    };

    if (isEdit) { 
      updateProduct(productData); 
      toast.success(`${formName} updated!`); 
    } else { 
      addProduct(productData); 
      toast.success(`${formName} added!`); 
    }
    resetProductForm();
  };

  const handleAddVariant = () => {
    if (!newVarColor && !newVarBattery) return;
    const newV = {
      id: `var-${Date.now()}`, name: `${newVarColor} (${newVarBattery})`,
      sku: `${formSku}-${newVarColor.toUpperCase()}-${newVarBattery.replace(/\s+/g, "").toUpperCase()}`,
      stockQty: newVarStock, attributes: { color: newVarColor, battery: newVarBattery }, imageUrl: newVarImageUrl
    };
    setFormVariants([...formVariants, newV]);
  };

  const handleRemoveVariant = (id: string) => setFormVariants(formVariants.filter(v => v.id !== id));

  const handleDeleteProductClick = (id: string, name: string) => {
    showDialog({ type: 'confirm', title: 'Delete Product', message: `CRITICAL DELETION: Remove ${name}?`, onConfirm: () => { 
      deleteProduct(id); 
      toast.success(`Deleted ${name}.`); 
    } });
  };

  const handleStockUpdate = (productId: string, variantId: string) => {
    updateProductStock(productId, variantId, editingStockVal);
    setEditingVariantId(null);
  };

  const startEditing = (variantId: string, currentStock: number) => {
    setEditingVariantId(variantId); setEditingStockVal(currentStock);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-6 rounded-2xl border border-brand-border">
        <div className="space-y-1">
          <h2 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-brand-orange" /> Warehouse Inventory Registry & CRUD
          </h2>
        </div>
        {!isAddingProduct && !isEditingProduct && (
          <button onClick={() => { resetProductForm(); setIsAddingProduct(true); }} className="bg-brand-orange text-white sm:text-black px-4 py-2.5 rounded-lg text-xs font-normal uppercase flex items-center gap-1.5 hover:bg-brand-gold">
            <Plus className="h-4 w-4" /> Add New RC Model
          </button>
        )}
      </div>

      {(isAddingProduct || isEditingProduct) ? (
        <form onSubmit={handleSaveProduct} className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-brand-border backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-3 gap-2">
            <h3 className="font-display text-base font-normal uppercase text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-brand-orange" /> {isEditingProduct ? `Edit Model: ${formName}` : "Register New RC Model Chassis"}
            </h3>
            <button type="button" onClick={resetProductForm} className="text-slate-400 hover:text-red-500"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Model Name</label><input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Chassis SKU Code</label><input type="text" value={formSku} onChange={(e) => setFormSku(e.target.value)} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Brand Manufacturer</label><select value={formBrandId} onChange={(e) => setFormBrandId(e.target.value)} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange">{BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Category</label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Sale Price</label><input type="number" value={formPrice || ""} onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">MRP (Compare Price)</label><input type="number" value={formComparePrice || ""} onChange={(e) => setFormComparePrice(parseInt(e.target.value) || 0)} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Scale (e.g. 1:10)</label><input type="text" value={formScale} onChange={(e) => setFormScale(e.target.value)} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Top Speed (KM/H)</label><input type="number" value={formSpeedKmh || ""} onChange={(e) => setFormSpeedKmh(parseInt(e.target.value) || 0)} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5 md:col-span-4">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Product Description</label>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required rows={3} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange text-white" />
            </div>
            <div className="space-y-1.5 md:col-span-4">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Product Gallery Images</label>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                  {formImages.map((imgUrl, idx) => (
                    <div key={idx} className="h-16 w-16 rounded border border-brand-border overflow-hidden bg-slate-900 shrink-0 relative group">
                      <img src={imgUrl} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex text-red-500 hover:text-red-400"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={handleImageUpload}
                    className={`w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-normal file:uppercase file:bg-brand-orange file:text-white sm:text-black hover:file:bg-brand-gold file:transition-colors ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'file:cursor-pointer'} bg-slate-900/50 border border-brand-border rounded-lg`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-normal tracking-wider">
                    {isUploadingImage ? <span className="text-brand-orange">Uploading to Cloudinary...</span> : "Max size: 5MB per image. Select multiple files."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-3 border-t border-brand-border pt-4">
              <label className="text-[10px] text-slate-400 font-normal uppercase block flex items-center gap-2">
                Play Track Video
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    value={formVideoUrl} 
                    onChange={e => setFormVideoUrl(e.target.value)} 
                    placeholder="YouTube/Vimeo Embed URL" 
                    className="w-full rounded-lg bg-slate-950 border border-brand-border py-2.5 px-3 focus:border-brand-orange text-white" 
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-normal tracking-wider">Paste embed URL directly</p>
                </div>
                <div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-normal file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:transition-colors file:cursor-pointer bg-slate-900/50 border border-brand-border rounded-lg"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-normal tracking-wider">Or upload video file (Max 10MB).</p>
                </div>
              </div>
              {formVideoUrl && formVideoUrl.startsWith("data:video") && (
                <div className="mt-2 text-[10px] text-brand-orange font-normal uppercase">Video loaded into memory (Size: {(formVideoUrl.length / 1024 / 1024).toFixed(2)} MB)</div>
              )}
            </div>
          </div>
          <div className="border-t border-brand-border pt-4 text-xs space-y-4">
            <span className="text-[10px] text-brand-gold font-normal uppercase block">Variants</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <input type="text" value={newVarColor} onChange={e => setNewVarColor(e.target.value)} placeholder="Color" className="w-24 rounded bg-slate-900 border border-brand-border p-1.5 text-white" />
                <input type="text" value={newVarBattery} onChange={e => setNewVarBattery(e.target.value)} placeholder="Battery" className="w-28 rounded bg-slate-900 border border-brand-border p-1.5 text-white" />
                <input type="text" value={newVarImageUrl} onChange={e => setNewVarImageUrl(e.target.value)} placeholder="Img URL (Opt)" className="w-28 rounded bg-slate-900 border border-brand-border p-1.5 text-white" />
                <input type="number" value={newVarStock} onChange={e => setNewVarStock(parseInt(e.target.value) || 0)} className="w-14 rounded bg-slate-900 border border-brand-border p-1.5 text-white" />
                <button type="button" onClick={handleAddVariant} className="bg-brand-orange px-3 rounded font-normal uppercase text-[9px] text-white sm:text-black">Add</button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={handleVariantImageUpload}
                  className={`text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-normal file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'file:cursor-pointer'}`}
                />
                {isUploadingImage && <span className="text-[10px] text-brand-orange font-normal uppercase">Uploading...</span>}
                {newVarImageUrl && newVarImageUrl.startsWith("http") && !isUploadingImage && (
                  <span className="text-[10px] text-green-500 font-normal uppercase">Image Uploaded ✓</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {formVariants.map((v, i) => (
                <div key={i} className="p-2 border border-brand-border bg-slate-900 flex items-center justify-between rounded">
                  <div className="flex items-center gap-3">
                      {v.imageUrl && (
                        <img src={v.imageUrl} alt={v.name} className="w-8 h-8 object-cover rounded border border-brand-border" />
                      )}
                      <div>
                        <span className="font-normal text-white block text-xs">{v.name}</span>
                        <span className="text-[9px] text-brand-orange uppercase font-normal tracking-wider">Stock: {v.stockQty}</span>
                      </div>
                    </div>
                  <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-red-500 hover:text-red-400 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <button type="button" onClick={resetProductForm} className="border border-brand-border px-4 py-2 rounded-lg text-xs font-normal uppercase text-slate-400">Cancel</button>
            <button type="submit" className="bg-brand-orange px-5 py-2 rounded-lg text-xs font-normal uppercase text-white sm:text-black hover:bg-brand-gold">Publish Product</button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-slate-950 p-6 space-y-6">
          <div className="divide-y divide-brand-border text-xs">
            {products.map((p) => {
              const brand = BRANDS.find(b => b.id === p.brandId);
              return (
                <div key={p.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-brand-border/40 pb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded object-cover border border-brand-border" />
                      <div>
                        <span className="text-[9px] text-brand-orange font-normal uppercase block">{brand?.name}</span>
                        <span className="font-normal text-white text-sm block">{p.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEditProduct(p)} className="border border-brand-orange text-brand-orange px-3 py-1.5 rounded font-normal uppercase text-[9px]"><Edit2 className="h-3 w-3 inline" /> Edit</button>
                      <button onClick={() => handleDeleteProductClick(p.id, p.name)} className="border border-brand-border text-slate-400 hover:text-red-400 px-3 py-1.5 rounded font-normal uppercase text-[9px]"><Trash2 className="h-3 w-3 inline" /> Remove</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {p.variants.map((v) => {
                      const isEditing = editingVariantId === v.id;
                      return (
                        <div key={v.id} className="p-3 rounded-lg border border-brand-border/60 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-300 font-normal block">{v.attributes.color}</span>
                            <span className="text-[9px] font-normal block text-slate-400">Stock: {v.stockQty}</span>
                          </div>
                          {isEditing ? (
                            <div className="flex gap-1.5">
                              <input type="number" value={editingStockVal} onChange={(e) => setEditingStockVal(parseInt(e.target.value) || 0)} className="w-12 rounded bg-slate-950 border border-brand-orange p-1 text-center font-normal text-xs text-white" />
                              <button onClick={() => handleStockUpdate(p.id, v.id)} className="bg-brand-orange text-white sm:text-black px-2 py-1 rounded text-[9px] font-normal">Save</button>
                            </div>
                          ) : (
                            <button onClick={() => startEditing(v.id, v.stockQty)} className="text-[9px] text-brand-orange font-normal hover:underline"><Edit2 className="h-3 w-3 inline" /> Adjust</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
