"use client";

import { useState } from "react";
import { PersonForm } from "@/components/PersonForm";
import { SearchForm } from "@/components/SearchForm";
import { ResultsTable } from "@/components/ResultsTable";
import type { SearchData, Person } from "@/types";

export default function PersonPage() {
  const [searchResults, setSearchResults] = useState<Person[] | null>(null);

  const [isPersonFormExpanded, setPersonFormExpanded] = useState(true); // For "Enregistrer une personne"
  const [isSearchFormExpanded, setSearchFormExpanded] = useState(false); // For "Rechercher"

  const handleSearch = async (searchData: SearchData) => {
    try {
      const queryParams = new URLSearchParams();

      if (searchData.name) queryParams.append("name", searchData.name);
      if (searchData.numbers.length) {
        queryParams.append("numbers", searchData.numbers.join(","));
      }

      if (searchData.birthDateRange?.from) {
        queryParams.append(
          "birthDateAfter",
          searchData.birthDateRange.from.toISOString()
        );
      }
      if (searchData.birthDateRange?.to) {
        queryParams.append(
          "birthDateBefore",
          searchData.birthDateRange.to.toISOString()
        );
      }
      if (searchData.deathDateRange?.from) {
        queryParams.append(
          "deathDateAfter",
          searchData.deathDateRange.from.toISOString()
        );
      }
      if (searchData.deathDateRange?.to) {
        queryParams.append(
          "deathDateBefore",
          searchData.deathDateRange.to.toISOString()
        );
      }

      const response = await fetch(`/api/person?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();

      if (Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults(null); // Réinitialiser les résultats en cas d'erreur
    }
  };

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Life Path Database
      </h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Section: Enregistrer une personne */}
        <section>
          <h2
            className="text-2xl font-semibold mb-4 cursor-pointer select-none flex items-center"
            onClick={() => setPersonFormExpanded(!isPersonFormExpanded)}
          >
            {isPersonFormExpanded ? "▼" : "➤"} Enregistrer une personne
          </h2>
          {isPersonFormExpanded && <PersonForm />}
        </section>

        {/* Section: Rechercher */}
        <section>
          <h2
            className="text-2xl font-semibold mb-4 cursor-pointer select-none flex items-center"
            onClick={() => setSearchFormExpanded(!isSearchFormExpanded)}
          >
            {isSearchFormExpanded ? "▼" : "➤"} Rechercher
          </h2>
          {isSearchFormExpanded && (
            <>
              <SearchForm onSearch={handleSearch} />
              {searchResults && Array.isArray(searchResults) && (
                <ResultsTable results={searchResults} />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
