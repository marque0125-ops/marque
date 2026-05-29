"use client";

import dynamic from 'next/dynamic';
const ShippingView = dynamic(() => import('../../components/ShippingView'), { ssr: false });;

export default function ShippingViewPage() {
  return <ShippingView />;
}
