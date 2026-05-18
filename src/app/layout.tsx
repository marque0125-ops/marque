import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARQUE | Premium RC Cars India • Traxxas, Arrma, FMS, Rlaarlo",
  description: "Authorized e-commerce portal for high-performance remote control cars in India. Professional support, verified 18% HSN 9503 GST invoices, and live order tracking systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
