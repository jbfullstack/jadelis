import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { computeLifePathNumber } from "@/utils/numberCalculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      description,
      birthDate,
      deathDate,
      selectedCategories,
      confirm,
    } = body;

    // Step 1: Check for existing persons with the same birth_date (if not forced)
    if (!confirm) {
      const checkQuery = `
        SELECT
        id,
        first_name,
        last_name,
        COALESCE(description, '') AS description, -- Remplace NULL par une chaîne vide
        birth_date,
        death_date,
        number
      FROM persons;

      `;
      const checkResult = await pool.query(checkQuery, [new Date(birthDate)]);

      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Potential duplicate persons found.",
            matches: checkResult.rows,
          },
          { status: 409 }
        );
      }
    }

    // Step 2: Compute the life path number
    const lifePathNumber = computeLifePathNumber(birthDate);

    // Step 3: Insert the new person into the database
    const personQuery = `
      INSERT INTO persons (first_name, last_name, description, birth_date, death_date, number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const personValues = [
      firstName,
      lastName,
      description,
      new Date(birthDate),
      deathDate ? new Date(deathDate) : null,
      lifePathNumber,
    ];

    const personResult = await pool.query(personQuery, personValues);
    const personId = personResult.rows[0].id;

    // Step 4: Insert categories (if any)
    if (selectedCategories && selectedCategories.length > 0) {
      const categoryQuery = `
        INSERT INTO person_categories (person_id, category_id)
        VALUES ${selectedCategories
          .map((_unused: unknown, index: number) => `($1, $${index + 2})`)
          .join(", ")};
      `;
      const categoryValues = [personId, ...selectedCategories];
      await pool.query(categoryQuery, categoryValues);
    }

    return NextResponse.json({ success: true, personId }, { status: 201 });
  } catch (error) {
    console.error("Error inserting person:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to save person";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name") || null;
  const numbers = searchParams.get("numbers")
    ? searchParams
        .get("numbers")!
        .split(",")
        .map((num) => parseInt(num.trim(), 10))
    : null;
  const birthDateAfter = searchParams.get("birthDateAfter")
    ? new Date(searchParams.get("birthDateAfter")!)
    : null;
  const birthDateBefore = searchParams.get("birthDateBefore")
    ? new Date(searchParams.get("birthDateBefore")!)
    : null;
  const deathDateAfter = searchParams.get("deathDateAfter")
    ? new Date(searchParams.get("deathDateAfter")!)
    : null;
  const deathDateBefore = searchParams.get("deathDateBefore")
    ? new Date(searchParams.get("deathDateBefore")!)
    : null;
  const categories = searchParams.get("categories")
    ? searchParams
        .get("categories")!
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
    : null;

  try {
    const query = `
      SELECT DISTINCT p.*
      FROM persons p
      LEFT JOIN person_categories pc ON p.id = pc.person_id
      WHERE ($1::text IS NULL OR p.first_name ILIKE $1 || '%')
        AND ($2::text IS NULL OR p.last_name ILIKE $2 || '%')
        AND ($3::int[] IS NULL OR p.number = ANY($3))
        AND ($4::date IS NULL OR p.birth_date >= $4)
        AND ($5::date IS NULL OR p.birth_date <= $5)
        AND ($6::date IS NULL OR p.death_date >= $6)
        AND ($7::date IS NULL OR p.death_date <= $7)
        AND ($8::int[] IS NULL OR EXISTS (
          SELECT 1
          FROM person_categories pc
          WHERE pc.person_id = p.id AND pc.category_id = ANY($8)
        ))
      ORDER BY p.birth_date;
    `;

    const values = [
      name,
      null, // Last name placeholder if needed
      numbers, // Array of numbers
      birthDateAfter, // Start of birth date range
      birthDateBefore, // End of birth date range
      deathDateAfter, // Start of death date range
      deathDateBefore, // End of death date range
      categories, // Array of category IDs
    ];

    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, results: result.rows });
  } catch (error) {
    console.error("Error fetching persons:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch persons" },
      { status: 500 }
    );
  }
}
