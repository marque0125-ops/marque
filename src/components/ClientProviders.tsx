"use client";

import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return <>{children}</>;
}
