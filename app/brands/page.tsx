// app/brands/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { Building } from "lucide-react"

// Import Skeleton untuk tampilan loading yang lebih baik
import { Skeleton } from "@/components/ui/skeleton"

interface Brand {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string
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

      {/* --- START: HEADER BARU --- */}
      <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
        <div className="container-luxury">
          {loading ? (
            // Skeleton Loading untuk Header
            <>
              <Skeleton className="w-1/3 h-10 mb-4" />
              <Skeleton className="w-2/3 h-6" />
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Jelajahi Brand Parfum
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Temukan dan lihat semua koleksi dari brand-brand premium
                yang terdaftar di Ensiklopedia Parfum.
              </p>
            </>
          )}
        </div>
      </section>
      {/* --- END: HEADER BARU --- */}

      {/* Grid Brand */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Menggunakan Skeleton dari komponen yang tersedia */}
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="card-luxury p-6 h-40 animate-pulse bg-muted"
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