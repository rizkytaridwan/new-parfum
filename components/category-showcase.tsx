"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  if (categories.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-secondary/5">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Jenis-jenis Aroma</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan kategori aroma yang sesuai dengan kepribadian dan gaya Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-lg h-48 cursor-pointer"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                <div className="mb-3 text-4xl">✨</div>
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition">
                  {category.description || "Koleksi eksklusif"}
                </p>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
