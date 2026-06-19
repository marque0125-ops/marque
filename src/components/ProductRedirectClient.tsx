"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../store/useProductStore";

export default function ProductRedirectClient({ id }: { id: string }) {
  const router = useRouter();
  const { products } = useProductStore();

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      router.replace(`/product/${product.slug}`);
    } else {
      router.replace("/shop");
    }
  }, [id, products, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
        <p className="text-sm text-slate-400 animate-pulse">Locating rig...</p>
      </div>
    </div>
  );
}
