"use client";

import React, { useState, useRef } from "react";
import { useUIStore, UnboxingVideo } from "../../store/useUIStore";
import { Plus, Trash2, Edit2, PlayCircle, Video, AlertCircle, Upload, Loader2 } from "lucide-react";
import { uploadVideoToCloudinary } from "../../utils/cloudinary";

const getEmbedUrl = (url: string): string => {
  let embedUrl = url.trim();
  // youtube.com/watch?v=ID
  if (embedUrl.includes("youtube.com/watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
    if (embedUrl.includes("&")) embedUrl = embedUrl.split("&")[0];
  }
  // youtube.com/shorts/ID
  else if (embedUrl.includes("youtube.com/shorts/")) {
    embedUrl = embedUrl.replace("youtube.com/shorts/", "youtube.com/embed/");
    if (embedUrl.includes("?")) embedUrl = embedUrl.split("?")[0];
  }
  // youtu.be/ID
  else if (embedUrl.includes("youtu.be/")) {
    embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
    if (embedUrl.includes("?")) embedUrl = embedUrl.split("?")[0];
  }
  return embedUrl;
};

export function VideosTab() {
  const { unboxingVideos, addUnboxingVideo, updateUnboxingVideo, removeUnboxingVideo } =
    useUIStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "", description: "" });
  const [urlError, setUrlError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (url: string, file: File | null) => {
    if (file) return true;
    
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("URL or File is required.");
      return false;
    }
    if (
      !trimmed.includes("youtube.com") &&
      !trimmed.includes("youtu.be") &&
      !trimmed.includes("youtube.com/embed/") &&
      !trimmed.includes("cloudinary.com") && 
      !trimmed.endsWith(".mp4")
    ) {
      setUrlError("Please enter a valid YouTube URL or upload a video.");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    if (!validateUrl(formData.url, videoFile)) return;

    setIsUploading(true);
    let finalUrl = formData.url;

    try {
      if (videoFile) {
        finalUrl = await uploadVideoToCloudinary(videoFile);
      } else {
        finalUrl = getEmbedUrl(formData.url);
      }

      if (isEditing) {
        updateUnboxingVideo({
          id: isEditing,
          title: formData.title,
          url: finalUrl,
          description: formData.description,
        });
      } else {
        addUnboxingVideo({
          id: `video-${Date.now()}`,
          title: formData.title,
          url: finalUrl,
          description: formData.description,
        });
      }

      setIsEditing(null);
      setFormData({ title: "", url: "", description: "" });
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUrlError("");
    } catch (err) {
      console.error("Failed to upload video", err);
      setUrlError("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (video: UnboxingVideo) => {
    setIsEditing(video.id);
    setFormData({ title: video.title, url: video.url, description: video.description });
    setUrlError("");
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: "", url: "", description: "" });
    setVideoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUrlError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-normal uppercase text-white tracking-wider">
          Unboxing Videos
        </h2>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4">
        <Video className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-normal text-brand-gold uppercase tracking-wider">Video Sources</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste a YouTube video link OR upload an MP4/WebM file directly from your computer. 
            Direct uploads are saved securely to Cloudinary.
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
                  placeholder="e.g. Traxxas X-Maxx Unboxing"
                  className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                  YouTube URL OR Upload Video *
                </label>
                
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.url}
                    disabled={!!videoFile || isUploading}
                    onChange={(e) => {
                      setFormData({ ...formData, url: e.target.value });
                      if (urlError) validateUrl(e.target.value, videoFile);
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm ${videoFile ? 'text-slate-500' : 'text-white'} focus:outline-none focus:border-brand-orange ${urlError && !videoFile ? "border-red-500" : "border-brand-border"}`}
                  />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 border border-dashed border-brand-border rounded-lg p-3 text-center bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        ref={fileInputRef}
                        disabled={!!formData.url || isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setVideoFile(file);
                          if (file && urlError) validateUrl(formData.url, file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Upload className={`h-5 w-5 ${formData.url ? 'text-slate-600' : 'text-brand-orange'}`} />
                        <span className={`text-[10px] uppercase tracking-wider ${formData.url ? 'text-slate-600' : 'text-slate-300'}`}>
                          {videoFile ? videoFile.name : "Or Upload Video File"}
                        </span>
                      </div>
                    </div>
                    {videoFile && (
                      <button 
                        onClick={() => { setVideoFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {urlError && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3 w-3 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-400">{urlError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what's in this video..."
                  rows={3}
                  className="w-full bg-slate-950 border border-brand-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={(!formData.title || (!formData.url && !videoFile)) || isUploading}
                  className="flex-1 bg-brand-orange text-black font-normal uppercase text-xs py-2.5 rounded-lg hover:bg-brand-gold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {isUploading ? "Uploading..." : isEditing ? "Update Video" : "Save to Database"}
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
            {unboxingVideos.length === 0 ? (
              <div className="col-span-2 rounded-xl border border-dashed border-brand-border bg-slate-900/10 p-12 text-center text-slate-400">
                <PlayCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No unboxing videos added yet.</p>
                <p className="text-xs mt-1 text-slate-500">Add a YouTube URL above to get started.</p>
              </div>
            ) : (
              unboxingVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl border border-brand-border bg-slate-900/30 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video bg-black border-b border-brand-border">
                    {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={video.url}
                        className="absolute inset-0 w-full h-full object-contain"
                        controls
                      />
                    )}
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
                        onClick={() => removeUnboxingVideo(video.id)}
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
