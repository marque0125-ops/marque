"use client";

import React, { useState } from "react";
import { useUIStore, Testimonial, BrandLogo } from "../../store/useUIStore";
import { Edit2, Save, Trash2, Plus, Quote, X, Image as ImageIcon } from "lucide-react";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

export function SiteContentTab() {
  const { showDialog } = useUIStore();
  const {
    brandsBadge, brandsTitle, brandsSubtitle, updateBrandsText,
    brandsList, addBrand, updateBrand, removeBrand,
    aboutBadge, aboutTitleLine1, aboutTitleLine2, aboutSubtitle, aboutDescription, aboutBullets, aboutImage, aboutImageOverlayTitle, aboutImageOverlaySubtitle, updateAboutText,
    testimonialsBadge, testimonialsTitle, updateTestimonialsText,
    testimonialsList, addTestimonial, updateTestimonial, removeTestimonial
  } = useUIStore();

  // Brands State
  const [isEditingBrands, setIsEditingBrands] = useState(false);
  const [brandsForm, setBrandsForm] = useState({ badge: "", title: "", subtitle: "" });

  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isEditingBrandId, setIsEditingBrandId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState({ name: "", logo: "", country: "", flag: "" });
  const [isUploadingBrandLogo, setIsUploadingBrandLogo] = useState(false);

  // About State
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutForm, setAboutForm] = useState({
    badge: "", t1: "", t2: "", sub: "", desc: "", b1: "", b2: "", b3: "", image: "", overT: "", overS: ""
  });
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false);

  // Testimonials Text State
  const [isEditingTestimonialsText, setIsEditingTestimonialsText] = useState(false);
  const [testimonialsTextForm, setTestimonialsTextForm] = useState({ badge: "", title: "" });

  // Testimonials Items State
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [isEditingTestId, setIsEditingTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState({ name: "", role: "", quote: "", avatar: "" });
  const [isUploading, setIsUploading] = useState(false);

  const handleEditBrands = () => {
    setBrandsForm({ badge: brandsBadge, title: brandsTitle, subtitle: brandsSubtitle });
    setIsEditingBrands(true);
  };
  const handleSaveBrands = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandsText(brandsForm.badge, brandsForm.title, brandsForm.subtitle);
    setIsEditingBrands(false);
    showDialog({ title: 'Success', message: 'Brands section text updated!' });
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBrandLogo(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setBrandForm({ ...brandForm, logo: url });
    } catch {
      showDialog({ title: 'Upload Failed', message: 'Failed to upload brand logo.' });
    } finally {
      setIsUploadingBrandLogo(false);
    }
  };

  const resetBrandForm = () => {
    setBrandForm({ name: "", logo: "", country: "", flag: "" });
    setIsAddingBrand(false);
    setIsEditingBrandId(null);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const newBrand: BrandLogo = {
      id: isEditingBrandId || `brand-${Date.now()}`,
      ...brandForm
    };
    if (isEditingBrandId) updateBrand(newBrand);
    else addBrand(newBrand);
    resetBrandForm();
    showDialog({ title: 'Success', message: `Brand ${isEditingBrandId ? 'updated' : 'added'}!` });
  };

  // --- Handlers for About ---
  const handleEditAbout = () => {
    setAboutForm({
      badge: aboutBadge, t1: aboutTitleLine1, t2: aboutTitleLine2, sub: aboutSubtitle, desc: aboutDescription,
      b1: aboutBullets[0] || "", b2: aboutBullets[1] || "", b3: aboutBullets[2] || "",
      image: aboutImage, overT: aboutImageOverlayTitle, overS: aboutImageOverlaySubtitle
    });
    setIsEditingAbout(true);
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAboutImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setAboutForm({ ...aboutForm, image: url });
    } catch {
      showDialog({ title: 'Upload Failed', message: 'Failed to upload about image.' });
    } finally {
      setIsUploadingAboutImage(false);
    }
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutText(aboutForm.badge, aboutForm.t1, aboutForm.t2, aboutForm.sub, aboutForm.desc, [aboutForm.b1, aboutForm.b2, aboutForm.b3], aboutForm.image, aboutForm.overT, aboutForm.overS);
    setIsEditingAbout(false);
    showDialog({ title: 'Success', message: 'About section updated!' });
  };

  // --- Handlers for Testimonial Texts ---
  const handleEditTestTexts = () => {
    setTestimonialsTextForm({ badge: testimonialsBadge, title: testimonialsTitle });
    setIsEditingTestimonialsText(true);
  };
  const handleSaveTestTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateTestimonialsText(testimonialsTextForm.badge, testimonialsTextForm.title);
    setIsEditingTestimonialsText(false);
    showDialog({ title: 'Success', message: 'Testimonials headers updated!' });
  };

  // --- Handlers for Testimonial Cards ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setTestForm({ ...testForm, avatar: url });
    } catch {
      showDialog({ title: 'Upload Failed', message: 'Failed to upload avatar.' });
    } finally {
      setIsUploading(false);
    }
  };

  const resetTestForm = () => {
    setTestForm({ name: "", role: "", quote: "", avatar: "" });
    setIsAddingTest(false);
    setIsEditingTestId(null);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Testimonial = {
      id: isEditingTestId || `test-${Date.now()}`,
      ...testForm
    };
    if (isEditingTestId) updateTestimonial(newTest);
    else addTestimonial(newTest);
    resetTestForm();
    showDialog({ title: 'Success', message: `Testimonial ${isEditingTestId ? 'updated' : 'added'}!` });
  };

  return (
    <div className="space-y-8">
      {/* 1. Brands Text Section */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-brand-border space-y-4">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <h2 className="font-display text-base font-normal uppercase tracking-wider text-slate-200">
            1. Brands Section (Championship Lineup)
          </h2>
          {!isEditingBrands && (
            <button onClick={handleEditBrands} className="text-slate-400 hover:text-brand-orange text-xs uppercase flex items-center gap-1">
              <Edit2 className="h-3 w-3" /> Edit Texts
            </button>
          )}
        </div>
        {isEditingBrands ? (
          <form onSubmit={handleSaveBrands} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-brand-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Badge Text</label><input type="text" value={brandsForm.badge} onChange={(e) => setBrandsForm({...brandsForm, badge: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Main Title</label><input type="text" value={brandsForm.title} onChange={(e) => setBrandsForm({...brandsForm, title: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-normal uppercase block">Subtitle / Description</label><input type="text" value={brandsForm.subtitle} onChange={(e) => setBrandsForm({...brandsForm, subtitle: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsEditingBrands(false)} className="px-4 py-2 text-xs uppercase text-slate-400">Cancel</button>
              <button type="submit" className="bg-brand-orange px-4 py-2 rounded-lg text-xs uppercase text-black hover:bg-brand-gold">Save Brands Text</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-slate-900/30 p-4 rounded-xl">
            <div><span className="text-[10px] uppercase text-slate-400 block mb-1">Badge:</span><span className="text-brand-gold font-display">{brandsBadge}</span></div>
            <div><span className="text-[10px] uppercase text-slate-400 block mb-1">Title:</span><span className="text-white font-display">{brandsTitle}</span></div>
            <div className="md:col-span-3"><span className="text-[10px] uppercase text-slate-400 block mb-1">Subtitle:</span><span className="text-slate-300 text-xs">{brandsSubtitle}</span></div>
          </div>
        )}

        {/* Brand Logos List */}
        <div className="space-y-4 pt-4 border-t border-brand-border/40">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-normal uppercase text-slate-400">Brand Logos</h3>
             {!isAddingBrand && !isEditingBrandId && (
               <button onClick={() => setIsAddingBrand(true)} className="bg-brand-orange text-black px-3 py-1.5 rounded text-[10px] uppercase flex items-center gap-1 hover:bg-brand-gold">
                 <Plus className="h-3 w-3" /> Add Brand
               </button>
             )}
          </div>

          {(isAddingBrand || isEditingBrandId) ? (
            <form onSubmit={handleSaveBrand} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-brand-border relative">
              <button type="button" onClick={resetBrandForm} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Brand Name</label><input type="text" value={brandForm.name} onChange={(e) => setBrandForm({...brandForm, name: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Country</label><input type="text" value={brandForm.country} onChange={(e) => setBrandForm({...brandForm, country: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Flag Emoji</label><input type="text" value={brandForm.flag} onChange={(e) => setBrandForm({...brandForm, flag: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Brand Logo Image</label>
                  <div className="flex items-center gap-4">
                    {brandForm.logo && <div className="bg-white p-1 rounded"><img src={brandForm.logo} alt="logo" className="w-10 h-10 object-contain" /></div>}
                    <input type="text" value={brandForm.logo} onChange={(e) => setBrandForm({...brandForm, logo: e.target.value})} placeholder="Image URL" className="flex-1 rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
                    <input type="file" accept="image/*" onChange={handleBrandLogoUpload} disabled={isUploadingBrandLogo} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="submit" className="bg-brand-orange px-4 py-2 rounded-lg text-xs uppercase text-black hover:bg-brand-gold">Save Brand</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {brandsList.map((brand) => (
                <div key={brand.id} className="bg-slate-900/30 p-3 rounded-xl border border-brand-border/50 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded w-10 h-10 flex items-center justify-center shrink-0">
                      <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase">{brand.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase block">{brand.flag} {brand.country}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => { setBrandForm(brand); setIsEditingBrandId(brand.id); }} className="p-1.5 text-slate-400 hover:text-brand-orange bg-slate-950 rounded border border-brand-border"><Edit2 className="w-3 h-3" /></button>
                     <button onClick={() => {
                       showDialog({ type: 'confirm', title: 'Delete', message: 'Delete this brand?', onConfirm: () => removeBrand(brand.id) })
                     }} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-950 rounded border border-brand-border"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. About Section */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-brand-border space-y-4">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <h2 className="font-display text-base font-normal uppercase tracking-wider text-slate-200">
            2. About Section (Sleek Rigs)
          </h2>
          {!isEditingAbout && (
            <button onClick={handleEditAbout} className="text-slate-400 hover:text-brand-orange text-xs uppercase flex items-center gap-1">
              <Edit2 className="h-3 w-3" /> Edit Section
            </button>
          )}
        </div>
        {isEditingAbout ? (
          <form onSubmit={handleSaveAbout} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-brand-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-normal uppercase block">Badge Text</label><input type="text" value={aboutForm.badge} onChange={(e) => setAboutForm({...aboutForm, badge: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Title Line 1</label><input type="text" value={aboutForm.t1} onChange={(e) => setAboutForm({...aboutForm, t1: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Title Line 2</label><input type="text" value={aboutForm.t2} onChange={(e) => setAboutForm({...aboutForm, t2: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-normal uppercase block">Subtitle</label><input type="text" value={aboutForm.sub} onChange={(e) => setAboutForm({...aboutForm, sub: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-normal uppercase block">Main Paragraph</label><textarea value={aboutForm.desc} onChange={(e) => setAboutForm({...aboutForm, desc: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" rows={3} /></div>
              
              <div className="md:col-span-2 space-y-2 pt-2 border-t border-brand-border/40">
                <label className="text-[10px] text-brand-orange font-normal uppercase block">Bullet Points (3 allowed)</label>
                <input type="text" value={aboutForm.b1} onChange={(e) => setAboutForm({...aboutForm, b1: e.target.value})} placeholder="Bullet 1" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
                <input type="text" value={aboutForm.b2} onChange={(e) => setAboutForm({...aboutForm, b2: e.target.value})} placeholder="Bullet 2" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
                <input type="text" value={aboutForm.b3} onChange={(e) => setAboutForm({...aboutForm, b3: e.target.value})} placeholder="Bullet 3" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
              </div>

              <div className="md:col-span-2 space-y-2 pt-2 border-t border-brand-border/40">
                <label className="text-[10px] text-brand-orange font-normal uppercase block">Featured Image & Overlay Text</label>
                
                <div className="flex items-center gap-4">
                  {aboutForm.image && <img src={aboutForm.image} alt="about" className="w-16 h-16 rounded border border-brand-border object-cover" />}
                  <div className="flex-1 space-y-1.5">
                    <input type="text" value={aboutForm.image} onChange={(e) => setAboutForm({...aboutForm, image: e.target.value})} placeholder="Image URL" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
                    <input type="file" accept="image/*" onChange={handleAboutImageUpload} disabled={isUploadingAboutImage} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Overlay Title</label><input type="text" value={aboutForm.overT} onChange={(e) => setAboutForm({...aboutForm, overT: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Overlay Subtitle</label><input type="text" value={aboutForm.overS} onChange={(e) => setAboutForm({...aboutForm, overS: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsEditingAbout(false)} className="px-4 py-2 text-xs uppercase text-slate-400">Cancel</button>
              <button type="submit" className="bg-brand-orange px-4 py-2 rounded-lg text-xs uppercase text-black hover:bg-brand-gold">Save About Text</button>
            </div>
          </form>
        ) : (
          <div className="text-sm bg-slate-900/30 p-4 rounded-xl space-y-3">
            <div><span className="text-[10px] uppercase text-brand-orange block mb-0.5">{aboutBadge}</span></div>
            <div><span className="text-white font-display text-lg leading-none block">{aboutTitleLine1}<br/>{aboutTitleLine2}</span></div>
            <div><span className="text-slate-400">{aboutSubtitle}</span></div>
            <div><span className="text-slate-300 text-xs">{aboutDescription}</span></div>
            <ul className="text-xs text-slate-400 list-disc list-inside pt-1">
              {aboutBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="pt-2 border-t border-brand-border/40 flex items-center gap-4">
              <img src={aboutImage} alt="about" className="w-16 h-16 rounded object-cover" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Overlay Texts:</span>
                <span className="text-white text-xs block font-bold">{aboutImageOverlayTitle}</span>
                <span className="text-slate-400 text-xs block">{aboutImageOverlaySubtitle}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Testimonials Section */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-brand-border space-y-6">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <h2 className="font-display text-base font-normal uppercase tracking-wider text-slate-200">
            3. Customer Reviews Section
          </h2>
        </div>

        {/* Testimonial Headers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-normal uppercase text-slate-400">Header Texts</h3>
            {!isEditingTestimonialsText && (
              <button onClick={handleEditTestTexts} className="text-slate-400 hover:text-brand-orange text-[10px] uppercase flex items-center gap-1">
                <Edit2 className="h-3 w-3" /> Edit Headers
              </button>
            )}
          </div>
          {isEditingTestimonialsText ? (
             <form onSubmit={handleSaveTestTexts} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-brand-border">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Badge Text</label><input type="text" value={testimonialsTextForm.badge} onChange={(e) => setTestimonialsTextForm({...testimonialsTextForm, badge: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
               <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Main Title</label><input type="text" value={testimonialsTextForm.title} onChange={(e) => setTestimonialsTextForm({...testimonialsTextForm, title: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
             </div>
             <div className="flex justify-end gap-2 pt-2">
               <button type="button" onClick={() => setIsEditingTestimonialsText(false)} className="px-4 py-2 text-xs uppercase text-slate-400">Cancel</button>
               <button type="submit" className="bg-brand-orange px-4 py-2 rounded-lg text-[10px] uppercase text-black hover:bg-brand-gold">Save Headers</button>
             </div>
           </form>
          ) : (
            <div className="flex gap-4 text-sm bg-slate-900/30 p-3 rounded-lg border border-brand-border/50">
              <span className="text-brand-orange font-display">{testimonialsBadge}</span>
              <span className="text-slate-400">/</span>
              <span className="text-white font-display">{testimonialsTitle}</span>
            </div>
          )}
        </div>

        {/* Testimonials List */}
        <div className="space-y-4 pt-4 border-t border-brand-border/40">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-normal uppercase text-slate-400">Review Cards</h3>
             {!isAddingTest && !isEditingTestId && (
               <button onClick={() => setIsAddingTest(true)} className="bg-brand-orange text-black px-3 py-1.5 rounded text-[10px] uppercase flex items-center gap-1 hover:bg-brand-gold">
                 <Plus className="h-3 w-3" /> Add Review
               </button>
             )}
          </div>

          {(isAddingTest || isEditingTestId) ? (
            <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-brand-border relative">
              <button type="button" onClick={resetTestForm} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Customer Name</label><input type="text" value={testForm.name} onChange={(e) => setTestForm({...testForm, name: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-normal uppercase block">Subtitle / Role / Location</label><input type="text" value={testForm.role} onChange={(e) => setTestForm({...testForm, role: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" /></div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-normal uppercase block">Avatar Image</label>
                  <div className="flex items-center gap-4">
                    {testForm.avatar && <img src={testForm.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-brand-border object-cover" />}
                    <input type="text" value={testForm.avatar} onChange={(e) => setTestForm({...testForm, avatar: e.target.value})} placeholder="Image URL" className="flex-1 rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-normal uppercase block">Quote / Review</label><textarea value={testForm.quote} onChange={(e) => setTestForm({...testForm, quote: e.target.value})} required className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 text-xs focus:border-brand-orange text-white italic" rows={3} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="submit" className="bg-brand-orange px-4 py-2 rounded-lg text-xs uppercase text-black hover:bg-brand-gold">Save Review</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {testimonialsList.map((test) => (
                <div key={test.id} className="bg-slate-900/30 p-4 rounded-xl border border-brand-border/50 flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-start">
                    <img src={test.avatar || "/placeholder.jpg"} alt={test.name} className="w-10 h-10 rounded-full border border-brand-border object-cover mt-1" />
                    <div>
                      <h4 className="text-white text-xs font-normal">{test.name}</h4>
                      <span className="text-[9px] text-slate-400 uppercase block mb-2">{test.role}</span>
                      <p className="text-slate-300 text-xs italic">"{test.quote}"</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => { setTestForm(test); setIsEditingTestId(test.id); }} className="p-1.5 text-slate-400 hover:text-brand-orange bg-slate-950 rounded border border-brand-border"><Edit2 className="w-3 h-3" /></button>
                     <button onClick={() => {
                       showDialog({ type: 'confirm', title: 'Delete', message: 'Delete this review?', onConfirm: () => removeTestimonial(test.id) })
                     }} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-950 rounded border border-brand-border"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
              {testimonialsList.length === 0 && <p className="text-xs text-slate-400">No testimonials found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
