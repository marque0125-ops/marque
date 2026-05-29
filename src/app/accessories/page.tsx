"use client";

import dynamic from 'next/dynamic';
const AccessoriesView = dynamic(() => import('../../components/AccessoriesView'), { ssr: false });;

export default function AccessoriesViewPage() {
  return <AccessoriesView />;
}
