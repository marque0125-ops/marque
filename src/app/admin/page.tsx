"use client";

import dynamic from 'next/dynamic';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

const AdminView = dynamic(() => import('../../components/AdminView'));

export default function AdminViewPage() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Automatically re-verify admin status if logged in but local store says false
    if (isAuthenticated && !isAdmin) {
      setIsVerifying(true);
      const verifyAdmin = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("id", user.id)
              .maybeSingle();
              
            if (profile?.is_admin) {
              useAuthStore.setState({ isAdmin: true });
            }
          }
        } catch (err) {
          console.error("Failed to verify admin status", err);
        } finally {
          setIsVerifying(false);
        }
      };
      verifyAdmin();
    }
  }, [isAuthenticated, isAdmin]);

  if (!mounted || isVerifying) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-brand-orange">Verifying clearance...</div>;

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin />;
  }

  return <AdminView />;
}
