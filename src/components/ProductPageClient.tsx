"use client";

import React, { useEffect, useState } from 'react';
import PdpView from './PdpView';
import { useProductStore, normalizeProduct } from '../store/useProductStore';
import { useUIStore } from '../store/useUIStore';
import { supabase } from '../utils/supabase';

export default function ProductPageClient({ slug }: { slug: string }) {
  const { products } = useProductStore();
  const { setSelectedProduct, selectedProduct } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!selectedProduct || selectedProduct.slug !== slug) {
        const product = products.find(p => p.slug === slug);
        if (product) {
          setSelectedProduct(product);
          setLoading(false);
        } else {
          try {
            const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
            if (data) {
              const normalized = normalizeProduct(data);
              setSelectedProduct(normalized);
              setLoading(false);
            } else {
              setNotFound(true);
              setLoading(false);
            }
          } catch (e) {
            setNotFound(true);
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [slug, products, selectedProduct, setSelectedProduct]);

  if (loading) {
    return (
      <div className="py-20 text-center text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        <div className="uppercase tracking-widest text-sm text-brand-orange">Loading Garage Data...</div>
      </div>
    );
  }

  if (notFound || !selectedProduct) {
    return <div className="py-20 text-center text-white font-display text-xl uppercase">Vehicle Not Found</div>;
  }

  return <PdpView />;
}
