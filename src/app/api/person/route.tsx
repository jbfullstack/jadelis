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
        SELECT id, first_name, last_name, description, birth_date
        FROM persons
        WHERE birth_date = $1;
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
          .join(", ")}
      `;
      const categoryValues = [personId, ...selectedCategories];
      await pool.query(categoryQuery, categoryValues);
    }

    return NextResponse.json({ success: true, personId }, { status: 201 });
  } catch (error) {
    console.error("Error inserting person:", error);

    // Narrow the type of `error` to access its properties
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save person";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
