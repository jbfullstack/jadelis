"use client";

import { useState, FormEvent, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import type { SearchData } from "@/types";
import { DateRange } from "react-day-picker";

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

const lifePathOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 28, 33];

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    numbers: [],
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  });

  const [categories, setCategories] = useState<{
    [superCategory: string]: { id: number; name: string }[];
  }>({});

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const toggleNumber = (num: number) => {
    const isSelected = searchData.numbers.includes(num);
    const updatedNumbers = isSelected
      ? searchData.numbers.filter((n) => n !== num) // Remove if selected
      : [...searchData.numbers, num]; // Add if not selected
    setSearchData({ ...searchData, numbers: updatedNumbers });
  };

  const handleDateSelect = (
    date: Date | undefined,
    type: "birth" | "death",
    mode: "from" | "to"
  ) => {
    const key = `${type}DateRange` as keyof SearchData;
    const currentRange = searchData[key] as DateRange | undefined; // Explicit assertion

    const updatedRange =
      mode === "from"
        ? { from: date || undefined, to: currentRange?.to || undefined }
        : { from: currentRange?.from || undefined, to: date || undefined };

    setSearchData({
      ...searchData,
      [key]: updatedRange,
    });
  };

  const formatDateRange = (range: DateRange | null | undefined) => {
    if (!range?.from && !range?.to) return "Non spécifiée";
    const from = range?.from
      ? new Date(range.from).toLocaleDateString()
      : "Début non spécifié";
    const to = range?.to
      ? new Date(range.to).toLocaleDateString()
      : "Fin non spécifiée";
    return `${from} - ${to}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      {/* Name Search */}
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchData.name}
        onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
        className="w-full p-2 border rounded bg-gray-800 border-gray-600"
      />

      {/* Life Path Number Multi-Select Chips */}
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

      <div className="grid grid-cols-2 gap-6">
        {/* Birth Date Range */}
        <div>
          <label className="block mb-2">Plage de dates de naissance</label>
          <div className="grid grid-cols-2 gap-4">
            {/* "After" (From) Calendar */}
            <div>
              <label className="block text-sm mb-2">Après le</label>
              <Calendar
                mode="single"
                selected={searchData.birthDateRange?.from || undefined}
                onSelect={(date) =>
                  handleDateSelect(date || undefined, "birth", "from")
                }
                className="rounded-md border"
              />
              <p className="mt-2 text-sm text-gray-400">
                {searchData.birthDateRange?.from
                  ? `Date sélectionnée : ${new Date(
                      searchData.birthDateRange.from
                    ).toLocaleDateString()}`
                  : "Non spécifiée"}
              </p>
            </div>

            {/* "Before" (To) Calendar */}
            <div>
              <label className="block text-sm mb-2">Avant le</label>
              <Calendar
                mode="single"
                selected={searchData.birthDateRange?.to || undefined}
                onSelect={(date) =>
                  handleDateSelect(date || undefined, "birth", "to")
                }
                className="rounded-md border"
              />
              <p className="mt-2 text-sm text-gray-400">
                {searchData.birthDateRange?.to
                  ? `Date sélectionnée : ${new Date(
                      searchData.birthDateRange.to
                    ).toLocaleDateString()}`
                  : "Non spécifiée"}
              </p>
            </div>
          </div>
        </div>

        {/* Death Date Range */}
        <div>
          <label className="block mb-2">Plage de dates de décès</label>
          <div className="grid grid-cols-2 gap-4">
            {/* "After" (From) Calendar */}
            <div>
              <label className="block text-sm mb-2">Après le</label>
              <Calendar
                mode="single"
                selected={searchData.deathDateRange?.from || undefined}
                onSelect={(date) =>
                  handleDateSelect(date || undefined, "death", "from")
                }
                className="rounded-md border"
              />
              <p className="mt-2 text-sm text-gray-400">
                {searchData.deathDateRange?.from
                  ? `Date sélectionnée : ${new Date(
                      searchData.deathDateRange.from
                    ).toLocaleDateString()}`
                  : "Non spécifiée"}
              </p>
            </div>

            {/* "Before" (To) Calendar */}
            <div>
              <label className="block text-sm mb-2">Avant le</label>
              <Calendar
                mode="single"
                selected={searchData.deathDateRange?.to || undefined}
                onSelect={(date) =>
                  handleDateSelect(date || undefined, "death", "to")
                }
                className="rounded-md border"
              />
              <p className="mt-2 text-sm text-gray-400">
                {searchData.deathDateRange?.to
                  ? `Date sélectionnée : ${new Date(
                      searchData.deathDateRange.to
                    ).toLocaleDateString()}`
                  : "Non spécifiée"}
              </p>
            </div>
          </div>
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Rechercher
      </button>
    </form>
  );
};
