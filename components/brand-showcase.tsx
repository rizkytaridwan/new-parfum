"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building } from "lucide-react"

interface Brand {
  id: string
  name: string
  slug: string
  description: string
}

export function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands")
        const data = await response.json()
        // Ambil 4 brand pertama untuk tampilan showcase yang rapi
        setBrands((data.data || []).slice(0, 4)) 
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    fetchBrands()
  }, [])

  if (brands.length === 0) return null

  return (
    <section className="py-20 md:py-32">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Brand Pilihan</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Jelajahi referensi parfum dari brand-brand ternama yang kami rekomendasikan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative overflow-hidden rounded-lg h-48 cursor-pointer"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-secondary/20 group-hover:bg-secondary/30 transition" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                <Building className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition line-clamp-2">
                  {brand.description || `Lihat semua koleksi dari ${brand.name}`}
                </p>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </Link>
          ))}
        </div>
        
        {/* Tombol Lihat Semua Brand */}
        <div className="text-center mt-12">
            <Link href="/brands" className="btn-luxury">
                Lihat Semua Brand
            </Link>
        </div>
      </div>
    </section>
  )
}