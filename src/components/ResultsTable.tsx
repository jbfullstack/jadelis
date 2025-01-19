"use client";

import type { Person } from "@/types";

interface ResultsTableProps {
  results: Person[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No results found</div>
    );
  }

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Birth Date",
      "Death Date",
      "Number",
      "Categories",
    ];
    const csvContent = [
      headers.join(","),
      ...results.map((person) =>
        [
          `${person.first_name} ${person.last_name}${
            person.description ? ` (${person.description})` : ""
          }`,
          new Date(person.birth_date).toLocaleDateString(),
          person.death_date
            ? new Date(person.death_date).toLocaleDateString()
            : "-",
          person.number,
          person.category_names?.join(";") || "-",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "person_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Results ({results.length} {results.length === 1 ? "person" : "people"}
          )
        </h2>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50 text-left">Name</th>
              <th className="p-2 border bg-gray-50 text-left">Birth Date</th>
              <th className="p-2 border bg-gray-50 text-left">Death Date</th>
              <th className="p-2 border bg-gray-50 text-center">Number</th>
              <th className="p-2 border bg-gray-50 text-left">Categories</th>
            </tr>
          </thead>
          <tbody>
            {results.map((person) => (
              <tr key={person.id}>
                <td className="p-2 border">
                  {person.first_name} {person.last_name}
                  {person.description && ` (${person.description})`}
                </td>
                <td className="p-2 border">
                  {new Date(person.birth_date).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {person.death_date
                    ? new Date(person.death_date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border text-center">{person.number}</td>
                <td className="p-2 border">
                  {person.category_names?.join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
