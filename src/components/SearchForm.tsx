"use client";

import { useState, FormEvent, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import type { SearchData } from "@/types";
import { DateRange } from "react-day-picker";
import { Spinner } from "./ui/Spinner";

interface SearchFormProps {
  onSearch?: (data: SearchData) => void;
}

interface PersonResult {
  id: number;
  first_name: string;
  last_name: string;
  description?: string;
  birth_date?: string;
  death_date?: string;
  number: number;
}

const lifePathOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 28, 33];

export const SearchForm = ({}: SearchFormProps) => {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    numbers: [],
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{
    [superCategory: string]: { id: number; name: string }[];
  }>({});
  const [results, setResults] = useState<PersonResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
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

    const queryParams = new URLSearchParams();

    if (searchData.name) queryParams.append("name", searchData.name);
    if (searchData.numbers.length > 0)
      queryParams.append("numbers", searchData.numbers.join(","));
    if (searchData.birthDateRange?.from)
      queryParams.append(
        "birthDateAfter",
        searchData.birthDateRange.from.toISOString()
      );
    if (searchData.birthDateRange?.to)
      queryParams.append(
        "birthDateBefore",
        searchData.birthDateRange.to.toISOString()
      );
    if (searchData.deathDateRange?.from)
      queryParams.append(
        "deathDateAfter",
        searchData.deathDateRange.from.toISOString()
      );
    if (searchData.deathDateRange?.to)
      queryParams.append(
        "deathDateBefore",
        searchData.deathDateRange.to.toISOString()
      );
    if (searchData.selectedCategories.length > 0)
      queryParams.append(
        "categories",
        searchData.selectedCategories.map(String).join(",")
      );

    try {
      const response = await fetch(`/api/person?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results || []);
        setError(null);
      } else {
        setResults([]);
        setError("No results found.");
      }
    } catch (err) {
      console.error("Error fetching persons:", err);
      setResults([]);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleNumber = (num: number) => {
    const isSelected = searchData.numbers.includes(num);
    const updatedNumbers = isSelected
      ? searchData.numbers.filter((n) => n !== num)
      : [...searchData.numbers, num];
    setSearchData({ ...searchData, numbers: updatedNumbers });
  };

  const handleDateSelect = (
    date: Date | undefined,
    type: "birth" | "death",
    mode: "from" | "to"
  ) => {
    const key = `${type}DateRange` as keyof SearchData;
    const currentRange = searchData[key] as DateRange | undefined;

    const updatedRange =
      mode === "from"
        ? { from: date || undefined, to: currentRange?.to || undefined }
        : { from: currentRange?.from || undefined, to: date || undefined };

    setSearchData({
      ...searchData,
      [key]: updatedRange,
    });
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range) return "Non spécifiée";
    const from = range.from
      ? new Date(range.from).toLocaleDateString()
      : "Début non spécifié";
    const to = range.to
      ? new Date(range.to).toLocaleDateString()
      : "Fin non spécifiée";
    return `${from} - ${to}`;
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchData.name}
          onChange={(e) =>
            setSearchData({ ...searchData, name: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-800 border-gray-600"
        />

        {/* Life Path Numbers */}
        <div>
          <label className="block mb-2">Numéros de chemin de vie</label>
          <div className="flex flex-wrap gap-2">
            {lifePathOptions.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => toggleNumber(num)}
                className={`px-4 py-2 rounded-full border ${
                  searchData.numbers.includes(num)
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-orange-400`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-2 gap-6">
          {/* Birth Date */}
          <div>
            <label className="block mb-2">Plage de dates de naissance</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Après le</label>
                <Calendar
                  mode="single"
                  selected={searchData.birthDateRange?.from || undefined}
                  onSelect={(date) =>
                    handleDateSelect(date || undefined, "birth", "from")
                  }
                  className="rounded-md border"
                />
              </div>
              <div>
                <label className="text-sm">Avant le</label>
                <Calendar
                  mode="single"
                  selected={searchData.birthDateRange?.to || undefined}
                  onSelect={(date) =>
                    handleDateSelect(date || undefined, "birth", "to")
                  }
                  className="rounded-md border"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Dates sélectionnées : {formatDateRange(searchData.birthDateRange)}
            </p>
          </div>

          {/* Death Date */}
          <div>
            <label className="block mb-2">Plage de dates de décès</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Après le</label>
                <Calendar
                  mode="single"
                  selected={searchData.deathDateRange?.from || undefined}
                  onSelect={(date) =>
                    handleDateSelect(date || undefined, "death", "from")
                  }
                  className="rounded-md border"
                />
              </div>
              <div>
                <label className="text-sm">Avant le</label>
                <Calendar
                  mode="single"
                  selected={searchData.deathDateRange?.to || undefined}
                  onSelect={(date) =>
                    handleDateSelect(date || undefined, "death", "to")
                  }
                  className="rounded-md border"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Dates sélectionnées : {formatDateRange(searchData.deathDateRange)}
            </p>
          </div>
        </div>

        {/* Categories */}
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
        )}
      </div>
    </div>
  );
};
