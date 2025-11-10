export function Hero() {
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/parfums" className="btn-luxury">
            Jelajahi Referensi
          </a>
          <a href="/categories" className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary px-8 py-3 font-semibold transition-all hover:bg-primary/5">
            Lihat Kategori Aroma
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
            <p className="text-sm text-muted-foreground mt-2">Referensi Parfum</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
            <p className="text-sm text-muted-foreground mt-2">Brand Ternama</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
            <p className="text-sm text-muted-foreground mt-2">Ulasan Pembaca</p>
          </div>
        </div>
      </div>
    </section>
  )
}