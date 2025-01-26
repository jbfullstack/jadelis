import type { Person } from "@/types"; // Adjust the path if needed

export const ResultsTable = ({ results }: { results: Person[] | null }) => {
  // Check if `results` is empty
  if (!results || results.length === 0) {
    return <p className="text-gray-300">Aucun résultat trouvé.</p>;
  }

  return (
    <div>
      {/* Ajout du compteur de résultats */}
      <div className="mb-4 text-gray-300">
        {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
        {results.length > 1 ? "s" : ""}
      </div>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr>
            <th className="border border-gray-700 px-4 py-2">Nom</th>
            <th className="border border-gray-700 px-4 py-2">Prénom</th>
            <th className="border border-gray-700 px-4 py-2">Description</th>
            <th className="border border-gray-700 px-4 py-2">
              Date de naissance
            </th>
            <th className="border border-gray-700 px-4 py-2">Date de décès</th>
            <th className="border border-gray-700 px-4 py-2">Chemin de vie</th>
          </tr>
        </thead>
        <tbody>
          {results.map((person) => (
            <tr key={person.id}>
              <td className="border border-gray-700 px-4 py-2">
                {person.last_name}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {person.first_name}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {person.description}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {new Date(person.birth_date).toLocaleDateString()}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {person.death_date
                  ? new Date(person.death_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {person.number}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
