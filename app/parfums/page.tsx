"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Heart,
  Star,
  Search,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react"

// (BARU) Impor komponen untuk Combobox
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// --- Interface Data (Tidak Berubah) ---
interface Parfum {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  launchYear: number
  brand: { name: string; slug: string }
  category: { name: string; slug: string }
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ParfumsPage() {
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [loading, setLoading] = useState(true)
  const [totalParfums, setTotalParfums] = useState(0)

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("")
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")

  // State untuk mengisi dropdown filter
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // (BARU) State untuk membuka/menutup Popover Combobox
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false)
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)

  // useEffect untuk mengambil data filter (Brands & Categories)
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ])
        const brandsData = await brandsRes.json()
        const categoriesData = await categoriesRes.json()
        setBrands(brandsData.data || [])
        setCategories(categoriesData.data || [])
      } catch (error) {
        console.error("Error fetching filter data:", error)
      }
    }
    fetchFilterData()
  }, [])

  // useEffect untuk mengambil data parfum berdasarkan filter
  useEffect(() => {
    const fetchParfums = async () => {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) params.set("search", searchTerm)
      if (selectedBrandSlug) params.set("brandSlug", selectedBrandSlug)
      if (selectedCategorySlug) params.set("categorySlug", selectedCategorySlug)
      if (selectedAudience) params.set("audience", selectedAudience)

      try {
        const response = await fetch(`/api/parfums?${params.toString()}`)
        const data = await response.json()
        setParfums(data.data || [])
        setTotalParfums(data.total || 0)
      } catch (error) {
        console.error("Error fetching parfums:", error)
      } finally {
        setLoading(false)
      }
    }

    // Tambahkan debounce kecil agar tidak memanggil API terlalu sering saat mengetik
    const timer = setTimeout(() => {
      fetchParfums()
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, selectedBrandSlug, selectedCategorySlug, selectedAudience])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedBrandSlug("")
    setSelectedCategorySlug("")
    setSelectedAudience("")
  }

  const isFiltered =
    searchTerm ||
    selectedBrandSlug ||
    selectedCategorySlug ||
    selectedAudience

  // (BARU) Helper untuk mendapatkan nama brand/kategori yang dipilih
  const selectedBrandName =
    brands.find((b) => b.slug === selectedBrandSlug)?.name || "Pilih Brand..."
  const selectedCategoryName =
    categories.find((c) => c.slug === selectedCategorySlug)?.name ||
    "Pilih Kategori..."

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary/5">
        <div className="container-luxury">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Koleksi Lengkap Parfum
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Jelajahi pilihan wangi premium dari brand internasional terkemuka.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-b border-border sticky top-16 bg-card z-40">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari parfum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* (BARU) Brand Combobox */}
            <Popover open={brandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={brandPopoverOpen}
                  className="w-full justify-between bg-input hover:bg-muted"
                >
                  <span className="truncate">
                    {selectedBrandName}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Cari brand..." />
                  <CommandList>
                    <CommandEmpty>Brand tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedBrandSlug("")
                          setBrandPopoverOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBrandSlug === "" ? "opacity-100" : "opacity-0",
                          )}
                        />
                        Semua Brand
                      </CommandItem>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand.id}
                          value={brand.name}
                          onSelect={() => {
                            setSelectedBrandSlug(brand.slug)
                            setBrandPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBrandSlug === brand.slug
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {brand.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* (BARU) Category Combobox */}
            <Popover
              open={categoryPopoverOpen}
              onOpenChange={setCategoryPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryPopoverOpen}
                  className="w-full justify-between bg-input hover:bg-muted"
                >
                  <span className="truncate">
                    {selectedCategoryName}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Cari kategori..." />
                  <CommandList>
                    <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedCategorySlug("")
                          setCategoryPopoverOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategorySlug === ""
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Semua Kategori
                      </CommandItem>
                      {categories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={() => {
                            setSelectedCategorySlug(cat.slug)
                            setCategoryPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategorySlug === cat.slug
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Audience Filter (Tetap <select> karena opsinya sedikit) */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Audience</option>
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Tampilan info filter */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Mencari..."
                : `Menampilkan ${parfums.length} dari ${totalParfums} parfum`}
            </p>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition"
              >
                <X size={14} />
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Parfums Grid */}
      <section className="py-12 md:py-16">
        <div className="container-luxury">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card-luxury p-4 h-80 animate-pulse bg-muted"
                />
              ))}
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
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition opacity-0 group-hover:opacity-100">
                        <Heart size={16} className="text-destructive" />
                      </button>
                    </div>

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

                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <div className="flex gap-0.5 items-center">
                        <Star
                          size={14}
                          className="fill-primary text-primary"
                        />
                        <span className="text-xs text-muted-foreground ml-1">
                          (Ulasan)
                        </span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {parfum.launchYear}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Parfum tidak ditemukan
              </p>
              <button onClick={resetFilters} className="btn-luxury">
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}