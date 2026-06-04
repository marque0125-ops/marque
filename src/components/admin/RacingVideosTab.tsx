"use client";

import React, { useState } from "react";
import { useUIStore, RacingVideo } from "../../store/useUIStore";
import { Plus, Trash2, Edit2, PlayCircle } from "lucide-react";

export function RacingVideosTab() {
  const { racingVideos, addRacingVideo, updateRacingVideo, removeRacingVideo } = useUIStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: ""
  });

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        alert("Video file size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const getEmbedUrl = (url: string) => {
    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
      const ampersandIndex = embedUrl.indexOf("&");
      if (ampersandIndex !== -1) embedUrl = embedUrl.substring(0, ampersandIndex);
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
      const questionIndex = embedUrl.indexOf("?");
      if (questionIndex !== -1) embedUrl = embedUrl.substring(0, questionIndex);
    }
    return embedUrl;
  };

  const handleSave = () => {
    if (!formData.title || !formData.url) return;

    const formattedUrl = getEmbedUrl(formData.url);

    if (isEditing) {
      updateRacingVideo({
        id: isEditing,
        title: formData.title,
        url: formattedUrl,
        description: formData.description
      });
    } else {
      addRacingVideo({
        id: `racing-${Date.now()}`,
        title: formData.title,
        url: formattedUrl,
        description: formData.description
      });
    }

    setIsEditing(null);
    setFormData({ title: "", url: "", description: "" });
  };

  const startEdit = (video: RacingVideo) => {
    setIsEditing(video.id);
    setFormData({
      title: video.title,
      url: video.url,
      description: video.description
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: "", url: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-normal uppercase text-white tracking-wider">Live Racing & Bashing Videos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-brand-border bg-slate-900/30 p-6 space-y-4">
            <h3 className="font-display text-sm font-normal uppercase text-brand-orange">
              {isEditing ? 'Edit Video' : 'Add New Video'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Video Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Arrma Kraton 8S Big Air Jump"
                  className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Video Embed URL</label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/embed/..."
                    className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Or Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-normal file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:transition-colors file:cursor-pointer bg-slate-900/50 border border-brand-border rounded-lg"
                  />
                  {formData.url.startsWith("data:video") && (
                    <p className="text-[10px] text-brand-orange mt-1.5 uppercase font-normal tracking-wider">Video loaded into memory</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!formData.title || !formData.url}
                  className="flex-1 bg-brand-orange text-black font-normal uppercase text-xs py-2.5 rounded-lg hover:bg-brand-gold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isEditing ? 'Update Video' : 'Add Video'}
                </button>
                {isEditing && (
                  <button
                    onClick={cancelEdit}
                    className="px-4 bg-slate-800 text-white font-normal uppercase text-xs py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {racingVideos.length === 0 ? (
              <div className="col-span-2 rounded-xl border border-dashed border-brand-border bg-slate-900/10 p-12 text-center text-slate-500">
                <PlayCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No racing videos added yet.</p>
              </div>
            ) : (
              racingVideos.map((video) => (
                <div key={video.id} className="rounded-xl border border-brand-border bg-slate-900/30 overflow-hidden flex flex-col">
                  <div className="relative aspect-video bg-black border-b border-brand-border">
                    {video.url.startsWith("data:video") ? (
                      <video 
                        src={video.url} 
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <iframe 
                        src={video.url} 
                        title={video.title}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="font-display text-sm text-white uppercase">{video.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{video.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-brand-border/50">
                      <button
                        onClick={() => startEdit(video)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white uppercase"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => removeRacingVideo(video.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs uppercase"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
