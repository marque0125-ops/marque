import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARQUE | Premium RC Cars India • Traxxas, Arrma, FMS, Rlaarlo",
  description: "Authorized e-commerce portal for high-performance remote control cars in India. Professional support, verified 18% HSN 9503 GST invoices, and live order tracking systems.",
  keywords: ["RC Cars India", "Traxxas India", "Arrma RC", "FMS models", "Rlaarlo RC", "Remote Control Cars", "Hobby Grade RC"],
  authors: [{ name: "MARQUE Technical Garage" }],
  openGraph: {
    title: "MARQUE | Premium RC Cars India",
    description: "Authorized e-commerce portal for high-performance remote control cars in India.",
    url: "https://marque.co.in",
    siteName: "MARQUE",
    images: [
      {
        url: "https://marque.co.in/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARQUE | Premium RC Cars India",
    description: "Authorized e-commerce portal for high-performance remote control cars in India.",
    images: ["https://marque.co.in/logo.png"],
  },
};

import dynamic from 'next/dynamic';

import { Toaster } from 'react-hot-toast';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });
const GlobalDialog = dynamic(() => import('../components/GlobalDialog').then(mod => mod.GlobalDialog), { ssr: false });
const ClientProviders = dynamic(() => import('../components/ClientProviders'), { ssr: false });
const WhatsAppButton = dynamic(() => import('../components/WhatsAppButton'), { ssr: false });
const AnalyticsProvider = dynamic(() => import('../components/AnalyticsProvider'), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <AnalyticsProvider />
        <div className="flex flex-col min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-brand-orange selection:text-black">
          {/* Dynamic Global Navigation Header */}
          <Header />

          {/* Main Viewport Container */}
          <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
            <ClientProviders>{children}</ClientProviders>
          </main>

          {/* Corporate Declarations Footer */}
          <Footer />

          {/* Global Modals */}
          <GlobalDialog />
          
          {/* Floating WhatsApp Button */}
          <WhatsAppButton />

          {/* Global Toast Notifications */}
          <Toaster 
            position="bottom-right" 
            toastOptions={{ 
              style: { background: '#020617', color: '#fff', border: '1px solid #334155' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } }
            }} 
          />
        </div>
      </body>
    </html>
  );
}
