"use client";

import dynamic from 'next/dynamic';
const RacingView = dynamic(() => import('../../components/RacingView'), { ssr: false });

export default function RacingPage() {
  return <RacingView />;
}
