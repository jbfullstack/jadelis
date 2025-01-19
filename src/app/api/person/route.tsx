import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Adjust the path based on your project structure

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      surname,
      birthDate,
      deathDate,
      selectedCategories,
    } = body;

    // Insert the data into the database
    const query = `
      INSERT INTO persons (first_name, last_name, surname, birth_date, death_date, categories)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      firstName,
      lastName,
      surname,
      birthDate ? new Date(birthDate) : null,
      deathDate ? new Date(deathDate) : null,
      JSON.stringify(selectedCategories), // Convert categories array to JSON
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(
      { success: true, person: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting person:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save person" },
      { status: 500 }
    );
  }
}
