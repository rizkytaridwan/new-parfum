# 🌹 Parfum Premium - Website Listing Parfum Luxury

Website e-commerce listing parfum premium dengan UI/UX yang luar biasa, SEO optimal, dan siap monetasi dengan Google Ads.

## ✨ Fitur Utama

- 🎨 **UI/UX Premium**: Desain luxury dengan color scheme elegant
- 🔍 **SEO Optimized**: Meta tags, structured data, sitemap
- 📱 **Fully Responsive**: Mobile-first design
- 🔗 **Filter & Search**: Cari parfum berdasarkan brand, kategori, nama
- 🖼️ **Image Optimization**: Next.js Image dengan lazy loading
- 📊 **Google Analytics Ready**: Tracking dan monitoring
- 💰 **AdSense Ready**: Siap untuk monetasi Google Ads
- ⚡ **Performance**: Fast loading, optimized bundle
- 🎯 **Schema.org**: Structured data untuk better SEO

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4
- **Database**: MySQL (XAMPP)
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons
- **Image**: Next.js Image Optimization

## 📦 Quick Setup

\`\`\`bash
# 1. Clone project
git clone <repository-url>
cd parfum-website

# 2. Install dependencies
npm install

# 3. Setup database
# - Import newparfum-(1).sql ke phpMyAdmin

# 4. Configure environment
cp .env.example .env.local
# Edit .env.local dengan kredensial Anda

# 5. Run development server
npm run dev
\`\`\`

Buka http://localhost:3000

## 📁 Project Structure

\`\`\`
app/
├── api/                      # API Routes
│   ├── parfums/             # Parfum endpoints
│   ├── brands/              # Brand endpoints
│   └── categories/          # Category endpoints
├── parfums/
│   ├── page.tsx             # Listing page
│   └── [slug]/page.tsx      # Detail page
├── layout.tsx               # Root layout
├── page.tsx                 # Homepage
├── robots.ts                # robots.txt
├── sitemap.ts               # sitemap.xml
└── globals.css              # Global styles

components/
├── navigation.tsx
├── hero.tsx
├── featured-perfumes.tsx
├── category-showcase.tsx
└── footer.tsx

lib/
├── db-config.ts             # Database config
└── utils.ts                 # Utilities
\`\`\`

## 🗄️ Database Schema

Database terdiri dari 5 tabel utama:

- **brands**: Koleksi brand parfum
- **categories**: Kategori/jenis aroma
- **notes**: Komponen aroma (top, middle, base)
- **parfum**: Data parfum dengan foreign key ke brand & category
- **parfum_notes**: Relasi parfum dengan notes

Semua sudah ter-setup di file newparfum-(1).sql

## 🔧 Implementasi Database

### Dengan MySQL2

\`\`\`bash
npm install mysql2
\`\`\`

\`\`\`typescript
// app/api/parfums/route.ts
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newparfum',
})

export async function GET() {
  const connection = await pool.getConnection()
  const [rows] = await connection.execute('SELECT * FROM parfum')
  connection.release()
  return Response.json({ data: rows })
}
\`\`\`

## 📈 SEO Optimization

✅ Meta tags dan descriptions
✅ Open Graph untuk social sharing
✅ Twitter cards
✅ Structured data (Schema.org)
✅ Sitemap dan robots.txt
✅ Image alt text
✅ Semantic HTML
✅ Mobile responsive
✅ Fast loading time
✅ No broken links

## 💰 Google Ads Integration

### 1. Setup AdSense

\`\`\`typescript
// Add to app/layout.tsx
<meta name="google-adsense-account" content="ca-pub-YOUR_ID" />
\`\`\`

### 2. Create Ad Units

\`\`\`bash
# Buka Google AdSense
# Create ad units untuk:
# - Header banner
# - Sidebar
# - Content area
# - Footer
\`\`\`

### 3. Best Practices

- Min 1000 unique visitors per hari untuk approval
- Original content (tidak copy paste)
- Clear navigation dan structure
- Mobile-friendly design
- Good user experience

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
# 1. Push ke GitHub
git push origin main

# 2. Deploy ke Vercel
vercel
\`\`\`

### Environment Variables di Vercel

\`\`\`
DATABASE_URL=mysql://user:pass@db-host/newparfum
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-YOUR_ID
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

## 📊 Performance Tips

- ✅ Gunakan Next.js Image untuk semua gambar
- ✅ Enable compression di server
- ✅ Lazy load images
- ✅ Minify CSS/JS
- ✅ Use CDN untuk images
- ✅ Cache strategy untuk API

## 🔒 Security

- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variables untuk secrets
- ✅ SQL injection prevention (gunakan parameterized queries)
- ✅ Rate limiting untuk API

## ❓ Troubleshooting

**Error: Database connection failed**
→ Pastikan MySQL running di XAMPP
→ Check credentials di db-config.ts

**Images not loading**
→ Upload ke public/uploads/
→ Update URL di database

**SEO not working**
→ Verifikasi dengan Google Search Console
→ Submit sitemap
→ Check console untuk errors

## 📞 Support & Resources

- [Next.js Docs](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [MySQL Docs](https://dev.mysql.com)

## 📝 License

MIT License - Bebas untuk digunakan dan dimodifikasi

---

**Developed with ❤️ for Indonesian Perfume Enthusiasts**
