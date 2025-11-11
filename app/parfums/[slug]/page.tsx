// app/parfums/[slug]/page.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

import {
  Heart,
  Share2,
  Star,
  ChevronRight,
  Info,
  BookOpen,
  Clock,
  Users,
  ShoppingCart, // (BARU) Impor ikon keranjang
} from "lucide-react"
import Link from "next/link"

// (UPDATE) Interface Parfum
interface Parfum {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  launchYear: number
  audience: "Pria" | "Wanita" | "Unisex"
  shopeeUrl?: string | null // (BARU) Tambahkan shopeeUrl
  brandId: string
  categoryId: string
  brand: { id: string; name: string; slug: string }
  category: { id: string; name: string; slug: string }
}

// (BARU) Interface untuk Parfum Serupa (lebih simpel)
interface SimilarParfum {
  id: string
  name: string
  slug: string
  imageUrl: string
  launchYear: number
  brand: { name: string }
  category: { name: string }
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
  const [similarParfums, setSimilarParfums] = useState<SimilarParfum[]>([]) // (BARU) State untuk parfum serupa
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParfum = async () => {
      if (!slug) return // Pastikan slug ada
      
      try {
        setLoading(true) // Set loading di awal
        const response = await fetch(`/api/parfums/${slug}`)
        if (!response.ok) throw new Error("Parfum tidak ditemukan")
        
        const data = await response.json()
        if (data.success) {
          setParfum(data.data)
          setNotes(data.data.notes || [])
          setSimilarParfums(data.data.similarParfums || []) // (BARU) Set state parfum serupa
          
          // (SEO) Set judul halaman secara dinamis
          document.title = `${data.data.name} - ${data.data.brand.name} | Ensiklopedia Parfum`
        } else {
          throw new Error(data.error || "Gagal mengambil data")
        }
      } catch (err: any) {
        setError(err.message)
        document.title = "Parfum Tidak Ditemukan | Ensiklopedia Parfum"
      } finally {
        setLoading(false)
      }
    }

    fetchParfum()
  }, [slug])

  // ... (kode loading, error, dan notes tetap sama) ...
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
      <div className="container-luxury py-4 text-sm border-b border-border">
        {" "}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <ChevronRight size={16} />
          <Link href="/parfums" className="hover:text-primary">
            Referensi
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
              {/* ... (kode gambar tidak berubah) ... */}
              <div className="relative w-full h-96 md:h-[500px] bg-muted rounded-xl overflow-hidden mb-4 border border-border">
                {" "}
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
                      <p>Gambar tidak tersedia</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* (UPDATE) Tombol Aksi */}
              <div className="flex gap-3">
                <button className="flex-1 inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary px-6 py-3 font-semibold transition-all hover:bg-primary/5">
                  <Heart size={20} className="mr-2" />
                  Simpan
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-lg border-2 border-border text-muted-foreground px-6 py-3 font-semibold transition-all hover:bg-muted">
                  <Share2 size={20} className="mr-2" />
                  Bagikan
                </button>
              </div>
            </div>

            {/* Details */}
            <div>
              {/* Brand & Category */}
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href={`/brands/${parfum.brand.slug}`}
                  className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition"
                >
                  {parfum.brand.name}
                </Link>
                <Link
                  href={`/categories/${parfum.category.slug}`}
                  className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full hover:bg-border transition"
                >
                  {parfum.category.name}
                </Link>
              </div>
              
              {/* ... (Kode Judul, Rating, Deskripsi, Info Box tetap sama) ... */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                {parfum.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (Berdasarkan 247 ulasan)
                </span>
              </div>

              <div className="mb-8 p-4 bg-muted/50 border-l-4 border-primary rounded-r-lg">
                <h3 className="flex items-center text-lg font-serif font-semibold mb-2">
                  <Info size={18} className="mr-2 text-primary" />
                  Deskripsi Aroma
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {" "}
                  {parfum.description ||
                    "Parfum eksklusif dengan aroma yang menawan dan bertahan lama."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-start gap-3 bg-muted p-4 rounded-lg">
                  <Clock size={20} className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tahun Rilis</p>
                    <p className="text-lg font-semibold">
                      {parfum.launchYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-muted p-4 rounded-lg">
                  <BookOpen size={20} className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <p className="text-lg font-semibold">
                      {parfum.category.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-muted p-4 rounded-lg">
                  <Users size={20} className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Untuk</p>
                    <p className="text-lg font-semibold">{parfum.audience}</p>
                  </div>
                </div>
              </div>

              {/* ... (Kode Komposisi Aroma/Notes tetap sama) ... */}
              {(topNotes.length > 0 ||
                middleNotes.length > 0 ||
                baseNotes.length > 0) && (
                <div className="mb-8 border border-border p-6 rounded-lg">
                  <h3 className="text-2xl font-serif font-semibold mb-6 text-center">
                    Komposisi Aroma (Notes)
                  </h3>
                  {topNotes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                        Top Notes (Aroma Awal)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topNotes.map((note) => (
                          <span
                            key={note.id}
                            className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {middleNotes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                        Middle Notes (Aroma Tengah)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {middleNotes.map((note) => (
                          <span
                            key={note.id}
                            className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"
                          >
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {baseNotes.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Base Notes (Aroma Dasar)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {baseNotes.map((note) => (
                          <span
                            key={note.id}
                            className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium"
                          >
                            {note.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* (BARU) Tombol Afiliasi Shopee */}
              <div className="mt-8">
                {parfum.shopeeUrl ? (
                  <Link
                    href={parfum.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-luxury text-lg py-4 flex items-center justify-center bg-[#FF5722] hover:bg-[#E64A19] text-white"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Beli di Shopee
                  </Link>
                ) : (
                  <button
                    className="w-full btn-luxury text-lg py-4 opacity-50 cursor-not-allowed"
                    disabled
                    title="Link afiliasi belum tersedia"
                  >
                    Link belum tersedia
                  </button>
                )}
                <p className="text-xs text-muted-foreground text-center mt-3">
                  *Ini adalah link afiliasi. Kami mungkin mendapat komisi.
                </p>
              </div>

              {/* Slot Iklan AdSense */}
              <div className="mt-8 p-4 border border-dashed border-border rounded-lg text-center bg-muted h-64 flex items-center justify-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Slot Iklan AdSense (300x250 atau Responsif) <br />
                  Tempatkan kode AdSense Anda di sini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (BARU) Section Referensi Serupa yang Dinamis */}
      {similarParfums.length > 0 && (
        <section className="py-16 bg-secondary/5">
          <div className="container-luxury">
            <h2 className="text-3xl font-serif font-bold mb-8">
              Referensi Serupa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {similarParfums.map((p) => (
                <Link key={p.id} href={`/parfums/${p.slug}`}>
                  <div className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-shadow p-4">
                    <div className="relative w-full h-40 bg-muted overflow-hidden rounded-lg mb-4">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl || "/placeholder.svg"}
                          alt={p.name}
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
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">{p.brand.name}</p>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition line-clamp-2 my-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{p.category.name}</p>
                    </div>
                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{p.launchYear}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  )
}