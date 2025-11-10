# Tutorial Setup Website Parfum Premium

Panduan lengkap untuk setup dan menjalankan website parfum listing dengan Next.js dan MySQL XAMPP.

## 📋 Persyaratan

- Node.js v18+
- XAMPP dengan MySQL
- Git (opsional)
- Code Editor (VS Code recommended)

## 🚀 Quick Start

### 1. Setup Database (XAMPP)

\`\`\`bash
# Buka XAMPP Control Panel
# Klik "Start" pada Apache dan MySQL

# Buka phpMyAdmin di browser
# http://localhost/phpmyadmin

# Import database:
# 1. Klik "Import" tab
# 2. Pilih file newparfum-(1).sql
# 3. Klik "Go"
\`\`\`

### 2. Setup Node.js Project

\`\`\`bash
# Clone atau download project ini

# Install dependencies
npm install

# Setup database connection
cp lib/db-config.example.ts lib/db-config.ts
# Edit lib/db-config.ts dengan kredensial MySQL Anda
\`\`\`

### 3. Configure API Routes

Edit file \`app/api/parfums/route.ts\` untuk menghubungkan dengan database:

\`\`\`typescript
import mysql from 'mysql2/promise'
import { DB_CONFIG } from '@/lib/db-config'

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(DB_CONFIG)
    const [rows] = await connection.execute(
      'SELECT p.*, b.name as brand_name, c.name as category_name FROM parfum p LEFT JOIN brands b ON p.brandId = b.id LEFT JOIN categories c ON p.categoryId = c.id LIMIT ?',
      [50]
    )
    await connection.end()
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka http://localhost:3000 di browser Anda.

## 🔧 Konfigurasi Google Ads & SEO

### 1. Google Ads (AdSense)

\`\`\`html
<!-- Tambahkan di app/layout.tsx -->
<meta name="google-adsense-account" content="ca-pub-YOUR_ADSENSE_ID" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
     crossorigin="anonymous"></script>
\`\`\`

### 2. Verifikasi Google Search Console

\`\`\`bash
# 1. Buka Google Search Console
# 2. Tambahkan property domain Anda
# 3. Verifikasi dengan meta tag:
\`\`\`

Edit \`app/layout.tsx\`:
\`\`\`tsx
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
\`\`\`

### 3. Submit Sitemap

\`\`\`typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/parfums',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}
\`\`\`

## 📱 Struktur Project

\`\`\`
app/
  ├── api/                    # API Routes
  │   ├── parfums/           # Parfum endpoints
  │   ├── brands/            # Brand endpoints
  │   └── categories/        # Category endpoints
  ├── parfums/               # Parfum pages
  │   ├── page.tsx           # List page
  │   └── [slug]/page.tsx    # Detail page
  ├── layout.tsx             # Root layout
  ├── page.tsx               # Homepage
  └── globals.css            # Global styles

components/
  ├── navigation.tsx         # Header/Navigation
  ├── hero.tsx               # Hero section
  ├── featured-perfumes.tsx  # Featured products
  ├── category-showcase.tsx  # Category section
  └── footer.tsx             # Footer

lib/
  ├── db-config.ts           # Database config
  └── utils.ts               # Utility functions

public/
  └── uploads/               # Upload folder untuk images

scripts/
  └── schema.sql             # Database schema
\`\`\`

## 🗄️ Implementasi Database

### Option 1: MySQL2 (Recommended)

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

export async function GET(request: NextRequest) {
  const connection = await pool.getConnection()
  const [rows] = await connection.execute('SELECT * FROM parfum')
  connection.release()
  return NextResponse.json({ data: rows })
}
\`\`\`

### Option 2: Prisma ORM

\`\`\`bash
npm install @prisma/client
npm install -D prisma
npx prisma init
\`\`\`

\`\`\`prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Parfum {
  id         String   @id @default(cuid())
  name       String
  slug       String   @unique
  description String?
  imageUrl   String?
  launchYear Int?
  brandId    String?
  categoryId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
\`\`\`

## 📈 Optimasi SEO

### 1. Meta Tags
- ✅ Title tags (50-60 characters)
- ✅ Meta descriptions (150-160 characters)
- ✅ Open Graph tags
- ✅ Twitter cards

### 2. Structured Data (Schema.org)
\`\`\`json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Sauvage Elixir",
  "brand": "Dior",
  "description": "Wangi pria yang sangat kuat",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "128"
  }
}
\`\`\`

### 3. Performance
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CSS optimization

## 💰 Monetasi dengan Google Ads

### 1. Placement Recommendations

- Header banner (above the fold)
- Sidebar (if responsive)
- Between product listings
- After article content
- Footer

### 2. Ad Unit Configuration

\`\`\`tsx
// components/ad-unit.tsx
export function AdUnit() {
  return (
    <div className="my-8">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-YOUR_ID"
           data-ad-slot="YOUR_SLOT_ID"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
        {(adsbygoogle = window.adsbygoogle || []).push({})}
      </script>
    </div>
  )
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Setup Environment Variables

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan:
   - DATABASE_URL=mysql://user:pass@localhost/newparfum
   - NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-YOUR_ID

## 📊 Monitoring & Analytics

### Google Analytics

\`\`\`typescript
// app/layout.tsx
import Script from 'next/script'

<Script
  strategy="afterInteractive"
  src={\`https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID\`}
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: \`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YOUR_ID');
    \`,
  }}
/>
\`\`\`

## ❓ FAQ

**Q: Database saya tidak terkoneksi?**
A: Pastikan MySQL XAMPP berjalan, database sudah di-import, dan credentials benar di db-config.ts

**Q: Gambar parfum tidak muncul?**
A: Upload gambar ke folder \`public/uploads/\` dan update URL di database

**Q: Bagaimana cara menambah parfum baru?**
A: Insert langsung di phpMyAdmin atau buat admin panel dengan form

**Q: Berapa lama sampai Google Ads approve?**
A: Biasanya 24-48 jam setelah submit di AdSense

## 📞 Support

Jika ada pertanyaan atau error, silakan:
1. Cek console browser (F12)
2. Cek server logs
3. Baca dokumentasi Next.js: https://nextjs.org/docs

---

**Happy Coding! 🎉**
\`\`\`

Now you have a complete, professional perfume listing website! Let me also create a sitemap configuration and update the layout with better SEO:
