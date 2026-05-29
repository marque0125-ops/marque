import React from 'react';
import { CheckCircle2, Package, Truck, MapPin, Map, PackageX } from 'lucide-react';

interface TrackingMapProps {
  status: string;
}

export function OrderTrackingMap({ status }: TrackingMapProps) {
  const steps = [
    { id: 'placed', label: 'Order Placed', icon: Package },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'dispatched', label: 'Dispatched', icon: Truck },
    { id: 'out-of-delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: Map }
  ];

  if (status === 'cancelled') {
    return (
      <div className="w-full bg-slate-950/80 border border-brand-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
        <PackageX className="h-12 w-12 text-red-500 mb-3" />
        <h3 className="font-display font-normal text-lg text-red-500 uppercase">Order Cancelled</h3>
        <p className="text-xs text-slate-400">This consignment has been aborted and refunded.</p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === status) || 0;

  return (
    <div className="w-full bg-slate-950/80 border border-brand-border rounded-2xl p-6 relative overflow-hidden">
      {/* Background SVG Map Graphic */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="20" cy="40" r="1" fill="currentColor" />
        <circle cx="80" cy="60" r="1" fill="currentColor" />
      </svg>

      <div className="relative z-10">
        <h3 className="font-display text-sm font-normal uppercase tracking-wider text-slate-200 mb-8 flex items-center gap-2">
          <Map className="h-4 w-4 text-brand-orange" />
          Live Telemetry Routing
        </h3>

        <div className="relative flex justify-between items-center w-full">
          {/* Connecting Line Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-brand-orange -translate-y-1/2 z-0 rounded-full transition-all duration-1000 shadow-[0_0_10px_#f97316]"
            style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Nodes */}
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? 'bg-brand-orange text-white sm:text-black border-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  } ${isCurrent ? 'animate-pulse' : ''}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-normal uppercase tracking-wider text-center max-w-[60px] ${isActive ? 'text-brand-orange' : 'text-slate-600'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
