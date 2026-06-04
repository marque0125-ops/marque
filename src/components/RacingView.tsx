"use client";

import React from "react";
import { useUIStore } from "../store/useUIStore";
import { PlayCircle, Flame, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RacingView() {
  const { racingVideos } = useUIStore();
  const router = useRouter();

  return (
    <div className="space-y-4 pb-24">
      {/* Hero Header Section */}
      <section className="relative rounded-3xl border border-brand-border bg-slate-950 py-2 px-6 sm:px-12 text-center overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-xs font-normal text-brand-orange uppercase tracking-wider">
            <Flame className="h-4 w-4" />
            Live Event Coverage & Bashing
          </div>
          
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-tight text-white leading-tight">
            FEEL THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">ADRENALINE</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Catch high-speed runs, insane jumps, and pure RC madness from our latest track events and community bashing sessions!
          </p>

          <div className="pt-4 flex justify-center">
             <button
                onClick={() => router.push('/shop')}
                className="group flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-8 py-4 text-sm font-normal text-black hover:bg-brand-gold hover:shadow-glow transition-all duration-300 uppercase tracking-wider"
              >
                Gear Up Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-gold font-normal uppercase tracking-widest block">
            Community Tournaments & Bashing
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-normal uppercase text-white tracking-tight">
            WATCH LIVE RACING & BASHING 🎬
          </h2>
        </div>

        {racingVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-slate-900/10 p-16 text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-display uppercase text-white tracking-wider">No Videos Yet</h3>
            <p className="text-sm text-slate-400 mt-2">Check back soon for pure adrenaline action from the track!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {racingVideos.map((video) => (
              <div key={video.id} className="group rounded-3xl border border-brand-border bg-slate-900/30 overflow-hidden hover:border-brand-orange hover:shadow-glow transition-all duration-300">
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
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  )}
                </div>
                <div className="p-6 sm:p-8 space-y-3">
                  <h3 className="font-display text-xl sm:text-2xl font-normal text-white uppercase group-hover:text-brand-orange transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
