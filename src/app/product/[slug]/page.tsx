"use client";

import dynamic from 'next/dynamic';

const ProductPageClient = dynamic(() => import('../../../components/ProductPageClient'), { ssr: false });

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductPageClient slug={params.slug} />;
}
