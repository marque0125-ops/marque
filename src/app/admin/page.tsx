"use client";

import dynamic from 'next/dynamic';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { useEffect, useState } from 'react';

const AdminView = dynamic(() => import('../../components/AdminView'));

export default function AdminViewPage() {
  const { isAuthenticated, userEmail } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const isAdmin = isAuthenticated && userEmail === "2002dineshmurugan@gmail.com";

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminView />;
}
