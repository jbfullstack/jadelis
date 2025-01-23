"use client";

import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsTable } from "@/components/ResultsTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SearchData, Person } from "@/types";

export default function SearchPersonPage() {
  const [searchResults, setSearchResults] = useState<Person[] | null>(null);

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
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }

      return data;
    } catch (error) {
      console.error("Error fetching persons:", error);
      setSearchResults([]);
      return { success: false, results: [] };
    }
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        color: "#fff",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#1a1a1a",
          padding: "2rem",
          borderRadius: 8,
          //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Rechercher une personne
        </h1>
        <SearchForm onSearch={handleSearch} />
        {searchResults &&
          Array.isArray(searchResults) &&
          searchResults.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <button
                  onClick={() => handleDownload("csv")}
                  style={{
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Télécharger CSV
                </button>
                <button
                  onClick={() => handleDownload("pdf")}
                  style={{
                    background: "#f53b57",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Télécharger PDF
                </button>
              </div>
              <ResultsTable results={searchResults} />
            </>
          )}
      </div>
    </div>
  );
}
