// app/api/parfums/[slug]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  let slug: string | undefined
  try {
    const params = await (context.params as any)
    slug = params.slug

    if (!slug) {
      throw new Error("Slug parameter is undefined.")
    }

    const connection = await pool.getConnection()

    // 1. Ambil data parfum utama
    const parfumQuery = `
      SELECT p.*, 
             b.id as brandId, b.name as brandName, b.slug as brandSlug,
             c.id as categoryId, c.name as categoryName, c.slug as categorySlug 
      FROM parfum p
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.slug = ?
      LIMIT 1
    `
    const [parfumRows] = (await connection.execute(parfumQuery, [slug])) as any[]

    if (parfumRows.length === 0) {
      connection.release()
      return NextResponse.json(
        { success: false, error: "Parfum not found" },
        { status: 404 },
      )
    }

    const parfumData = parfumRows[0]

    // 2. Ambil data notes
    const notesQuery = `
      SELECT n.id, n.name, pn.noteType
      FROM parfum_notes pn
      JOIN notes n ON pn.noteId = n.id
      WHERE pn.parfumId = ?
    `
    const [notesRows] = (await connection.execute(notesQuery, [
      parfumData.id,
    ])) as any[]

    const notes = notesRows.map((note: any) => ({
      id: note.id,
      name: note.name,
      type: note.noteType,
    }))

    // 3. (BARU) Ambil data parfum serupa (2 dari brand, 2 dari kategori)
    // Ini query yang canggih untuk mengambil referensi relevan tanpa duplikat
    const similarQuery = `
      (SELECT p.id, p.name, p.slug, p.imageUrl, p.launchYear, 
              b.name as brandName, b.slug as brandSlug, 
              c.name as categoryName, c.slug as categorySlug
       FROM parfum p
       LEFT JOIN brands b ON p.brandId = b.id
       LEFT JOIN categories c ON p.categoryId = c.id
       WHERE p.brandId = ? AND p.id != ?
       ORDER BY RAND()
       LIMIT 2)
      UNION
      (SELECT p.id, p.name, p.slug, p.imageUrl, p.launchYear, 
              b.name as brandName, b.slug as brandSlug, 
              c.name as categoryName, c.slug as categorySlug
       FROM parfum p
       LEFT JOIN brands b ON p.brandId = b.id
       LEFT JOIN categories c ON p.categoryId = c.id
       WHERE p.categoryId = ? AND p.id != ? AND p.brandId != ?
       ORDER BY RAND()
       LIMIT 2)
      LIMIT 4
    `
    const [similarRows] = (await connection.execute(similarQuery, [
      parfumData.brandId,
      parfumData.id,
      parfumData.categoryId,
      parfumData.id,
      parfumData.brandId,
    ])) as any[]

    connection.release()

    // 4. (BARU) Transformasi data parfum serupa
    const similarParfums = similarRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      imageUrl: row.imageUrl,
      launchYear: row.launchYear,
      brand: { name: row.brandName, slug: row.brandSlug },
      category: { name: row.categoryName, slug: row.categorySlug },
    }))

    // 5. Gabungkan semua data
    const {
      brandId,
      brandName,
      brandSlug,
      categoryId,
      categoryName,
      categorySlug,
      audience,
      ...rest
    } = parfumData
    
    const result = {
      ...rest,
      audience,
      brand: { id: brandId, name: brandName, slug: brandSlug },
      category: { id: categoryId, name: categoryName, slug: categorySlug },
      notes: notes,
      similarParfums: similarParfums, // (BARU) Tambahkan ini
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error(`Error fetching parfum ${slug || "undefined"}:`, error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}