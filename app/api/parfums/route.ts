// app/api/parfums/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 100
    const skip = searchParams.get("skip")
      ? Number.parseInt(searchParams.get("skip")!)
      : 0

    const connection = await pool.getConnection()
    const query = `
      SELECT p.*, 
             b.id as brandId, b.name as brandName,
             c.id as categoryId, c.name as categoryName 
      FROM parfum p
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN categories c ON p.categoryId = c.id
      LIMIT ?
      OFFSET ?
    `

    const [rows] = (await connection.execute(query, [
      limit.toString(),
      skip.toString(),
    ])) as any[]

    const [totalRows] = (await connection.execute(
      "SELECT COUNT(*) as total FROM parfum",
    )) as any[]

    connection.release()

    // Transformasi data agar sesuai dengan ekspektasi frontend
    // (misal: { ..., brand: { name: '...' }, category: { name: '...' } })
    const data = rows.map((row: any) => {
      const { brandId, brandName, categoryId, categoryName, audience, ...rest } = row
      return {
        ...rest,
        audience,
        brand: { id: brandId, name: brandName },
        category: { id: categoryId, name: categoryName },
      }
    })

    return NextResponse.json({
      success: true,
      data: data,
      total: totalRows[0]?.total || 0,
    })
  } catch (error) {
    console.error("Error fetching parfums:", error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}