// app/parfums/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Heart,
  Star,
  Search,
  X,
  Check,
  ChevronsUpDown,
  Loader2, // BARU: Import Loader2 untuk loading spinner
} from "lucide-react"

// Impor komponen UI
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

// Import Skeleton untuk loading state yang lebih baik
import { Skeleton } from "@/components/ui/skeleton"

// --- KONSTANTA PAGINATION ---
const ITEMS_PER_LOAD = 20 // Jumlah item yang dimuat per langkah
const MAX_DROPDOWN_ITEMS = 10; // Pembatasan tampilan dropdown

// --- Interface Data ---
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
  // State untuk data
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [loading, setLoading] = useState(true) // Loading awal / saat filter berubah
  const [loadingMore, setLoadingMore] = useState(false) // BARU: Loading saat klik "Muat Lebih Banyak"
  const [totalParfums, setTotalParfums] = useState(0)
  const [hasMore, setHasMore] = useState(true) // BARU: Indikator apakah masih ada data

  // State untuk dropdown
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // State untuk Popover
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false)
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)

  // Hook Next.js
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Baca filter dari URL
  const searchTerm = searchParams.get("search") || ""
  const selectedBrandSlug = searchParams.get("brandSlug") || ""
  const selectedCategorySlug = searchParams.get("categorySlug") || ""
  const selectedAudience = searchParams.get("audience") || ""
  
  // Ambil semua query params saat ini sebagai string (untuk dependency useCallback)
  const currentFilters = searchParams.toString();

  // Fungsi untuk memperbarui URL (tetap sama)
  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(pathname + "?" + params.toString())
    },
    [pathname, router, searchParams],
  )
  
  // Fungsi untuk menangani debounce input pencarian (tetap sama)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
     handleFilterChange("search", value)
  }

  // --- LOGIC FETCH DATA UTAMA (DIOPTIMALKAN) ---
  const fetchParfums = useCallback(
    async (currentSkip: number, isInitialLoad: boolean) => {
      if (isInitialLoad) {
        setLoading(true)
        setParfums([]) // Kosongkan array untuk load awal/filter baru
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams(currentFilters)
      params.set("limit", ITEMS_PER_LOAD.toString())
      params.set("skip", currentSkip.toString())

      try {
        const response = await fetch(`/api/parfums?${params.toString()}`)
        const data = await response.json()
        const newParfums = data.data || []
        const newTotal = data.total || 0

        // 1. Update list parfum
        setParfums((prev) => 
          isInitialLoad ? newParfums : [...prev, ...newParfums]
        )
        
        // 2. Update total parfum
        setTotalParfums(newTotal)

        // 3. Tentukan apakah masih ada data yang bisa dimuat
        setHasMore((currentSkip + newParfums.length) < newTotal)

      } catch (error) {
        console.error("Error fetching parfums:", error)
      } finally {
        if (isInitialLoad) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }
      }
    },
    [currentFilters]
  );
  
  // Fungsi untuk memicu pemuatan data selanjutnya
  const loadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      // Gunakan panjang array saat ini sebagai nilai 'skip' (offset)
      fetchParfums(parfums.length, false)
    }
  };


  // --- SIDE EFFECTS ---

  // 1. useEffect untuk mengambil data filter (Brands & Categories) - (Tidak berubah)
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

  // 2. useEffect untuk memuat data awal setiap kali FILTER berubah di URL (tetap)
  useEffect(() => {
    // Reset status saat filter berubah
    setHasMore(true); 
    // Memanggil fetch dengan skip=0 (load awal)
    fetchParfums(0, true); 
  }, [currentFilters, fetchParfums]);


  // --- UTILS & RENDERING ---

  const resetFilters = () => {
    router.push(pathname) // Hapus semua query params
  }

  const isFiltered = searchParams.size > 0

  // Helper untuk mendapatkan nama brand/kategori yang dipilih
  const selectedBrandName =
    brands.find((b) => b.slug === selectedBrandSlug)?.name || "Pilih Brand..."
  const selectedCategoryName =
    categories.find((c) => c.slug === selectedCategorySlug)?.name ||
    "Pilih Kategori..."
    
  // Logika tampilan untuk skeleton dan no results
  const showInitialLoading = loading && parfums.length === 0;
  const showNoResults = !loading && parfums.length === 0;


