import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { computeLifePathNumber } from "@/utils/numberCalculator";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

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
      isMoralPerson,
      confirm,
    } = body;

    // Step 1: Check for existing persons with the same birth_date (if not forced)
    if (!confirm) {
      const checkQuery = `
        SELECT
          id,
          first_name,
          last_name,
          COALESCE(description, '') AS description,
          birth_date,
          death_date,
          number,
          is_moral_person
        FROM persons
        WHERE birth_date = $1::date;
      `;
      const checkResult = await pool.query(checkQuery, [formatDate(birthDate)]);

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
    // Note: computeLifePathNumber should receive the date string in YYYY-MM-DD format
    const lifePathNumber = computeLifePathNumber(formatDate(birthDate));

    // Step 3: Insert the new person into the database
    const personQuery = `
      INSERT INTO persons (first_name, last_name, description, birth_date, death_date, number, is_moral_person)
      VALUES ($1, $2, $3, $4::date, $5::date, $6, $7)
      RETURNING id;
    `;
    const personValues = [
      firstName,
      lastName,
      description,
      formatDate(birthDate),
      deathDate ? formatDate(deathDate) : null,
      lifePathNumber,
      isMoralPerson,
    ];

    const personResult = await pool.query(personQuery, personValues);
    const personId = personResult.rows[0].id;

    // Step 4: Insert categories (if any)
    if (selectedCategories && selectedCategories.length > 0) {
      const categoryQuery = `
        INSERT INTO person_categories (person_id, category_id)
        SELECT $1, unnest($2::int[]);
      `;
      const categoryValues = [personId, selectedCategories];
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
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    let query = `
      SELECT p.id, p.first_name, p.last_name, p.description, p.birth_date, p.death_date, p.number, p.is_moral_person
      FROM persons p
      LEFT JOIN person_categories pc ON p.id = pc.person_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1 = 1
    `;
    const values: (string | number | number[])[] = [];
    let valueIndex = 1;

    // Name filter
    if (params.has("name")) {
      query += ` AND (
        p.first_name ILIKE $${valueIndex} OR 
        p.last_name ILIKE $${valueIndex} OR 
        p.description ILIKE $${valueIndex}
      )`;
      values.push(`%${params.get("name")}%`);
      valueIndex++;
    }

    // Numbers filter
    if (params.has("numbers")) {
      const numbers = params.get("numbers")!.split(",").map(Number);
      query += ` AND p.number = ANY($${valueIndex}::int[])`;
      values.push(numbers);
      valueIndex++;
    }

    // Moral person filter
    if (params.has("isMoralPerson")) {
      const isMoralPerson = Number(params.get("isMoralPerson"));

      if (isMoralPerson === 0) {
        query += ` AND p.is_moral_person = FALSE`;
      } else if (isMoralPerson === 1) {
        query += ` AND p.is_moral_person = TRUE`;
      }
    } else {
      console.log("no parameter isMoralPerson !!");
      console.log(params);
    }

    // Days filter
    if (params.has("birthDateAfter")) {
      query += ` AND p.birth_date >= $${valueIndex}::date`;
      values.push(formatDate(params.get("birthDateAfter")!));
      valueIndex++;
    }
    if (params.has("birthDateBefore")) {
      query += ` AND p.birth_date <= $${valueIndex}::date`;
      values.push(formatDate(params.get("birthDateBefore")!));
      valueIndex++;
    }

    // Death date range filter with proper date handling
    if (params.has("deathDateAfter")) {
      query += ` AND p.death_date >= $${valueIndex}::date`;
      values.push(formatDate(params.get("deathDateAfter")!));
      valueIndex++;
    }
    if (params.has("deathDateBefore")) {
      query += ` AND p.death_date <= $${valueIndex}::date`;
      values.push(formatDate(params.get("deathDateBefore")!));
      valueIndex++;
    }

    // Category filter
    if (params.has("categories")) {
      const categories = params.get("categories")!.split(",").map(Number);
      query += `
        AND EXISTS (
          SELECT 1
          FROM person_categories pc
          WHERE pc.person_id = p.id
            AND pc.category_id = ANY($${valueIndex}::int[])
        )
      `;
      values.push(categories);
      valueIndex++;
    }

    query += ` GROUP BY p.id ORDER BY p.last_name, p.first_name`;

    console.log("Query:", query);
    console.log("Values:", values);

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
