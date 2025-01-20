import React from "react";
import type { PersonResult } from "@/types";

interface ResultsDisplayProps {
  results: PersonResult[];
  error: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  error,
}) => {
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <h2 className="text-lg font-bold text-white mb-4">Résultats</h2>
      <ul className="space-y-4">
        {results.map((result) => (
          <li
            key={result.id}
            className="bg-gray-900 p-4 rounded-md shadow-md hover:bg-gray-700 w-full"
          >
            <div className="grid grid-cols-3 items-center">
              {/* Left Column: Name and Description */}
              <div>
                <p className="text-white font-semibold">
                  {result.first_name} {result.last_name}
                </p>
                <p className="text-gray-400">{result.description}</p>
              </div>
              {/* Middle Column: Dates */}
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  <strong>Naissance:</strong>{" "}
                  {result.birth_date
                    ? new Date(result.birth_date).toLocaleDateString()
                    : "Non spécifiée"}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Décès:</strong>{" "}
                  {result.death_date
                    ? new Date(result.death_date).toLocaleDateString()
                    : "Non spécifiée"}
                </p>
              </div>
              {/* Right Column: Life Path Number */}
              <div className="text-right">
                <p className="bg-orange-500 text-black font-bold text-lg rounded-full px-4 py-2 inline-block shadow-md">
                  {result.number}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
