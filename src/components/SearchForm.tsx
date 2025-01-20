"use client";

import { useState, useEffect, FormEvent } from "react";
import { Spinner } from "./ui/Spinner";
import { SearchFormInput } from "./ui/SearchFormInput";
import { LifePathSelector } from "./ui/LifePathSelector";
import { DaySelector } from "./ui/DaySelector";
import { DateRangeFilter } from "./ui/DateRangeFilter";
import type { SearchData, PersonResult } from "@/types";

interface Category {
  id: number;
  name: string;
}

interface SearchFormProps {
  onSearch: (
    data: SearchData
  ) => Promise<{ success: boolean; results: PersonResult[] }>;
  handleDownload: (format: "csv" | "pdf") => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    numbers: [],
    birthDays: [],
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  });

  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PersonResult[]>([]); // Use `PersonResult[]` as type
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from the backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories); // Update state with fetched categories
        } else {
          console.error("Failed to fetch categories:", data.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await onSearch(searchData); // Await search process to ensure spinner hides correctly
      if (response.success) {
        setResults(response.results);
      } else {
        setResults([]);
        setError("No results found.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setError("An unexpected error occurred during the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        <SearchFormInput
          value={searchData.name}
          onChange={(name) => setSearchData({ ...searchData, name })}
        />
        <LifePathSelector
          selected={searchData.numbers}
          onChange={(numbers) => setSearchData({ ...searchData, numbers })}
        />
        <DaySelector
          selectedDays={searchData.birthDays}
          onChange={(days) => setSearchData({ ...searchData, birthDays: days })}
        />
        <div className="grid grid-cols-2 gap-6">
          <DateRangeFilter
            label="Plage de dates de naissance"
            range={searchData.birthDateRange}
            onChange={(range) =>
              setSearchData({ ...searchData, birthDateRange: range })
            }
          />
          <DateRangeFilter
            label="Plage de dates de décès"
            range={searchData.deathDateRange}
            onChange={(range) =>
              setSearchData({ ...searchData, deathDateRange: range })
            }
          />
        </div>
        {/* Categories Section */}
        <div>
          <label className="block mb-2">Catégories</label>
          <div className="border border-gray-600 rounded p-4 max-h-[300px] overflow-y-auto">
            {Object.entries(categories).map(([superCategory, categoryList]) => (
              <div key={superCategory} className="mb-4">
                <h3 className="text-lg font-semibold">{superCategory}</h3>
                {categoryList.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={searchData.selectedCategories.includes(
                        category.id
                      )}
                      onChange={(e) => {
                        const selected = e.target.checked
                          ? [...searchData.selectedCategories, category.id]
                          : searchData.selectedCategories.filter(
                              (id) => id !== category.id
                            );
                        setSearchData({
                          ...searchData,
                          selectedCategories: selected,
                        });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Rechercher
        </button>
      </form>

      {/* Results Section */}
      <div className="mt-6">
        {error && <p className="text-red-500">{error}</p>}
        {results.length > 0 && (
          <div>
            <p className="text-gray-300 mb-4">
              <strong>Total Results: {results.length}</strong>
            </p>
            <div className="bg-gray-800 p-4 rounded-md">
              <h2 className="text-lg font-bold text-white mb-4">Résultats</h2>
              <ul className="space-y-4">
                {results.map((result) => (
                  <li
                    key={result.id}
                    className="bg-gray-900 p-4 rounded-md shadow-md hover:bg-gray-700 w-full"
                  >
                    <div className="grid grid-cols-3 items-center">
                      <div>
                        <p className="text-white font-semibold">
                          {result.first_name} {result.last_name}
                        </p>
                        <p className="text-gray-400">{result.description}</p>
                      </div>
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
          </div>
        )}
      </div>
    </div>
  );
};
