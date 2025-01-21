import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET: grouped categories
export async function GET() {
  try {
    const query = `
      SELECT c.id AS category_id, c.name AS category_name, sc.id AS super_category_id, sc.name AS super_category_name
      FROM categories c
      LEFT JOIN super_category_categories scc ON c.id = scc.category_id
      LEFT JOIN super_categories sc ON scc.super_category_id = sc.id
      ORDER BY sc.name, c.name;
    `;
    const result = await pool.query(query);

    // Transform into grouped object: { [superCatName]: Category[] }
    const groupedCategories = result.rows.reduce((acc, row) => {
      const superCatName = row.super_category_name || "Other";
      if (!acc[superCatName]) acc[superCatName] = [];
      acc[superCatName].push({
        id: row.category_id,
        name: row.category_name,
      });
      return acc;
    }, {});

    return NextResponse.json({ success: true, categories: groupedCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing 'name'" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO categories (name) VALUES ($1) RETURNING id, name
    `;
    const result = await pool.query(insertQuery, [name]);
    const newCat = result.rows[0];

    return NextResponse.json({ success: true, category: newCat });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "DB error creating category" },
      { status: 500 }
    );
  }
}
