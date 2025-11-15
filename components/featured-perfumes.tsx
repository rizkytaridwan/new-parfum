"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"

interface Parfum {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  launchYear: number
  brand: { name: string }
  category: { name: string }
}

export function FeaturedPerfumes() {
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParfums = async () => {
      try {
        const response = await fetch("/api/parfums?limit=6")
        const data = await response.json()
        setParfums(data.data || [])
      } catch (error) {
        console.error("Error fetching parfums:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParfums()
  }, [])

  return (
    <section className="py-20 md:py-32">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Koleksi Unggulan</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Parfum pilihan terbaik dengan rating tertinggi dan paling diminati pelanggan
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-luxury h-96 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          // Tambahkan grid-cols-1 untuk mobile
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {parfums.map((parfum) => (
              <Link key={parfum.id} href={`/parfums/${parfum.slug}`}>
                <div className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col p-4"> {/* Tambahkan p-4 di sini */}
                  {/* Image Container */}
                  <div className="relative w-full h-64 bg-muted overflow-hidden rounded-lg mb-4">
                    {parfum.imageUrl ? (
                      <Image
                        src={parfum.imageUrl || "/placeholder.svg"}
                        alt={parfum.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="text-4xl mb-2">💐</div>
                          <p>No Image</p>
                        </div>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition">
                      <Heart size={20} className="text-destructive" />
                    </button>
                  </div>

                  {/* Content (DIOPTIMALKAN STRUKTUR KARTU) */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        {parfum.brand.name}
                    </p>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition line-clamp-2 my-1">
                        {parfum.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {parfum.category.name}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                    <span className="text-xs font-medium text-muted-foreground">{parfum.launchYear}</span>
                    <span className="text-xs font-semibold text-primary">{parfum.category.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/parfums" className="btn-luxury">
            Lihat Semua Koleksi
          </Link>
        </div>
      </div>
    </section>
  )
}