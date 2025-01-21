import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

interface Params {
  params: { id: string };
}

// GET => single superCategory
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = params;
    const result = await pool.query(
      `SELECT * FROM super_categories WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      superCategory: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching superCategory:", error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}

// PATCH => update superCategory name
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing 'name'" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE super_categories SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Update failed" },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      superCategory: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating superCategory:", error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}

// DELETE => remove superCategory
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    // remove pivot references first
    await pool.query(
      `DELETE FROM super_category_categories WHERE super_category_id = $1`,
      [id]
    );

    const result = await pool.query(
      `DELETE FROM super_categories WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Delete failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting superCategory:", error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}
