"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { Building } from "lucide-react"

// Kita tidak bisa ekspor metadata dinamis dari client component
// Tapi kita akan buatkan placeholder, Anda bisa memindahkannya ke server component nanti
/*
export const metadata: Metadata = {
  title: "Daftar Brand Parfum | Ensiklopedia Parfum",
  description: "Jelajahi semua brand parfum ternama dari A-Z. Temukan referensi dari Dior, Chanel, Tom Ford, dan lainnya.",
};
*/

interface Brand {
  id: string
  name: string
  slug: string
  description: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands")
        const data = await response.json()
        setBrands(data.data || [])
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
        <div className="container-luxury">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Daftar Brand Parfum
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Jelajahi semua brand yang ada di database kami.
          </p>
        </div>
      </section>

      {/* Grid Brand */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`} // Nanti ini akan jadi halaman dinamis per brand
                  className="group"
                >
                  <div className="card-luxury p-6 h-full flex flex-col justify-between hover:border-primary">
                    <div>
                      <Building className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {brand.description ||
                        `Lihat semua referensi dari ${brand.name}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}