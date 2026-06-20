'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#05070c]">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-900 border border-red-500/30 text-red-500 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-normal uppercase tracking-tight text-white">
          Something Went Wrong
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          An unexpected error occurred. Our pit crew has been notified. Please try again or head back to the garage.
        </p>

        {error.digest && (
          <p className="text-[10px] text-slate-600 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-xs font-normal uppercase text-black hover:bg-brand-gold hover:shadow-glow transition-all tracking-wider"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-slate-900 px-6 py-3.5 text-xs font-normal uppercase text-slate-300 hover:border-brand-orange hover:text-brand-orange transition-all tracking-wider"
          >
            Return to Garage
          </a>
        </div>
      </div>
    </div>
  );
}