return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Filters & Search Section */}
      <section className="py-8 border-b border-border sticky top-16 bg-card z-40">
        <div className="container-luxury">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Koleksi Lengkap Parfum
          </h1>
          {/* Filters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
            
            {/* Search Input */}
            <div className="relative col-span-2 md:col-span-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari parfum..."
                defaultValue={searchTerm} 
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Brand Combobox */}
            <Popover open={brandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={brandPopoverOpen}
                  className="w-full justify-between bg-input hover:bg-muted col-span-1" 
                >
                  <span className="truncate">{selectedBrandName}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100%] md:w-[var(--radix-popover-trigger-width)] p-0 z-[51]">
                <Command>
                  <CommandInput placeholder="Cari brand..." />
                  <CommandList>
                    <CommandEmpty>Brand tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          handleFilterChange("brandSlug", "")
                          setBrandPopoverOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBrandSlug === ""
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Semua Brand
                      </CommandItem>
                      {/* PEMBATASAN BRAND: Hanya tampilkan MAX_DROPDOWN_ITEMS */}
                      {brands.slice(0, MAX_DROPDOWN_ITEMS).map((brand) => (
                        <CommandItem
                          key={brand.id}
                          value={brand.name}
                          onSelect={() => {
                            handleFilterChange("brandSlug", brand.slug)
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
                       {brands.length > MAX_DROPDOWN_ITEMS && (
                            <p className="text-center text-xs text-muted-foreground p-2">
                                Tampilkan {MAX_DROPDOWN_ITEMS} dari {brands.length} brand. Gunakan pencarian untuk filter.
                            </p>
                        )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Category Combobox */}
            <Popover
              open={categoryPopoverOpen}
              onOpenChange={setCategoryPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryPopoverOpen}
                  className="w-full justify-between bg-input hover:bg-muted col-span-1"
                >
                  <span className="truncate">{selectedCategoryName}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100%] md:w-[var(--radix-popover-trigger-width)] p-0 z-[51]">
                <Command>
                  <CommandInput placeholder="Cari kategori..." />
                  <CommandList>
                    <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          handleFilterChange("categorySlug", "")
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
                      {/* PEMBATASAN KATEGORI: Hanya tampilkan MAX_DROPDOWN_ITEMS */}
                      {categories.slice(0, MAX_DROPDOWN_ITEMS).map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={() => {
                            handleFilterChange("categorySlug", cat.slug)
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
                      {categories.length > MAX_DROPDOWN_ITEMS && (
                            <p className="text-center text-xs text-muted-foreground p-2">
                                Tampilkan {MAX_DROPDOWN_ITEMS} dari {categories.length} kategori. Gunakan pencarian untuk filter.
                            </p>
                        )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Audience Filter */}
            <select
              value={selectedAudience} 
              onChange={(e) => handleFilterChange("audience", e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary col-span-2 md:col-span-1"
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
              {/* Tampilkan total data yang sudah dimuat */}
              {loading && parfums.length === 0
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
          {showInitialLoading ? (
            // Skeleton untuk initial load
            // MENGUBAH GRID KOLOM SKELETON: Responsif dari 2 hingga 5 kolom
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="card-luxury p-4 h-64 animate-pulse bg-muted" // h-64 untuk tinggi kartu yang lebih kecil
                />
              ))}
            </div>
          ) : showNoResults ? (
            // Tampilan jika tidak ada hasil
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Parfum tidak ditemukan
              </p>
              <button onClick={resetFilters} className="btn-luxury">
                Reset Semua Filter
              </button>
            </div>
          ) : (
            // Tampilan data parfum
            <>
              {/* MENGUBAH GRID KOLOM DAN GAP untuk density yang lebih tinggi dan responsif */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {parfums.map((parfum) => (
                  <Link key={parfum.id} href={`/parfums/${parfum.slug}`}>
                    <div className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-shadow p-4">
                      {/* MENGURANGI TINGGI GAMBAR menjadi h-40 */}
                      <div className="relative w-full h-40 bg-muted overflow-hidden rounded-lg mb-4">
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
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition line-clamp-2 my-1">
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
              
              {/* TOMBOL MUAT LEBIH BANYAK (LOAD MORE) */}
              {hasMore && parfums.length > 0 && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn-luxury"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Memuat Lebih Banyak...
                      </>
                    ) : (
                      "Muat Lebih Banyak Referensi"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {/* Tampilkan sisa data yang belum dimuat */}
                    {totalParfums - parfums.length > 0 ? `${new Intl.NumberFormat('id-ID').format(totalParfums - parfums.length)} parfum tersisa` : 'Memuat...'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}