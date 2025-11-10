import type React from "react"
import type { Metadata, Viewport } from "next"
import { PT_Serif } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"] })

// MODIFIKASI METADATA UNTUK SEO
export const metadata: Metadata = {
  title: {
    default: "Ensiklopedia Parfum - Referensi & Ulasan Wangi Terlengkap",
    template: "%s - Ensiklopedia Parfum",
  },
  description:
    "Cari referensi parfum original terlengkap. Baca ulasan, temukan komposisi aroma (notes), dan jelajahi ribuan parfum pria dan wanita dari brand terbaik.",
  keywords:
    "referensi parfum, ulasan parfum, ensiklopedia parfum, notes parfum, aroma parfum, parfum pria, parfum wanita, database parfum, review parfum",
  applicationName: "Ensiklopedia Parfum",
  authors: [{ name: "Parfum Ref" }], // Ganti dengan nama Anda
  creator: "Parfum Ref",
  publisher: "Parfum Ref",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yoursite.com", // GANTI DENGAN DOMAIN ANDA
    siteName: "Ensiklopedia Parfum",
    title: "Ensiklopedia Parfum - Referensi & Ulasan Wangi",
    description:
      "Database referensi parfum, ulasan, dan komposisi aroma terlengkap.",
    images: [
      {
        url: "https://yoursite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ensiklopedia Parfum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ensiklopedia Parfum",
    description: "Database referensi parfum terlengkap",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      {/* Komentar dipindahkan ke sini, di luar <head> untuk menghindari error hidrasi.
        - GANTI DENGAN DOMAIN ANDA
        - Google Site Verification & AdSense
      */}
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://yoursite.com" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" hrefLang="id" href="https://yoursite.com" />
        <meta
          name="google-site-verification"
          content="YOUR_GOOGLE_VERIFICATION_CODE"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-YOUR_ADSENSE_ID"
        />
      </head>
      <body
        className={`${GeistSans.className} ${ptSerif.className} bg-background text-foreground antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}