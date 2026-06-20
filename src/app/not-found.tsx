import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#05070c]">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-900 border border-brand-border text-brand-orange mx-auto">
          <span className="font-display text-3xl font-normal">404</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-normal uppercase tracking-tight text-white">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to the garage and explore our collection of premium RC cars.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-xs font-normal uppercase text-black hover:bg-brand-gold hover:shadow-glow transition-all tracking-wider"
          >
            Return to Garage
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-slate-900 px-6 py-3.5 text-xs font-normal uppercase text-slate-300 hover:border-brand-orange hover:text-brand-orange transition-all tracking-wider"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
