import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET => ?categoryId=123 => which supercats are linked to cat #123?
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing categoryId" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT super_category_id
         FROM super_category_categories
        WHERE category_id = $1`,
      [categoryId]
    );
    const linkedIds = result.rows.map((row) => row.super_category_id);
    return NextResponse.json({ success: true, linked: linkedIds });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// POST => link
export async function POST(request: Request) {
  try {
    const { categoryId, superCategoryId } = await request.json();
    if (!categoryId || !superCategoryId) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }
    await pool.query(
      `INSERT INTO super_category_categories (category_id, super_category_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [categoryId, superCategoryId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// DELETE => unlink
export async function DELETE(request: Request) {
  try {
    const { categoryId, superCategoryId } = await request.json();
    if (!categoryId || !superCategoryId) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }
    await pool.query(
      `DELETE FROM super_category_categories
        WHERE category_id = $1 AND super_category_id = $2`,
      [categoryId, superCategoryId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
