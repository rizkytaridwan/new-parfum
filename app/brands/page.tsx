// app/brands/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // <-- Tambahkan import ini
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { Building } from "lucide-react"

interface Brand {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string // <-- Tambahkan properti ini
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
      {/* ... (bagian header tetap) ... */}

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
                  href={`/brands/${brand.slug}`} 
                  className="group"
                >
                  <div className="card-luxury p-6 h-full flex flex-col justify-between hover:border-primary">
                    <div>
                      {/* START: Ganti Ikon dengan Gambar */}
                      {brand.imageUrl ? (
                        <div className="relative size-12 mb-4 rounded-full overflow-hidden border border-border bg-white flex items-center justify-center p-1">
                          <Image
                            src={brand.imageUrl}
                            alt={`${brand.name} Logo`}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <Building className="w-8 h-8 text-primary mb-4" /> // Fallback jika tidak ada gambar
                      )}
                      {/* END: Ganti Ikon dengan Gambar */}

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