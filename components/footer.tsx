import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Parfum Premium</h3>
            <p className="text-sm opacity-75">Koleksi wangi eksklusif dari brand internasional terkemuka.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/parfums" className="hover:text-accent transition">
                  Koleksi
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-accent transition">
                  Brand
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-accent transition">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Kebijakan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-accent transition">
                  Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent transition">
                  Pengembalian
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5" />
                <span>info@parfum.id</span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5" />
                <span>+62 (0) 123 456 789</span>
              </li>
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 Parfum Premium. Semua hak terlindungi.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition">
                Facebook
              </a>
              <a href="#" className="hover:text-accent transition">
                Instagram
              </a>
              <a href="#" className="hover:text-accent transition">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
