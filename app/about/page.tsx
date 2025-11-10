import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Info, BookOpen, BarChart } from "lucide-react"

// SEO Khusus untuk halaman "Tentang Kami"
export const metadata: Metadata = {
  title: "Tentang Kami | Ensiklopedia Parfum",
  description:
    "Pelajari lebih lanjut tentang Ensiklopedia Parfum. Misi kami adalah menjadi database referensi dan ulasan parfum terlengkap di Indonesia.",
  robots: "index, follow", // Pastikan Google meng-index halaman ini
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary/5 border-b border-border">
        <div className="container-luxury">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Tentang Kami
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Misi kami adalah menyediakan database referensi parfum terlengkap dan
            paling akurat untuk para pecinta wangi di Indonesia.
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          {/* Gunakan max-w-prose untuk readability teks yang panjang */}
          <div className="max-w-prose mx-auto prose dark:prose-invert prose-lg prose-h2:font-serif prose-h2:text-3xl prose-p:text-muted-foreground prose-a:text-primary">
            <h2>Misi Kami</h2>
            <p>
              Kami percaya bahwa menemukan parfum yang sempurna adalah sebuah
              perjalanan. Misi kami adalah menjadi pemandu Anda dalam perjalanan
              tersebut. Kami menyediakan data mendalam, ulasan, dan komposisi
              aroma (notes) untuk ribuan parfum, membantu Anda membuat keputusan
              yang tepat sebelum mencoba atau membeli di tempat lain.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Ensiklopedia
                </h3>
                <p className="text-sm text-muted-foreground">
                  Database kami mencakup Top, Middle, dan Base notes, serta
                  tahun rilis dan kategori aroma.
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <BarChart className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Referensi Objektif
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kami mengumpulkan data dari berbagai sumber untuk memberikan
                  gambaran yang seimbang.
                </p>
              </div>
            </div>

            <h2>Disclaimer Penting</h2>
            <p>
              Harap dicatat bahwa situs ini adalah murni untuk **referensi dan
              edukasi**.
            </p>
            <blockquote>
              <p className="font-semibold text-foreground">
                Kami tidak menjual parfum, produk refill, atau produk apa pun.
              </p>
              <p>
                Situs ini adalah proyek hobi yang didanai melalui iklan Google
                AdSense. Informasi yang ditampilkan bertujuan untuk membantu
                pengguna, dan kami tidak terafiliasi secara langsung dengan
                brand parfum mana pun.
              </p>
            </blockquote>

            <h2>Kontak</h2>
            <p>
              Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami
              melalui email di{" "}
              <a href="mailto:info@domainanda.com">info@domainanda.com</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}