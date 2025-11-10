"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="container-luxury flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            P
          </div>
          <span className="hidden sm:inline font-serif text-xl font-semibold">Parfum</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/parfums" className="text-sm font-medium hover:text-primary transition">
            Koleksi
          </Link>
          <Link href="/brands" className="text-sm font-medium hover:text-primary transition">
            Brand
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition">
            Kategori
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition">
            Tentang
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container-luxury py-4 space-y-3">
            <Link href="/parfums" className="block text-sm font-medium hover:text-primary transition py-2">
              Koleksi
            </Link>
            <Link href="/brands" className="block text-sm font-medium hover:text-primary transition py-2">
              Brand
            </Link>
            <Link href="/categories" className="block text-sm font-medium hover:text-primary transition py-2">
              Kategori
            </Link>
            <Link href="/about" className="block text-sm font-medium hover:text-primary transition py-2">
              Tentang
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
