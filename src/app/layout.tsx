import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import FooterWrapper from "@/components/FooterWrapper";

export const metadata: Metadata = {
  title: "The Bagdi's",
  description: "Your trusted destination for quality products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased flex flex-col min-h-screen">
        <AppProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <FooterWrapper />
            <Toaster />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
