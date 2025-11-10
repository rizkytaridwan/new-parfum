import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // TODO: Query database untuk mendapatkan parfum berdasarkan slug
    const mockParfum = {
      id: "cmhq2znti0003hcug21z76yd9",
      name: "Sauvage Elixir",
      slug: "sauvage-elixir",
      description:
        "Wangi pria yang sangat kuat dengan karakter maskulin yang mendominasi. Aroma ini sempurna untuk pria yang ingin tampil percaya diri.",
      imageUrl: "/perfume-bottle-elegant.jpg",
      launchYear: 2021,
      brand: { id: "cmhq164i50003u8ug9nh861k2", name: "Dior" },
      category: { id: "cmhq2evig0000msugb4rcfxvr", name: "Aromatic Fougere" },
      notes: [
        { id: "1", name: "Bergamot", type: "TOP" },
        { id: "2", name: "Pepper", type: "TOP" },
        { id: "3", name: "Ambroxan", type: "MIDDLE" },
        { id: "4", name: "Cedar", type: "BASE" },
        { id: "5", name: "Sandalwood", type: "BASE" },
      ],
    }

    if (mockParfum.slug !== slug) {
      return NextResponse.json({ success: false, error: "Parfum not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: mockParfum,
    })
  } catch (error) {
    console.error("Error fetching parfum:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
