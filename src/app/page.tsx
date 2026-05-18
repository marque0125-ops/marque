"use client";

import React from "react";
import { useMarqueStore } from "../store/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeView from "../components/HomeView";
import ShopView from "../components/ShopView";
import PdpView from "../components/PdpView";
import CartView from "../components/CartView";
import AccountView from "../components/AccountView";
import AdminView from "../components/AdminView";

export default function Home() {
  const { currentView } = useMarqueStore();

  const renderActiveView = () => {
    switch (currentView) {
      case 'shop':
        return <ShopView />;
      case 'pdp':
        return <PdpView />;
      case 'cart':
        return <CartView />;
      case 'account':
        return <AccountView />;
      case 'admin':
        return <AdminView />;
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
    </div>
  );
}
