"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '../store/useProductStore';
import { Clock, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';

export default function BlogView() {
  const { guides } = useProductStore();
  const [filter, setFilter] = useState('All');

  // Extract unique categories from guides
  const categories = ['All', ...Array.from(new Set(guides.map(g => g.category)))];

  const filteredGuides = filter === 'All' 
    ? guides 
    : guides.filter(g => g.category === filter);

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] text-brand-orange font-normal uppercase tracking-widest">Knowledge Base</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-tight">
            The Pit <span className="text-brand-orange">Stop</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Expert maintenance tips, build guides, and the latest news from the world of high-performance RC racing.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-xs font-normal uppercase tracking-wider transition-all border ${
                filter === category
                  ? "bg-brand-orange text-black border-brand-orange"
                  : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-brand-border/40">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl text-white font-display uppercase tracking-wider">No Articles Found</h3>
            <p className="text-slate-400 text-sm mt-2">Check back later for new guides in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <Link href={`/blog/${guide.id}`} key={guide.id} className="group flex flex-col bg-slate-900/50 border border-brand-border/40 rounded-2xl overflow-hidden hover:border-brand-orange/50 transition-all">
                {/* Image */}
                <div className="aspect-[16/10] bg-slate-800 relative overflow-hidden">
                  <img 
                    src={guide.imageUrl} 
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-normal uppercase tracking-wider text-brand-orange">
                      {guide.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 className="text-lg text-white font-display uppercase tracking-wider leading-snug mb-3 group-hover:text-brand-orange transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {guide.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-brand-orange text-xs font-normal uppercase tracking-widest group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
