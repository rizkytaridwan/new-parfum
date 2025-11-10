import type React from "react";
import type { Metadata, Viewport } from "next";
import { PT_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


// PT Serif hanya 400 & 700
const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Parfum Premium - Koleksi Wangi Terbaik Indonesia",
  description:
    "Jelajahi koleksi parfum premium dari brand internasional terkemuka. Dapatkan wangi eksklusif dengan harga kompetitif dan kualitas terjamin.",
  keywords:
    "parfum, wangi, brand internasional, parfum pria, parfum wanita, koleksi wangi",
  applicationName: "Parfum Store",
  authors: [{ name: "Parfum Premium" }],
  creator: "Parfum Premium",
  publisher: "Parfum Premium",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yoursite.com",
    siteName: "Parfum Premium",
    title: "Parfum Premium - Koleksi Wangi Terbaik",
    description: "Jelajahi koleksi parfum premium dengan berbagai pilihan aroma.",
    images: [{ url: "https://yoursite.com/og-image.png", width: 1200, height: 630, alt: "Parfum Premium" }],
  },
  twitter: { card: "summary_large_image", title: "Parfum Premium", description: "Koleksi wangi terbaik" },
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
  generator: "v0.app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://yoursite.com" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" hrefLang="id" href="https://yoursite.com" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="google-adsense-account" content="ca-pub-YOUR_ADSENSE_ID" />
      </head>
      {/* Pakai GeistSans untuk body; PT Serif bisa dipakai untuk heading/elemen tertentu */}
      <body className={`${GeistSans.className} ${ptSerif.className} bg-background text-foreground antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
