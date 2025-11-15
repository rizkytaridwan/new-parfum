import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { FeaturedPerfumes } from "@/components/featured-perfumes"
import { CategoryShowcase } from "@/components/category-showcase"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

// Import komponen baru
import { BrandShowcase } from "@/components/brand-showcase" //

// MODIFIKASI METADATA HOMEPAGE
export const metadata: Metadata = {
  title: "Ensiklopedia Parfum - Referensi & Ulasan Wangi Terlengkap",
  description:
    "Beranda Ensiklopedia Parfum. Cari referensi parfum original, baca ulasan, temukan komposisi aroma (notes), dan jelajahi ribuan parfum pria dan wanita.",
  openGraph: {
    title: "Ensiklopedia Parfum - Referensi & Ulasan Wangi",
    description: "Database referensi parfum, ulasan, dan komposisi aroma terlengkap.",
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedPerfumes />
      <CategoryShowcase />
      {/* Tambahkan BrandShowcase di sini */}
      <BrandShowcase /> 
      <Footer />
    </main>
  )
}