"use client";

import dynamic from 'next/dynamic';
const AdminView = dynamic(() => import('../../components/AdminView'));

export default function AdminViewPage() {
  return <AdminView />;
}
