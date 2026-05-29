"use client";

import dynamic from 'next/dynamic';
const TermsView = dynamic(() => import('../../components/TermsView'), { ssr: false });;

export default function TermsViewPage() {
  return <TermsView />;
}
