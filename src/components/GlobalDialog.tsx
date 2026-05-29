import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export function GlobalDialog() {
  const { dialog, closeDialog } = useUIStore();

  if (!dialog.isOpen) return null;

  const handleConfirm = () => {
    if (dialog.onConfirm) dialog.onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    if (dialog.onCancel) dialog.onCancel();
    closeDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-slate-950 border border-brand-border rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.1)] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {dialog.type === 'confirm' ? (
              <AlertTriangle className="h-6 w-6 text-brand-orange" />
            ) : (
              <AlertCircle className="h-6 w-6 text-brand-orange" />
            )}
            <h3 className="font-display font-normal text-lg text-white uppercase tracking-wider">
              {dialog.title || (dialog.type === 'confirm' ? 'Confirm Action' : 'System Notice')}
            </h3>
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {dialog.message}
          </p>

          <div className="flex gap-3 justify-end mt-2">
            {dialog.type === 'confirm' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-normal uppercase rounded-lg border border-brand-border text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {dialog.cancelText || 'Cancel'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-xs font-normal uppercase rounded-lg bg-brand-orange text-white sm:text-black hover:bg-brand-gold transition-colors shadow-glow"
            >
              {dialog.confirmText || 'OK'}
            </button>
          </div>
        </div>
        
        {/* Accent Bar at bottom */}
        <div className="h-1 w-full bg-brand-orange" />
      </div>
    </div>
  );
}
