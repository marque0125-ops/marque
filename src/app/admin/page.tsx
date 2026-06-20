"use client";

import dynamic from 'next/dynamic';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminView = dynamic(() => import('../../components/AdminView'));

export default function AdminViewPage() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin />;
  }

  return <AdminView />;
}
