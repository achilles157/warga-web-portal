import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Warga Daily",
    default: "Warga Daily"
  },
  description: "Jurnalisme Warga & Integrasi SuperApp. Platform berita terkini dan investigasi mendalam.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://wargadaily.com/",
    siteName: "Warga Daily"
  },
  icons: {
    icon: "/images/new_logo.png",
    apple: "/images/new_logo.png",
  },
};

import { AuthProvider } from "@/components/auth/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={clsx(
          playfair.variable,
          inter.variable,
          "antialiased bg-paper text-ink min-h-screen flex flex-col"
        )}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
