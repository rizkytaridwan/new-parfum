// app/api/brands/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute("SELECT * FROM brands")
    connection.release()

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}