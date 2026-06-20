"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '../store/useProductStore';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export default function BlogArticleView() {
  const { id } = useParams();
  const router = useRouter();
  const { guides } = useProductStore();

  const article = guides.find(g => g.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-3xl font-display uppercase tracking-wider mb-4">Article Not Found</h1>
        <p className="text-slate-400 mb-8">The guide you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/blog')} className="px-6 py-3 bg-brand-orange text-black uppercase text-sm tracking-wider font-normal rounded-xl">
          Return to Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button onClick={() => router.push('/blog')} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </button>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-3 py-1 rounded-md text-[10px] font-normal uppercase tracking-widest">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal uppercase tracking-tight leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg text-slate-300 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden border border-brand-border/40 bg-slate-900 relative">
          <Image 
            src={article.imageUrl} 
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-orange max-w-none">
          {/* We use dangerouslySetInnerHTML because the content might contain HTML if the admin used a rich text editor. If not, it just renders text. */}
          <div 
            className="text-slate-300 leading-loose space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
          />
        </div>

      </div>
    </div>
  );
}
