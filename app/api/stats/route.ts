// app/api/stats/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

export async function GET() {
  try {
    const connection = await pool.getConnection()

    // Query 1: Total Parfums (dari tabel 'parfum')
    const [parfumsRows] = (await connection.execute(
      "SELECT COUNT(id) as totalParfums FROM parfum",
    )) as RowDataPacket[]
    const totalParfums = parfumsRows[0].totalParfums

    // Query 2: Total Brands (dari tabel 'brands')
    const [brandsRows] = (await connection.execute(
      "SELECT COUNT(id) as totalBrands FROM brands",
    )) as RowDataPacket[]
    const totalBrands = brandsRows[0].totalBrands

    connection.release()

    return NextResponse.json({
      success: true,
      data: {
        totalParfums: Number(totalParfums),
        totalBrands: Number(totalBrands),
        totalReviews: "10K+", 
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}