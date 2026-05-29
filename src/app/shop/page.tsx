"use client";

import dynamic from 'next/dynamic';
const ShopView = dynamic(() => import('../../components/ShopView'), { ssr: false });;

export default function ShopViewPage() {
  return <ShopView />;
}
