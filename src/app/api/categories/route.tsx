import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Fetch categories grouped by SuperCategory
    const query = `
      SELECT c.id AS category_id, c.name AS category_name, sc.id AS super_category_id, sc.name AS super_category_name
      FROM categories c
      LEFT JOIN super_category_categories scc ON c.id = scc.category_id
      LEFT JOIN super_categories sc ON scc.super_category_id = sc.id
      ORDER BY sc.name, c.name;
    `;
    const result = await pool.query(query);

    // Transform the result into a grouped format
    const groupedCategories = result.rows.reduce((acc, row) => {
      const superCategoryName = row.super_category_name || "Other";
      if (!acc[superCategoryName]) {
        acc[superCategoryName] = [];
      }
      acc[superCategoryName].push({
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
