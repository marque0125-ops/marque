"use client";

import dynamic from 'next/dynamic';
const CartView = dynamic(() => import('../../components/CartView'), { ssr: false });;

export default function CartViewPage() {
  return <CartView />;
}
