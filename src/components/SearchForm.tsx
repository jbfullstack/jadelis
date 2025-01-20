"use client";

import { useState, useEffect, FormEvent } from "react";
import { Spinner } from "./ui/Spinner";
import { SearchFormInput } from "./ui/SearchFormInput";
import { LifePathSelector } from "./ui/LifePathSelector";
import { DaySelector } from "./ui/DaySelector";
import { DateRangeFilter } from "./ui/DateRangeFilter";
import type { SearchData } from "@/types";

interface Category {
  id: number;
  name: string;
}

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const initialSearchData: SearchData = {
    name: "",
    numbers: [],
    birthDays: [],
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  };

  const [searchData, setSearchData] = useState<SearchData>(initialSearchData);

  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState(false);

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

    try {
      await onSearch(searchData); // Await search process to ensure spinner hides correctly
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchData(initialSearchData);
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        <button
          type="button"
          onClick={handleReset}
          className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset filters
        </button>
        <SearchFormInput
          value={searchData.name}
          onChange={(name) => setSearchData({ ...searchData, name })}
        />
        <LifePathSelector
          selected={searchData.numbers}
          onChange={(numbers) => setSearchData({ ...searchData, numbers })}
        />
        <DaySelector
          selectedDays={searchData.birthDays} // Pass birthDays as selectedDays
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
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rechercher
          </button>
        </div>
      </form>
    </div>
  );
};
