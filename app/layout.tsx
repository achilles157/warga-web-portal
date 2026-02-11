import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google"; // Use new fonts
import "./globals.css";
import { clsx } from "clsx";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Gen Z loves bold/heavy weights
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://wargadaily.com"),
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
          poppins.variable, // Headers
          jakarta.variable, // Body
          "antialiased bg-paper text-ink min-h-screen flex flex-col font-sans" // Default to sans (Jakarta)
        )}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
