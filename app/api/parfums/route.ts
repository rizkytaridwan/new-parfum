// app/api/parfums/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

// Tipe data yang valid untuk audience
type Audience = "Pria" | "Wanita" | "Unisex"
const VALID_AUDIENCES: Set<string> = new Set(["Pria", "Wanita", "Unisex"])

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 100
    const skip = searchParams.get("skip")
      ? Number.parseInt(searchParams.get("skip")!)
      : 0
    const search = searchParams.get("search")
    const brandSlug = searchParams.get("brandSlug")
    const categorySlug = searchParams.get("categorySlug")
    const audience = searchParams.get("audience")

    const connection = await pool.getConnection()

    // --- Pembuatan Query yang Aman dan Dinamis ---
    let whereClauses: string[] = []
    let params: (string | number)[] = []
    let joinClauses: string[] = [
      "LEFT JOIN brands b ON p.brandId = b.id",
      "LEFT JOIN categories c ON p.categoryId = c.id",
    ]

    // 1. Filter Pencarian
    if (search) {
      whereClauses.push("(p.name LIKE ? OR p.description LIKE ? OR b.name LIKE ?)")
      const searchQuery = `%${search}%`
      params.push(searchQuery, searchQuery, searchQuery)
    }

    // 2. Filter Brand
    if (brandSlug) {
      whereClauses.push("b.slug = ?")
      params.push(brandSlug)
    }

    // 3. Filter Kategori
    if (categorySlug) {
      whereClauses.push("c.slug = ?")
      params.push(categorySlug)
    }

    // 4. (BARU) Filter Audience
    if (audience && VALID_AUDIENCES.has(audience)) {
      whereClauses.push("p.audience = ?")
      params.push(audience as Audience)
    }

    // Gabungkan semua klausa WHERE
    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""
    const joinSql = joinClauses.join(" ")

    // --- Query untuk mengambil data (dengan limit/offset) ---
    const query = `
      SELECT p.*, 
             b.id as brandId, b.name as brandName, b.slug as brandSlug,
             c.id as categoryId, c.name as categoryName, c.slug as categorySlug 
      FROM parfum p
      ${joinSql}
      ${whereSql}
      ORDER BY p.name ASC
      LIMIT ?
      OFFSET ?
    `
    const queryParams = [...params, limit.toString(), skip.toString()]
    const [rows] = (await connection.execute(query, queryParams)) as RowDataPacket[]

    // --- Query untuk menghitung total hasil (tanpa limit/offset) ---
    const countQuery = `
      SELECT COUNT(p.id) as total 
      FROM parfum p
      ${joinSql}
      ${whereSql}
    `
    const [totalRows] = (await connection.execute(
      countQuery,
      params,
    )) as RowDataPacket[]

    connection.release()

    // Transformasi data
    const data = rows.map((row: any) => {
      const {
        brandId,
        brandName,
        brandSlug,
        categoryId,
        categoryName,
        categorySlug,
        audience, // pastikan audience juga di-pass
        ...rest
      } = row
      return {
        ...rest,
        audience,
        brand: { id: brandId, name: brandName, slug: brandSlug },
        category: { id: categoryId, name: categoryName, slug: categorySlug },
      }
    })

    return NextResponse.json({
      success: true,
      data: data,
      total: (totalRows[0] as any)?.total || 0,
    })
  } catch (error) {
    console.error("Error fetching parfums:", error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}