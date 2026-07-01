"use client";

import React, { useState } from "react";
import { useUIStore, RacingVideo } from "../../store/useUIStore";
import { Plus, Trash2, Edit2, PlayCircle, Video, AlertCircle } from "lucide-react";

const getEmbedUrl = (url: string): string => {
  let embedUrl = url.trim();
  if (embedUrl.includes("youtube.com/watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
    if (embedUrl.includes("&")) embedUrl = embedUrl.split("&")[0];
  } else if (embedUrl.includes("youtube.com/shorts/")) {
    embedUrl = embedUrl.replace("youtube.com/shorts/", "youtube.com/embed/");
    if (embedUrl.includes("?")) embedUrl = embedUrl.split("?")[0];
  } else if (embedUrl.includes("youtu.be/")) {
    embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
    if (embedUrl.includes("?")) embedUrl = embedUrl.split("?")[0];
  }
  return embedUrl;
};

export function RacingVideosTab() {
  const { racingVideos, addRacingVideo, updateRacingVideo, removeRacingVideo } = useUIStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "", description: "" });
  const [urlError, setUrlError] = useState("");

  const validateUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("URL is required.");
      return false;
    }
    if (
      !trimmed.includes("youtube.com") &&
      !trimmed.includes("youtu.be")
    ) {
      setUrlError("Please enter a valid YouTube URL.");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (!validateUrl(formData.url)) return;

    const formattedUrl = getEmbedUrl(formData.url);

    if (isEditing) {
      updateRacingVideo({
        id: isEditing,
        title: formData.title,
        url: formattedUrl,
        description: formData.description,
      });
    } else {
      addRacingVideo({
        id: `racing-${Date.now()}`,
        title: formData.title,
        url: formattedUrl,
        description: formData.description,
      });
    }

    setIsEditing(null);
    setFormData({ title: "", url: "", description: "" });
    setUrlError("");
  };

  const startEdit = (video: RacingVideo) => {
    setIsEditing(video.id);
    setFormData({ title: video.title, url: video.url, description: video.description });
    setUrlError("");
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: "", url: "", description: "" });
    setUrlError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-normal uppercase text-white tracking-wider">
          Live Racing &amp; Bashing Videos
        </h2>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4">
        <Video className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-normal text-brand-gold uppercase tracking-wider">YouTube URLs Only</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste a YouTube video link (youtube.com/watch?v=..., youtu.be/..., or Shorts).
            It will be converted to an embed URL automatically. Videos are saved to the cloud database and will never disappear.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-brand-border bg-slate-900/30 p-6 space-y-4">
            <h2 className="font-display text-sm font-normal uppercase text-brand-orange">
              {isEditing ? "Edit Video" : "Add New Video"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Arrma Kraton 8S Big Air Jump"
                  className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    if (urlError) validateUrl(e.target.value);
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange ${urlError ? "border-red-500" : "border-brand-border"}`}
                />
                {urlError && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3 w-3 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-400">{urlError}</p>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports: youtube.com/watch?v=..., youtu.be/..., YouTube Shorts
                </p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this racing/bashing session..."
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
                  {isEditing ? "Update Video" : "Save to Database"}
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
              <div className="col-span-2 rounded-xl border border-dashed border-brand-border bg-slate-900/10 p-12 text-center text-slate-400">
                <PlayCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No racing videos added yet.</p>
                <p className="text-xs mt-1 text-slate-500">Add a YouTube URL above to get started.</p>
              </div>
            ) : (
              racingVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl border border-brand-border bg-slate-900/30 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video bg-black border-b border-brand-border">
                    <iframe
                      src={video.url}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-display text-sm text-white uppercase">{video.title}</h3>
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
