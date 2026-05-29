import React from "react";
import { Truck, PackageCheck, Clock, MapPin } from "lucide-react";

export default function ShippingView() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-brand-orange mb-4 shadow-glow">
          <Truck className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal uppercase tracking-tight text-white leading-none">
          Shipping Policy
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Fast, secure, and fully tracked. Read below to understand how MARQUE RC processes and dispatches your high-performance machines across India.
        </p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm">
        {/* Section 1 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4">
            <Clock className="h-5 w-5 text-brand-orange" />
            <h2 className="font-display text-xl font-normal uppercase text-white">1. Order Processing Time</h2>
          </div>
          <p>
            All orders are processed and prepared for dispatch within <strong>24-48 hours</strong> of payment confirmation (excluding Sundays and national holidays).
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-brand-orange">
            <li>Orders placed before 12:00 PM IST typically dispatch the same day.</li>
            <li>Custom builds or heavily accessorized orders may require an additional 24 hours for assembly and rigorous pre-flight/pre-run checks.</li>
            <li>You will receive a dispatch confirmation email and SMS with your AWB Tracking Number once the package leaves our facility.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4">
            <MapPin className="h-5 w-5 text-brand-gold" />
            <h2 className="font-display text-xl font-normal uppercase text-white">2. Shipping Rates & Delivery Estimates</h2>
          </div>
          <p>
            We partner with premium logistics carriers (BlueDart, Delhivery Surface) to ensure the safe transport of bulky RC boxes and LiPo batteries.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-brand-gold">
            <li><strong>Standard Surface (3-7 Days):</strong> Recommended for all orders containing LiPo batteries (Aviation regulations prohibit air-shipping high-capacity LiPos).</li>
            <li><strong>Express Air (1-3 Days):</strong> Available only for orders containing NO batteries (e.g., bare chassis, spare parts, plastics).</li>
            <li><strong>Free Shipping:</strong> Automatically applied to all orders over ₹10,000.</li>
            <li><em>Note: Deliveries to remote locations (J&K, North East India) may experience an additional 3-5 days in transit.</em></li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-2xl border border-brand-border bg-slate-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-3 mb-4">
            <PackageCheck className="h-5 w-5 text-blue-400" />
            <h2 className="font-display text-xl font-normal uppercase text-white">3. Pincode Serviceability & Tracking</h2>
          </div>
          <p>
            Because RC cars come in highly oversized boxes, standard courier networks sometimes lack serviceability to remote pincodes.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-blue-400">
            <li>Always use the Pincode Checker on the product page before checking out.</li>
            <li>If your location is unserviceable, contact us directly at support@marque.co.in to arrange specialized freight delivery.</li>
            <li>You can track your active consignments live directly from the MARQUE Logistics Desk within your Account Dashboard.</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center text-xs text-slate-500">
        <p>Last Updated: May 2026</p>
        <p>For logistics inquiries, please contact logistics@marque.co.in</p>
      </div>
    </div>
  );
}
