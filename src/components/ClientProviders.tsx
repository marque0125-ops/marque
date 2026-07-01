"use client";

import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { fetchProducts, fetchCategories, fetchGuides, fetchReviews } = useProductStore();
  const { loadAllSiteConfig } = useUIStore();

  useEffect(() => {
    // Load all data from Supabase on every page load.
    // This ensures admin-managed content (videos, banners, products, etc.)
    // is always fresh from the cloud — never lost due to browser storage issues.
    fetchProducts();
    fetchCategories();
    fetchGuides();
    fetchReviews();
    loadAllSiteConfig();
  }, [fetchProducts, fetchCategories, fetchGuides, fetchReviews, loadAllSiteConfig]);

  return <>{children}</>;
}
