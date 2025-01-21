import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

interface Params {
  params: { id: string };
}

// GET => fetch single category by ID
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = params;
    const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, category: result.rows[0] });
  } catch (err) {
    console.error("Error in GET /api/categories/[id]:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// PATCH => update category name
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing 'name'" },
        { status: 400 }
      );
    }
    const result = await pool.query(
      `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Update failed" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, category: result.rows[0] });
  } catch (err) {
    console.error("Error in PATCH /api/categories/[id]:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// DELETE => remove category by ID
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    // remove from pivot table first
    await pool.query(
      `DELETE FROM super_category_categories WHERE category_id = $1`,
      [id]
    );

    // then remove from categories
    const result = await pool.query(
      `DELETE FROM categories WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Delete failed" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error("Error in DELETE /api/categories/[id]:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
