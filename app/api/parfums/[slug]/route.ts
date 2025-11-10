// app/api/parfums/[slug]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: NextRequest,
  // Ganti destructuring { params } menjadi context
  context: { params: { slug: string } },
) {
  let slug: string | undefined // Definisikan slug di sini agar bisa diakses di catch block
  try {
    // Await params seperti yang disarankan error log
    const params = await (context.params as any)
    slug = params.slug

    if (!slug) {
      throw new Error("Slug parameter is undefined.")
    }

    const connection = await pool.getConnection()

    // 1. Ambil data parfum utama
    const parfumQuery = `
      SELECT p.*, 
             b.id as brandId, b.name as brandName,
             c.id as categoryId, c.name as categoryName 
      FROM parfum p
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.slug = ?
      LIMIT 1
    `
    // Pastikan 'slug' sudah terisi sebelum eksekusi
    const [parfumRows] = (await connection.execute(parfumQuery, [slug])) as any[]

    if (parfumRows.length === 0) {
      connection.release()
      return NextResponse.json(
        { success: false, error: "Parfum not found" },
        { status: 404 },
      )
    }

    const parfumData = parfumRows[0]

    // 2. Ambil data notes untuk parfum ini
    const notesQuery = `
      SELECT n.id, n.name, pn.noteType
      FROM parfum_notes pn
      JOIN notes n ON pn.noteId = n.id
      WHERE pn.parfumId = ?
    `
    const [notesRows] = (await connection.execute(notesQuery, [
      parfumData.id,
    ])) as any[]

    connection.release()

    // 3. Format data notes
    const notes = notesRows.map((note: any) => ({
      id: note.id,
      name: note.name,
      type: note.noteType,
    }))

    // 4. Gabungkan semua data
    const { brandId, brandName, categoryId, categoryName, ...rest } = parfumData
    const result = {
      ...rest,
      brand: { id: brandId, name: brandName },
      category: { id: categoryId, name: categoryName },
      notes: notes,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    // Gunakan variabel 'slug' yang sudah didefinisikan di atas
    console.error(`Error fetching parfum ${slug || "undefined"}:`, error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}