"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function ContactView() {
  const { showDialog } = useUIStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showDialog({ title: 'Error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        showDialog({ title: 'Message Sent', message: 'Your dispatch has been successfully transmitted to HQ!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err: any) {
      showDialog({ title: 'Transmission Failed', message: err.message || 'Could not send the message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] text-brand-orange font-normal uppercase tracking-widest">Reach Out</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-tight">
            Contact <span className="text-brand-orange">HQ</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Need telemetry support? Got a question about your order? Or just want to talk high-speed bashers? Our pit crew is standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">

          {/* Left Column: Contact Form */}
          <div className="bg-slate-900/50 border border-brand-border/40 rounded-3xl p-8 lg:p-10">
            <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">Send a Dispatch</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-normal uppercase tracking-widest block">Pilot Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-normal uppercase tracking-widest block">Comms Channel (Email)</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-normal uppercase tracking-widest block">Telemetry Data (Subject)</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all" placeholder="Order Issue / Product Question" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-normal uppercase tracking-widest block">Message Payload</label>
                <textarea rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all resize-none" placeholder="Describe your issue or inquiry..." required></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-orange text-black hover:bg-orange-500 disabled:opacity-50 font-normal uppercase tracking-widest text-sm py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</> : <>Transmit Message <ChevronRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="bg-slate-900/30 border border-brand-border/40 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 hover:border-brand-orange/50 transition-colors">
                <div className="w-12 h-12 bg-black border border-slate-800 rounded-full flex items-center justify-center text-brand-orange">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-display uppercase tracking-wider mb-1">Email Support</h3>
                  <a href="mailto:2002dineshmurugan@gmail.com" className="text-sm text-slate-400 hover:text-brand-orange transition-colors">2002dineshmurugan@gmail.com</a>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-brand-border/40 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 hover:border-brand-orange/50 transition-colors">
                <div className="w-12 h-12 bg-black border border-slate-800 rounded-full flex items-center justify-center text-brand-orange">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-display uppercase tracking-wider mb-1">Direct Line</h3>
                  <a href="tel:+9187544 98038" className="text-sm text-slate-400 hover:text-brand-orange transition-colors">+91 87544 98038</a>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-brand-border/40 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 hover:border-brand-orange/50 transition-colors sm:col-span-2">
                <div className="w-12 h-12 bg-black border border-slate-800 rounded-full flex items-center justify-center text-brand-orange">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-display uppercase tracking-wider mb-1">HQ Location</h3>
                  <p className="text-sm text-slate-400 max-w-[250px] mx-auto">
                    Medavakkam main road, Madipakkam<br />
                    Chennai, Tamil Nadu 600091
                  </p>
                </div>
              </div>

            </div>

            {/* Operating Hours */}
            <div className="bg-slate-900/50 border border-brand-border/40 rounded-2xl p-6 md:p-8 flex items-start gap-4">
              <Clock className="w-6 h-6 text-brand-orange shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-display uppercase tracking-wider mb-2">Pit Stop Hours</h3>
                <div className="space-y-1 text-sm text-slate-400">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>Monday - Friday</span>
                    <span className="text-white">10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Sunday</span>
                    <span className="text-brand-orange">Closed (Racing)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
