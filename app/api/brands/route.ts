import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Query database untuk mendapatkan semua brand
    const mockBrands = [
      {
        id: "cmhq164i50003u8ug9nh861k2",
        name: "Dior",
        slug: "dior",
        description: "Rumah mode mewah dari Prancis.",
        imageUrl: null,
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockBrands,
    })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
