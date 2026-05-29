"use client";

import React, { useState } from "react";
import { FolderTree, Plus, X, Trash2, Edit2, Loader2, Image as ImageIcon } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useUIStore } from "../../store/useUIStore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

export function CategoriesTab() {
  const { showDialog } = useUIStore();
  const { categories, addCategory, updateCategory, deleteCategory, products } = useProductStore();

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setFormImage(url);
      } catch (error) {
        showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetForm = () => {
    setFormId("");
    setFormName("");
    setFormImage("");
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleOpenEdit = (cat: any) => {
    setFormId(cat.id);
    setFormName(cat.name);
    setFormImage(cat.image);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName || !formImage) return showDialog({ title: 'Validation Error', message: 'Please fill in all fields.' });
    
    // Prevent overriding existing IDs when adding new
    if (isAdding && categories.some(c => c.id === formId)) {
      return showDialog({ title: 'Error', message: 'A category with this ID already exists.' });
    }

    const categoryData = {
      id: formId,
      name: formName,
      image: formImage
    };

    if (isEditing) {
      updateCategory(categoryData);
      showDialog({ title: 'Success', message: `Success: ${formName} category updated!` });
    } else {
      addCategory(categoryData);
      showDialog({ title: 'Success', message: `Success: ${formName} category added!` });
    }
    resetForm();
  };

  const handleDeleteClick = (id: string, name: string) => {
    const activeProducts = products.filter(p => p.categoryId === id);
    if (activeProducts.length > 0) {
      showDialog({ title: 'Cannot Delete', message: `Cannot delete ${name}. There are ${activeProducts.length} product(s) assigned to this category. Reassign them first.` });
      return;
    }

    showDialog({
      type: 'confirm',
      title: 'Delete Category',
      message: `CRITICAL DELETION: Remove Category "${name}"?`,
      onConfirm: () => {
        deleteCategory(id);
        showDialog({ title: 'Success', message: `Deleted ${name}.` });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-6 rounded-2xl border border-brand-border">
        <div className="space-y-1">
          <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <FolderTree className="h-4.5 w-4.5 text-brand-orange" /> Category Management
          </h3>
          <p className="text-[10px] text-slate-400">Manage homepage category sections and product groupings.</p>
        </div>
        {!isAdding && !isEditing && (
          <button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-brand-orange text-white sm:text-black px-4 py-2.5 rounded-lg text-xs font-normal uppercase flex items-center gap-1.5 hover:bg-brand-gold transition-colors">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSave} className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-brand-border backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h4 className="font-display text-base font-normal uppercase text-white flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-brand-orange" /> {isEditing ? `Edit Category: ${formName}` : "Create New Category"}
            </h4>
            <button type="button" onClick={resetForm} className="text-slate-500 hover:text-red-500"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Category ID (System Key)</label>
              <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)} disabled={isEditing} required placeholder="e.g., crawler, drone" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange disabled:opacity-50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Display Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="e.g., RC Crawlers" className="w-full rounded-lg bg-slate-950 border border-brand-border py-2 px-3 focus:border-brand-orange" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] text-slate-400 font-normal uppercase block">Category Image</label>
              <div className="flex items-center gap-4">
                {formImage && (
                  <div className="h-16 w-16 rounded border border-brand-border overflow-hidden bg-slate-900 shrink-0 relative group">
                    <img src={formImage} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormImage('')}
                      className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex text-red-500 hover:text-red-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                )}
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className={`w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-normal file:uppercase file:bg-brand-orange file:text-white sm:text-black hover:file:bg-brand-gold file:transition-colors file:cursor-pointer bg-slate-900/50 border border-brand-border rounded-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {isUploading && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 uppercase font-normal tracking-wider">Max size: 1MB. Square format recommended.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <button type="button" onClick={resetForm} className="border border-brand-border px-4 py-2 rounded-lg text-xs font-normal uppercase text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="bg-brand-orange px-5 py-2 rounded-lg text-xs font-normal uppercase text-white sm:text-black hover:bg-brand-gold transition-colors">{isEditing ? "Save Changes" : "Create Category"}</button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-slate-950 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-brand-border text-[10px] uppercase font-normal text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category ID</th>
                <th className="px-6 py-4">Products Linked</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-slate-200">
              {categories.map(cat => {
                const linkedCount = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <tr key={cat.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-brand-border bg-black">
                        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-normal text-sm text-white">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-brand-orange">{cat.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-brand-border text-[10px] font-normal">
                        {linkedCount} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(cat)} className="text-slate-400 hover:text-brand-orange p-1.5 transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteClick(cat.id, cat.name)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-normal uppercase tracking-wider">
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
