import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { FeaturedPerfumes } from "@/components/featured-perfumes"
import { CategoryShowcase } from "@/components/category-showcase"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parfum Premium - Koleksi Wangi Terbaik Indonesia",
  description:
    "Temukan wangi favorit Anda dari koleksi parfum premium. Brand internasional, harga kompetitif, kualitas terjamin.",
  openGraph: {
    title: "Parfum Premium - Koleksi Wangi Terbaik",
    description: "Jelajahi koleksi parfum premium dari brand terkemuka dunia",
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
      <Footer />
    </main>
  )
}
