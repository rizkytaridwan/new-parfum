"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Star, ChevronRight } from "lucide-react"

// Definisikan tipe datanya
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

interface Brand {
  id: string
  name: string
  slug: string
  description: string
}

export default function BrandDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [brand, setBrand] = useState<Brand | null>(null)
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/brands/${slug}`)
        if (!response.ok) {
          throw new Error("Brand tidak ditemukan")
        }
        const data = await response.json()
        if (data.success) {
          setBrand(data.data.brand)
          setParfums(data.data.parfums)
          
          // Set judul halaman secara dinamis untuk SEO
          document.title = `Referensi Parfum ${data.data.brand.name} | Ensiklopedia Parfum`
        } else {
          throw new Error(data.error || "Gagal mengambil data")
        }
      } catch (err: any) {
        setError(err.message)
        document.title = "Brand Tidak Ditemukan | Ensiklopedia Parfum"
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="container-luxury py-4 text-sm border-b border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <ChevronRight size={16} />
          <Link href="/brands" className="hover:text-primary">
            Brand
          </Link>
          <ChevronRight size={16} />
          {loading ? (
            <span className="w-24 h-4 bg-muted animate-pulse rounded-md" />
          ) : (
            <span className="text-foreground">{brand?.name}</span>
          )}
        </div>
      </div>

      {/* Header Halaman Brand */}
      {loading ? (
        <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
          <div className="container-luxury">
            <div className="w-1/3 h-12 bg-muted animate-pulse rounded-md mb-4" />
            <div className="w-2/3 h-6 bg-muted animate-pulse rounded-md" />
          </div>
        </section>
      ) : brand ? (
        <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
          <div className="container-luxury">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {brand.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {brand.description ||
                `Jelajahi semua referensi parfum dari ${brand.name}.`}
            </p>
          </div>
        </section>
      ) : null}

      {/* Daftar Parfum */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-luxury p-4 h-80 animate-pulse bg-muted" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-lg text-destructive mb-4">{error}</p>
              <Link href="/brands" className="btn-luxury">
                Kembali ke Daftar Brand
              </Link>
            </div>
          ) : parfums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {parfums.map((parfum) => (
                <Link key={parfum.id} href={`/parfums/${parfum.slug}`}>
                  <div className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-shadow p-4">
                    <div className="relative w-full h-52 bg-muted overflow-hidden rounded-lg mb-4">
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
                            <div className="text-3xl mb-1">💐</div>
                            <p className="text-xs">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">{parfum.brand.name}</p>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition line-clamp-2 my-1">
                        {parfum.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{parfum.category.name}</p>
                    </div>
                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <div className="flex gap-0.5 items-center">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground ml-1">(Ulasan)</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{parfum.launchYear}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Belum ada referensi parfum untuk brand ini.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}