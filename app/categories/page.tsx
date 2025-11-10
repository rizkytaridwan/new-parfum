"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { Sparkles } from "lucide-react" // Ganti ikon

// Placeholder metadata
/*
export const metadata: Metadata = {
  title: "Kategori Aroma Parfum | Ensiklopedia Parfum",
  description: "Pelajari berbagai kategori aroma parfum, dari Aromatic Fougere, Floral, Woody, hingga Oriental. Temukan wangi yang sesuai.",
};
*/

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
        <div className="container-luxury">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Kategori Aroma Parfum
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Temukan jenis wangi yang paling sesuai dengan kepribadian dan gaya
            Anda.
          </p>
        </div>
      </section>

      {/* Grid Kategori */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`} // Nanti ini akan jadi halaman dinamis per kategori
                  className="group"
                >
                  <div className="card-luxury p-6 h-full flex flex-col justify-between hover:border-primary">
                    <div>
                      <Sparkles className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {category.description ||
                        `Jelajahi wangi ${category.name}`}
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