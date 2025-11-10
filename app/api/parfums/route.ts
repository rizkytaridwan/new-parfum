import { type NextRequest, NextResponse } from "next/server"

// NOTE: Ganti dengan koneksi database Anda (MySQL dengan XAMPP)
// Contoh menggunakan mysql2:
// import mysql from 'mysql2/promise'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 100
    const skip = searchParams.get("skip") ? Number.parseInt(searchParams.get("skip")!) : 0

    // TODO: Implementasi koneksi database Anda
    // Contoh data dummy - ganti dengan query database
    const mockParfums = [
      {
        id: "cmhq2znti0003hcug21z76yd9",
        name: "Sauvage Elixir",
        slug: "sauvage-elixir",
        description: "Wangi pria yang sangat kuat dengan karakter maskulin",
        imageUrl: "/perfume-bottle-elegant.jpg",
        launchYear: 2021,
        brand: { id: "cmhq164i50003u8ug9nh861k2", name: "Dior" },
        category: { id: "cmhq2evig0000msugb4rcfxvr", name: "Aromatic Fougere" },
      },
      {
        id: "cmhshsb1s0002qkug7i9j5xuw",
        name: "Roman Wish",
        slug: "roman-wish",
        description: "Parfum dengan karakter kuat dan tahan lama",
        imageUrl: "/luxury-perfume.png",
        launchYear: 2022,
        brand: { id: "cmhq164i50003u8ug9nh861k2", name: "Dior" },
        category: { id: "cmhq2evig0000msugb4rcfxvr", name: "Bujur Hideung" },
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockParfums.slice(skip, skip + limit),
      total: mockParfums.length,
    })
  } catch (error) {
    console.error("Error fetching parfums:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
