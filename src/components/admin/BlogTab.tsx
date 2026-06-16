"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, FileText, Image as ImageIcon, Clock, Hash, Loader2 } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useUIStore } from "../../store/useUIStore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { RCGuide } from "../../data/mockData";

export default function BlogTab() {
  const { guides, addGuide, updateGuide, deleteGuide } = useProductStore();
  const { showDialog } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Partial<RCGuide>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setEditingGuide({ ...editingGuide, imageUrl: url });
      } catch (error) {
        showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!editingGuide.title || !editingGuide.content || !editingGuide.category) {
      showDialog({ title: 'Validation Error', message: 'Please fill all required fields (Title, Content, Category)' });
      return;
    }

    if (editingGuide.id) {
      updateGuide(editingGuide as RCGuide);
    } else {
      const newGuide: RCGuide = {
        ...editingGuide,
        id: `g${Date.now()}`,
      } as RCGuide;
      addGuide(newGuide);
    }
    
    setIsEditing(false);
    setEditingGuide({});
  };

  const startEdit = (guide?: RCGuide) => {
    if (guide) {
      setEditingGuide(guide);
    } else {
      setEditingGuide({
        title: "",
        excerpt: "",
        content: "",
        category: "Buying Guides",
        readTime: "5 min read",
        imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80"
      });
    }
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    showDialog({
      type: 'confirm',
      title: 'Delete Article',
      message: 'Are you sure you want to delete this article?',
      onConfirm: () => deleteGuide(id)
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <h2 className="font-display text-xl font-normal text-white uppercase tracking-wider">
            {editingGuide.id ? "Edit Article" : "New Article"}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Article Title *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={editingGuide.title || ""}
                  onChange={e => setEditingGuide({ ...editingGuide, title: e.target.value })}
                  className="w-full rounded-lg border border-brand-border bg-slate-900/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-orange focus:bg-slate-900 transition-colors outline-none"
                  placeholder="The Ultimate RC Scale Guide"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Category *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={editingGuide.category || ""}
                    onChange={e => setEditingGuide({ ...editingGuide, category: e.target.value })}
                    className="w-full rounded-lg border border-brand-border bg-slate-900/50 pl-10 pr-4 py-2.5 text-sm text-white focus:border-brand-orange outline-none"
                    placeholder="Buying Guides"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Read Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={editingGuide.readTime || ""}
                    onChange={e => setEditingGuide({ ...editingGuide, readTime: e.target.value })}
                    className="w-full rounded-lg border border-brand-border bg-slate-900/50 pl-10 pr-4 py-2.5 text-sm text-white focus:border-brand-orange outline-none"
                    placeholder="5 min read"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Cover Image</label>
              <div className="flex items-center gap-4">
                {editingGuide.imageUrl ? (
                  <div className="h-16 w-16 rounded border border-brand-border overflow-hidden bg-slate-900 shrink-0 relative group">
                    <img src={editingGuide.imageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                    <button 
                      onClick={() => setEditingGuide({ ...editingGuide, imageUrl: '' })}
                      className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex text-red-500 hover:text-red-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded border border-brand-border border-dashed flex items-center justify-center bg-slate-900/50 shrink-0 text-slate-400">
                    <ImageIcon className="h-6 w-6" />
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
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-normal tracking-wider">Recommended: JPG, PNG, WEBP.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Short Excerpt</label>
              <textarea
                value={editingGuide.excerpt || ""}
                onChange={e => setEditingGuide({ ...editingGuide, excerpt: e.target.value })}
                className="w-full h-24 rounded-lg border border-brand-border bg-slate-900/50 p-3 text-sm text-white placeholder-slate-500 focus:border-brand-orange focus:bg-slate-900 transition-colors outline-none resize-none"
                placeholder="A brief summary for the card..."
              />
            </div>
          </div>

          <div className="space-y-1.5 h-full flex flex-col">
            <label className="text-xs font-normal uppercase tracking-wider text-slate-400">Full Content *</label>
            <textarea
              value={editingGuide.content || ""}
              onChange={e => setEditingGuide({ ...editingGuide, content: e.target.value })}
              className="w-full flex-1 min-h-[300px] rounded-lg border border-brand-border bg-slate-900/50 p-4 text-sm text-slate-300 placeholder-slate-600 focus:border-brand-orange focus:bg-slate-900 transition-colors outline-none leading-relaxed"
              placeholder="Write your article here..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-6 py-2.5 text-sm font-normal text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-brand-orange px-8 py-2.5 text-sm font-normal text-white sm:text-black hover:bg-brand-gold hover:shadow-glow transition-all uppercase tracking-wider"
          >
            <Save className="h-4 w-4" />
            Save Article
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-normal text-white uppercase tracking-wider">
            Blog Management
          </h2>
          <p className="text-xs text-slate-400">Create and edit articles for the Knowledge Database.</p>
        </div>
        <button
          onClick={() => startEdit()}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-normal text-white sm:text-black hover:bg-brand-gold hover:shadow-glow transition-all uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div key={guide.id} className="rounded-xl border border-brand-border bg-slate-900/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors">
            <div className="relative h-32 bg-slate-800">
              {guide.imageUrl ? (
                <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <span className="absolute top-2 right-2 bg-slate-950/80 border border-brand-border text-[8px] font-normal text-brand-orange uppercase px-2 py-0.5 rounded backdrop-blur">
                {guide.category}
              </span>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="font-normal text-white text-sm line-clamp-2 mb-2 leading-snug">{guide.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{guide.excerpt}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-brand-border/50">
                <span className="text-[10px] text-slate-400 font-normal">{guide.readTime}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEdit(guide)}
                    className="p-1.5 text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(guide.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {guides.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-brand-border rounded-xl">
            No articles found. Click "New Article" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
