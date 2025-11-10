// app/api/categories/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute("SELECT * FROM categories")
    connection.release()

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    )
  }
}