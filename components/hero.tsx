"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Stats {
  totalParfums: string
  totalBrands: string
  totalReviews: string // Keeping it as a string for "10K+"
}

export function Hero() {
  const [stats, setStats] = useState<Stats>({
    totalParfums: "...",
    totalBrands: "...",
    totalReviews: "10K+",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mengambil data dari endpoint /api/stats (asumsi sudah dibuat di langkah sebelumnya)
        const response = await fetch("/api/stats") 
        const data = await response.json()
        if (data.success) {
          // Format angka dengan separator ribuan dan tambahkan "+"
          setStats({
            totalParfums: new Intl.NumberFormat('id-ID').format(data.data.totalParfums) + "+",
            totalBrands: new Intl.NumberFormat('id-ID').format(data.data.totalBrands) + "+",
            totalReviews: "10K+", 
          })
        } else {
             throw new Error("Failed to fetch stats")
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback jika fetch gagal
        setStats({
          totalParfums: "500+",
          totalBrands: "50+",
          totalReviews: "10K+",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statClass = "text-3xl md:text-4xl font-bold text-primary"

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 -z-10" />

      <div className="container-luxury text-center">
        <h1 className="text-gradient font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Ensiklopedia Parfum <br />
          <span className="text-primary">Terlengkap Anda</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Jelajahi ribuan referensi parfum, temukan komposisi aroma (notes), dan baca ulasan untuk menemukan wangi yang tepat untuk Anda.
        </p>

        {/* --- SEMUA BUTTON MENGGUNAKAN STYLE PRIMARY (.btn-luxury) --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/parfums" className="btn-luxury">
            Jelajahi Referensi
          </Link>
          
          <Link 
            href="/categories" 
            className="btn-luxury" // DIUBAH
          >
            Lihat Kategori Aroma
          </Link>
          
          <Link 
            href="/brands" 
            className="btn-luxury" // DIUBAH
          >
            Lihat Brand
          </Link>
        </div>

        {/* --- STATS (DYNAMICALLY FETCHED) --- */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div>
            <div className={statClass}>
              {loading ? "..." : stats.totalParfums}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Referensi Parfum</p>
          </div>
          <div>
            <div className={statClass}>
              {loading ? "..." : stats.totalBrands}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Brand Ternama</p>
          </div>
          <div>
            <div className={statClass}>
              {stats.totalReviews}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Ulasan Pembaca</p>
          </div>
        </div>
      </div>
    </section>
  )
}