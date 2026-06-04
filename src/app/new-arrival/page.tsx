"use client";

import dynamic from 'next/dynamic';
const NewArrivalView = dynamic(() => import('../../components/NewArrivalView'), { ssr: false });

export default function NewArrivalPage() {
  return <NewArrivalView />;
}
