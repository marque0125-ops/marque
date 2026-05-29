"use client";

import React, { useEffect } from 'react';
import PdpView from './PdpView';
import { useProductStore } from '../store/useProductStore';
import { useUIStore } from '../store/useUIStore';

export default function ProductPageClient({ slug }: { slug: string }) {
  const { products } = useProductStore();
  const { setSelectedProduct, selectedProduct } = useUIStore();

  useEffect(() => {
    if (!selectedProduct || selectedProduct.slug !== slug) {
      const product = products.find(p => p.slug === slug);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [slug, products, selectedProduct, setSelectedProduct]);

  if (!selectedProduct) {
    return <div className="py-20 text-center text-white">Loading product...</div>;
  }

  return <PdpView />;
}
