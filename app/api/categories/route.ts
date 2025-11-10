import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Query database untuk mendapatkan semua kategori
    const mockCategories = [
      {
        id: "cmhq1l3xi00001kuggma9g1qy",
        name: "Aromatic Fougere",
        slug: "aromatic-fougere",
        description: "Kategori wangi klasik pria dengan karakter herbal dan woody",
      },
      {
        id: "cmhq2evig0000msugb4rcfxvr",
        name: "Bujur Hideung",
        slug: "bujur-hideung",
        description: "Kategori wangi dengan karakter yang kuat dan mendominasi",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockCategories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
