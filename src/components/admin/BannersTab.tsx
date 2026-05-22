import React, { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, X, Save, Layers, Loader2 } from "lucide-react";
import { useUIStore, BannerSlide } from "../../store/useUIStore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

export function BannersTab() {
  const { showDialog } = useUIStore();
  const { 
    heroBanners, addHeroBanner, updateHeroBanner, removeHeroBanner,
    promoBanners, addPromoBanner, updatePromoBanner, removePromoBanner
  } = useUIStore();

  const [activeTab, setActiveTab] = useState<'hero' | 'promo'>('hero');

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formImageUrl, setFormImageUrl] = useState("");
  const [formBadgeText, setFormBadgeText] = useState("");
  const [formTitleMain, setFormTitleMain] = useState("");
  const [formTitleSub, setFormTitleSub] = useState("");

  const resetForm = () => {
    setFormImageUrl("");
    setFormBadgeText("");
    setFormTitleMain("");
    setFormTitleSub("");
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleOpenEdit = (slide: BannerSlide) => {
    setFormImageUrl(slide.imageUrl);
    setFormBadgeText(slide.badgeText);
    setFormTitleMain(slide.titleMain);
    setFormTitleSub(slide.titleSub);
    setIsEditing(slide.id);
    setIsAdding(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFormImageUrl(url);
    } catch (error) {
      showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      showDialog({ title: 'Validation Error', message: 'Please provide an image.' });
      return;
    }
    
    const newSlide = {
      id: isEditing ? isEditing : `banner-${Date.now()}`,
      imageUrl: formImageUrl,
      badgeText: formBadgeText,
      titleMain: formTitleMain,
      titleSub: formTitleSub,
    };

    if (activeTab === 'hero') {
      if (isEditing) updateHeroBanner(newSlide);
      else addHeroBanner(newSlide);
    } else {
      if (isEditing) updatePromoBanner(newSlide);
      else addPromoBanner(newSlide);
    }

    showDialog({ title: 'Success', message: `Banner ${isEditing ? 'updated' : 'added'} successfully!` });
    resetForm();
  };

  const handleDelete = (id: string) => {
    showDialog({
      type: 'confirm',
      title: 'Remove Banner',
      message: 'Are you sure you want to remove this banner slide?',
      onConfirm: () => {
        if (activeTab === 'hero') removeHeroBanner(id);
        else removePromoBanner(id);
      }
    });
  };

  const currentBanners = activeTab === 'hero' ? heroBanners : promoBanners;

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('hero'); resetForm(); }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeTab === 'hero' ? 'bg-brand-orange text-black border-brand-orange' : 'border-brand-border bg-slate-900 text-slate-400 hover:text-white'}`}
        >
          Hero Banner Slider
        </button>
        <button
          onClick={() => { setActiveTab('promo'); resetForm(); }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeTab === 'promo' ? 'bg-brand-orange text-black border-brand-orange' : 'border-brand-border bg-slate-900 text-slate-400 hover:text-white'}`}
        >
          Standalone Promo Slider
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-6 rounded-2xl border border-brand-border">
        <div className="space-y-1">
          <label className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-brand-orange mb-2 animate-spin" />
                <span className="text-sm font-medium text-slate-300">Uploading to Cloudinary...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-slate-500 mb-2" />
                <span className="text-sm font-medium text-slate-300">Click to upload image</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
          </label>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ImageIcon className="h-4.5 w-4.5 text-brand-orange" /> 
            {activeTab === 'hero' ? "Top Hero Banners" : "Promo Banners"}
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'hero' 
              ? "Manage the main auto-rotating slider at the very top of the Home page."
              : "Manage the full-width promotional slider in the middle of the Home page."}
          </p>
        </div>
        {!isAdding && !isEditing && (
          <button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-brand-orange text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-brand-gold">
            <Plus className="h-4 w-4" /> Add New Slide
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSave} className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-brand-border backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h4 className="font-display text-base font-bold uppercase text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-orange" /> {isEditing ? "Edit Slide" : "Create New Slide"}
            </h4>
            <button type="button" onClick={resetForm} className="text-slate-500 hover:text-red-500"><X className="h-5 w-5" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Banner Image</label>
              {formImageUrl && (
                <div className="h-40 w-full rounded border border-brand-border overflow-hidden bg-slate-950 relative mb-3">
                  <img src={formImageUrl} alt="Preview" className="h-full w-full object-contain" />
                  <button type="button" onClick={() => setFormImageUrl("")} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded text-red-500 hover:text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2 relative">
                <input type="text" value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="Or paste image URL here (e.g. /marque-banner-img.webp)" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className={`w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:transition-colors file:cursor-pointer border border-brand-border rounded-lg bg-slate-900/50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {isUploading && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-bold uppercase block">Badge Text (Optional)</label><input type="text" value={formBadgeText} onChange={(e) => setFormBadgeText(e.target.value)} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-bold uppercase block">Main Title (Optional)</label><input type="text" value={formTitleMain} onChange={(e) => setFormTitleMain(e.target.value)} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] text-slate-400 font-bold uppercase block">Subtitle (Optional)</label><input type="text" value={formTitleSub} onChange={(e) => setFormTitleSub(e.target.value)} className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" /></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <button type="button" onClick={resetForm} className="border border-brand-border px-4 py-2 rounded-lg text-xs font-bold uppercase text-slate-400">Cancel</button>
            <button type="submit" className="bg-brand-orange px-5 py-2 rounded-lg text-xs font-bold uppercase text-black hover:bg-brand-gold flex items-center gap-1.5">
              <Save className="h-4 w-4" /> Save Slide
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBanners.map((slide) => (
            <div key={slide.id} className="rounded-2xl border border-brand-border bg-slate-950 overflow-hidden flex flex-col group">
              <div className="relative h-40 bg-slate-900">
                <img src={slide.imageUrl} alt={slide.titleMain || "Banner"} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 space-y-0.5">
                  {slide.badgeText && <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider block">{slide.badgeText}</span>}
                  {slide.titleMain && <span className="font-display text-sm font-black text-white leading-none block">{slide.titleMain}</span>}
                  {slide.titleSub && <span className="text-[9px] text-slate-400 block">{slide.titleSub}</span>}
                </div>
              </div>
              <div className="p-3 flex justify-end gap-2 border-t border-brand-border bg-slate-900/50">
                <button onClick={() => handleOpenEdit(slide)} className="text-slate-400 hover:text-brand-orange text-[10px] font-bold uppercase flex items-center gap-1"><Edit2 className="h-3 w-3" /> Edit</button>
                <button onClick={() => handleDelete(slide.id)} className="text-slate-500 hover:text-red-500 text-[10px] font-bold uppercase flex items-center gap-1"><Trash2 className="h-3 w-3" /> Remove</button>
              </div>
            </div>
          ))}
          {currentBanners.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 text-xs">
              No banner slides found in this section. Add one to show on the Home page.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
