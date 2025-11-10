"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Star, Search } from "lucide-react"

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

export default function ParfumsPage() {
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [filteredParfums, setFilteredParfums] = useState<Parfum[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parfumsRes, brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/parfums"),
          fetch("/api/brands"),
          fetch("/api/categories"),
        ])

        const parfumsData = await parfumsRes.json()
        const brandsData = await brandsRes.json()
        const categoriesData = await categoriesRes.json()

        setParfums(parfumsData.data || [])
        setFilteredParfums(parfumsData.data || [])
        setBrands(brandsData.data || [])
        setCategories(categoriesData.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = parfums

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand.name === selectedBrand)
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category.name === selectedCategory)
    }

    setFilteredParfums(filtered)
  }, [searchTerm, selectedBrand, selectedCategory, parfums])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary/5">
        <div className="container-luxury">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Koleksi Lengkap Parfum</h1>
          <p className="text-muted-foreground max-w-2xl">
            Jelajahi lebih dari 500 pilihan wangi premium dari brand internasional terkemuka.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-b border-border sticky top-16 bg-card z-40">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Cari parfum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Reset */}
            {(searchTerm || selectedBrand || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedBrand("")
                  setSelectedCategory("")
                }}
                className="px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Menampilkan {filteredParfums.length} dari {parfums.length} parfum
          </p>
        </div>
      </section>

      {/* Parfums Grid */}
      <section className="py-12 md:py-16">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-luxury h-80 animate-pulse bg-muted" />
              ))}
            </div>
          ) : filteredParfums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredParfums.map((parfum) => (
                <Link key={parfum.id} href={`/parfums/${parfum.slug}`}>
                  <div className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-shadow">
                    {/* Image */}
                    <div className="relative w-full h-52 bg-muted overflow-hidden rounded-lg mb-3">
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
                      <button className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition">
                        <Heart size={18} className="text-destructive" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{parfum.brand.name}</p>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition line-clamp-2">
                        {parfum.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{parfum.category.name}</p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{parfum.launchYear}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">Parfum tidak ditemukan</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedBrand("")
                  setSelectedCategory("")
                }}
                className="btn-luxury"
              >
                Lihat Semua Parfum
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
