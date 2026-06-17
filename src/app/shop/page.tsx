import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: "Shop High-Performance RC Cars | MARQUE",
  description: "Browse our entire inventory of legendary RC cars, crawlers, and street bashers. Filter by brand, scale, terrain, and price. India's top RC destination.",
};

const ShopView = dynamic(() => import('../../components/ShopView'), { ssr: false });

export default function ShopViewPage() {
  return <ShopView />;
}
