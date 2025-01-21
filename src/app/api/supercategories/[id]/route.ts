import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

interface Params {
  params: {
    id: string; // supercategory ID from the URL
  };
}

// GET: fetch one super-category by ID
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    const result = await pool.query(
      `SELECT * FROM super_categories WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "SuperCategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      superCategory: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching super-category:", error);
    return NextResponse.json(
      { success: false, error: "DB Error" },
      { status: 500 }
    );
  }
}

// PATCH: update super-category name
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing 'name' field" },
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
    console.error("Error updating super-category:", error);
    return NextResponse.json(
      { success: false, error: "DB Error" },
      { status: 500 }
    );
  }
}

// DELETE: remove super-category by ID
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    // optionally remove linking from pivot table first
    await pool.query(
      `DELETE FROM super_category_categories
       WHERE super_category_id = $1`,
      [id]
    );

    // then remove the super-category
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
    console.error("Error deleting super-category:", error);
    return NextResponse.json(
      { success: false, error: "DB Error" },
      { status: 500 }
    );
  }
}
