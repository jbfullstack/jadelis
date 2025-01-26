import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { computeLifePathNumber } from "@/utils/numberCalculator";

export async function POST() {
  try {
    // 1. Récupérer seulement les personnes avec un nombre manquant
    const selectQuery = `
      SELECT id, birth_date
      FROM persons
      WHERE number IS NULL;
    `;
    const persons = await pool.query(selectQuery);

    // 2. Pour chaque personne, calculer le nouveau nombre
    const updates = await Promise.all(
      persons.rows.map(async (person) => {
        const newNumber = computeLifePathNumber(person.birth_date);

        // Mettre à jour chaque personne individuellement
        const updateQuery = `
          UPDATE persons 
          SET number = $1 
          WHERE id = $2;
        `;
        return pool.query(updateQuery, [newNumber, person.id]);
      })
    );

    return NextResponse.json({
      success: true,
      updatedCount: updates.length,
    });
  } catch (error) {
    console.error("Error recalculating missing numbers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to recalculate missing numbers" },
      { status: 500 }
    );
  }
}
