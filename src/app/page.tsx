"use client";

import React, { useEffect } from "react";
import { useUIStore } from "../store/useUIStore";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeView from "../components/HomeView";
import ShopView from "../components/ShopView";
import PdpView from "../components/PdpView";
import CartView from "../components/CartView";
import AccountView from "../components/AccountView";
import AdminView from "../components/AdminView";
import { AdminLogin } from "../components/admin/AdminLogin";
import AccessoriesView from "../components/AccessoriesView";
import TermsView from "../components/TermsView";
import ShippingView from "../components/ShippingView";
import { GlobalDialog } from "../components/GlobalDialog";

export default function Home() {
  const { currentView } = useUIStore();
  const { fetchProducts } = useProductStore();
  const { isAuthenticated, userEmail } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderActiveView = () => {
    const isAdmin = isAuthenticated && userEmail === "2002dineshmurugan@gmail.com";

    switch (currentView) {
      case 'shop':
        return <ShopView />;
      case 'accessories':
        return <AccessoriesView />;
      case 'pdp':
        return <PdpView />;
      case 'cart':
        return <CartView />;
      case 'account':
        return <AccountView />;
      case 'admin':
        return isAdmin ? <AdminView /> : <AdminLogin />;
      case 'terms':
        return <TermsView />;
      case 'shipping':
        return <ShippingView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-brand-orange selection:text-black">
      {/* Dynamic Global Navigation Header */}
      <Header />

      {/* Main Viewport Container */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {renderActiveView()}
      </main>

      {/* Corporate Declarations Footer */}
      <Footer />

      {/* Global Modals */}
      <GlobalDialog />
    </div>
  );
}
