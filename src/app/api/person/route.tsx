// src/app/api/person/route.tsx
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { computeLifePathNumber } from "@/utils/numberCalculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, surname, birthDate, deathDate, categories } =
      body;

    // Calculate life path number
    const number = computeLifePathNumber(birthDate);

    // Check for existing person with same birthdate
    const existingPersons = await pool.query(
      "SELECT * FROM persons WHERE birth_date = $1",
      [birthDate]
    );

    if (existingPersons.rows.length > 0) {
      return NextResponse.json(
        {
          exists: true,
          matches: existingPersons.rows,
        },
        { status: 409 }
      );
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const personResult = await client.query(
        "INSERT INTO persons (first_name, last_name, surname, birth_date, death_date, number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [firstName, lastName, surname, birthDate, deathDate, number]
      );

      const personId = personResult.rows[0].id;

      for (const categoryId of categories) {
        await client.query(
          "INSERT INTO person_categories (person_id, category_id) VALUES ($1, $2)",
          [personId, categoryId]
        );
      }

      await client.query("COMMIT");
      return NextResponse.json(
        { success: true, id: personId },
        { status: 201 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const number = searchParams.get("number");
    const birthDateEquals = searchParams.get("birthDateEquals");
    const birthDateAfter = searchParams.get("birthDateAfter");
    const birthDateBefore = searchParams.get("birthDateBefore");
    const deathDateEquals = searchParams.get("deathDateEquals");
    const deathDateAfter = searchParams.get("deathDateAfter");
    const deathDateBefore = searchParams.get("deathDateBefore");
    const categories = searchParams.get("categories")?.split(",");

    let query = `
      SELECT DISTINCT p.*, 
        array_agg(c.name) as category_names
      FROM persons p
      LEFT JOIN person_categories pc ON p.id = pc.person_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1=1
    `;

    const params: (string | number | string[])[] = [];
    let paramCounter = 1;

    if (name) {
      query += ` AND (
        LOWER(p.first_name) LIKE LOWER($${paramCounter}) OR 
        LOWER(p.last_name) LIKE LOWER($${paramCounter}) OR 
        LOWER(p.surname) LIKE LOWER($${paramCounter})
      )`;
      params.push(`%${name}%`);
      paramCounter++;
    }

    if (number) {
      query += ` AND p.number = $${paramCounter}`;
      params.push(Number(number));
      paramCounter++;
    }

    if (birthDateEquals) {
      query += ` AND p.birth_date = $${paramCounter}`;
      params.push(birthDateEquals);
      paramCounter++;
    }

    if (birthDateAfter) {
      query += ` AND p.birth_date > $${paramCounter}`;
      params.push(birthDateAfter);
      paramCounter++;
    }

    if (birthDateBefore) {
      query += ` AND p.birth_date < $${paramCounter}`;
      params.push(birthDateBefore);
      paramCounter++;
    }

    if (deathDateEquals) {
      query += ` AND p.death_date = $${paramCounter}`;
      params.push(deathDateEquals);
      paramCounter++;
    }

    if (deathDateAfter) {
      query += ` AND p.death_date > $${paramCounter}`;
      params.push(deathDateAfter);
      paramCounter++;
    }

    if (deathDateBefore) {
      query += ` AND p.death_date < $${paramCounter}`;
      params.push(deathDateBefore);
      paramCounter++;
    }

    if (categories && categories.length > 0) {
      query += ` AND c.id = ANY($${paramCounter})`;
      params.push(categories);
      paramCounter++;
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
