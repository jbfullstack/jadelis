"use client";

import { useState } from "react";
import { PersonForm } from "@/components/PersonForm";
import { SearchForm } from "@/components/SearchForm";
import { ResultsTable } from "@/components/ResultsTable";
import type { SearchData, Person } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PersonPage() {
  const [searchResults, setSearchResults] = useState<Person[] | null>(null);
  const [isPersonFormExpanded, setPersonFormExpanded] = useState(true); // For "Enregistrer une personne"
  const [isSearchFormExpanded, setSearchFormExpanded] = useState(false); // For "Rechercher"

  const handleDownload = (format: "csv" | "pdf") => {
    if (!searchResults) return; // If no results, don't proceed

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "Nom",
        "Prénom",
        "Description",
        "Date de naissance",
        "Date de décès",
        "Chemin de vie",
      ];
      const rows = searchResults.map((result) => [
        result.last_name || "N/A",
        result.first_name || "N/A",
        result.description || "N/A",
        result.birth_date
          ? new Date(result.birth_date).toLocaleDateString()
          : "N/A",
        result.death_date
          ? new Date(result.death_date).toLocaleDateString()
          : "N/A",
        result.number || "N/A",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell
            )
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "results.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      // Generate PDF
      const doc = new jsPDF();
      const headers = [
        [
          "Nom",
          "Prénom",
          "Description",
          "Date de naissance",
          "Date de décès",
          "Chemin de vie",
        ],
      ];
      const rows = searchResults.map((result) => [
        result.last_name || "N/A",
        result.first_name || "N/A",
        result.description || "N/A",
        result.birth_date
          ? new Date(result.birth_date).toLocaleDateString()
          : "N/A",
        result.death_date
          ? new Date(result.death_date).toLocaleDateString()
          : "N/A",
        result.number || "N/A",
      ]);

      autoTable(doc, {
        head: headers,
        body: rows,
      });

      doc.save("results.pdf");
    }
  };

  const handleSearch = async (searchData: SearchData) => {
    const queryParams = new URLSearchParams();

    if (searchData.name) queryParams.append("name", searchData.name);
    if (searchData.numbers.length > 0) {
      queryParams.append("numbers", searchData.numbers.join(","));
    }
    if (searchData.birthDays.length > 0) {
      queryParams.append("birthDays", searchData.birthDays.join(","));
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
    if (searchData.selectedCategories.length > 0) {
      queryParams.append(
        "categories",
        searchData.selectedCategories.map(String).join(",")
      );
    }

    // Fetch results from the backend
    try {
      const response = await fetch(`/api/person?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      console.log("Search results:", data);

      if (data.success) {
        setSearchResults(data.results || []); // Update searchResults state
      } else {
        setSearchResults([]);
      }

      return data; // Return the response for the SearchForm component
    } catch (error) {
      console.error("Error fetching persons:", error);
      setSearchResults([]);
      return { success: false, results: [] }; // Return failure with empty results
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
                <>
                  <div className="flex justify-end space-x-4 my-4">
                    <button
                      onClick={() => handleDownload("csv")}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Télécharger CSV
                    </button>
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Télécharger PDF
                    </button>
                  </div>
                  <ResultsTable results={searchResults} />
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
