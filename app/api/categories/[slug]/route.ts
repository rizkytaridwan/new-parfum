// app/api/categories/[slug]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  let slug: string | undefined // Definisikan di luar try-catch

  try {
    // PERBAIKAN: Tambahkan 'await' untuk membuka 'context.params'
    const params = await (context.params as any)
    slug = params.slug

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug tidak ditemukan" },
        { status: 400 },
      )
    }

    const connection = await pool.getConnection()

    // 1. Ambil data kategori berdasarkan slug
    const categoryQuery = "SELECT * FROM categories WHERE slug = ? LIMIT 1"
    const [categoryRows] = (await connection.execute(categoryQuery, [
      slug,
    ])) as any[]

    if (categoryRows.length === 0) {
      connection.release()
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 },
      )
    }
    const category = categoryRows[0]

    // 2. Ambil semua parfum yang terkait dengan categoryId ini
    const parfumsQuery = `
      SELECT p.*, 
             b.id as brandId, b.name as brandName,
             c.id as categoryId, c.name as categoryName 
      FROM parfum p
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.categoryId = ?
      ORDER BY p.launchYear DESC, p.name ASC
    `
    const [parfumRows] = (await connection.execute(parfumsQuery, [
      category.id,
    ])) as any[]

    connection.release()

    // Transformasi data parfum
    const parfums = parfumRows.map((row: any) => {
      const { brandId, brandName, categoryId, categoryName, audience, ...rest } = row
      return {
        ...rest,
        audience,
        brand: { id: brandId, name: brandName },
        category: { id: categoryId, name: categoryName },
      }
    })

    // Gabungkan hasilnya
    const result = {
      category: category,
      parfums: parfums,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error(`Error fetching category ${slug || "undefined"}:`, error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}