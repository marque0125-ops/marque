"use client";

import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return <>{children}</>;
}
