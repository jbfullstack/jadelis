import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(): Promise<Response> {
  try {
    const result = await pool.query(
      "SELECT * FROM super_categories ORDER BY id"
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error listing super_categories:", error);
    return NextResponse.json(
      { success: false, error: "DB Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { name } = body;
    const result = await pool.query(
      `INSERT INTO super_categories (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return NextResponse.json({ success: true, superCategory: result.rows[0] });
  } catch (error) {
    console.error("Error creating super_category:", error);
    return NextResponse.json(
      { success: false, error: "DB Error" },
      { status: 500 }
    );
  }
}
