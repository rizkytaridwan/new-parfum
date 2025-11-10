"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Share2, Star, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Parfum {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  launchYear: number
  brandId: string
  categoryId: string
  brand: { id: string; name: string }
  category: { id: string; name: string }
}

interface Note {
  id: string
  name: string
  type: "TOP" | "MIDDLE" | "BASE"
}

export default function ParfumDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [parfum, setParfum] = useState<Parfum | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParfum = async () => {
      try {
        const response = await fetch(`/api/parfums/${slug}`)
        if (!response.ok) throw new Error("Parfum not found")
        const data = await response.json()
        setParfum(data.data)
        if (data.data?.notes) {
          setNotes(data.data.notes)
        }
      } catch (err) {
        setError("Parfum tidak ditemukan")
      } finally {
        setLoading(false)
      }
    }

    fetchParfum()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container-luxury py-16 text-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !parfum) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container-luxury py-16 text-center">
          <p className="text-lg text-destructive mb-4">{error}</p>
          <Link href="/parfums" className="btn-luxury">
            Kembali ke Koleksi
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const topNotes = notes.filter((n) => n.type === "TOP")
  const middleNotes = notes.filter((n) => n.type === "MIDDLE")
  const baseNotes = notes.filter((n) => n.type === "BASE")

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="container-luxury py-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <ChevronRight size={16} />
          <Link href="/parfums" className="hover:text-primary">
            Koleksi
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{parfum.name}</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="flex flex-col">
              <div className="relative w-full h-96 md:h-[500px] bg-muted rounded-xl overflow-hidden mb-4">
                {parfum.imageUrl ? (
                  <Image
                    src={parfum.imageUrl || "/placeholder.svg"}
                    alt={parfum.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💐</div>
                      <p>No Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 btn-luxury">
                  <Heart size={20} className="mr-2" />
                  Tambah ke Favorit
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary px-6 py-3 font-semibold transition-all hover:bg-primary hover:text-primary-foreground">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div>
              {/* Brand & Category */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {parfum.brand.name}
                </span>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {parfum.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{parfum.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className="fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(247 ulasan)</span>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {parfum.description || "Parfum eksklusif dengan aroma yang menawan dan bertahan lama."}
              </p>

              {/* Info */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tahun Peluncuran</p>
                  <p className="text-2xl font-semibold">{parfum.launchYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ketersediaan</p>
                  <p className="text-2xl font-semibold text-green-600">Tersedia</p>
                </div>
              </div>

              {/* Notes */}
              {(topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold mb-6">Komposisi Aroma</h3>

                  {topNotes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-primary mb-3 uppercase">Catatan Atas</p>
                      <div className="flex flex-wrap gap-2">
                        {topNotes.map((note) => (
                          <span key={note.id} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {middleNotes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-accent mb-3 uppercase">Catatan Tengah</p>
                      <div className="flex flex-wrap gap-2">
                        {middleNotes.map((note) => (
                          <span key={note.id} className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm">
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {baseNotes.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Catatan Dasar</p>
                      <div className="flex flex-wrap gap-2">
                        {baseNotes.map((note) => (
                          <span key={note.id} className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button className="w-full btn-luxury text-lg py-4">Lihat Harga & Beli</button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-secondary/5">
        <div className="container-luxury">
          <h2 className="text-3xl font-serif font-bold mb-8">Parfum Sejenis</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-luxury">
                <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Brand</p>
                <h4 className="font-semibold">Parfum Lainnya</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
