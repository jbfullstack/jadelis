"use client";

import { useState, FormEvent } from "react";
import { Spinner } from "./ui/Spinner";
import { SearchFormInput } from "./ui/SearchFormInput";
import { LifePathSelector } from "./ui/LifePathSelector";
import { DateRangeFilter } from "./ui/DateRangeFilter";
import { CategorySelector } from "./ui/CategorySelector";
import type { SearchData } from "@/types";

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    numbers: [],
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSearch(searchData); // Ensure the search process is awaited
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false); // Ensure spinner is hidden even if an error occurs
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
        <CategorySelector
          categories={{
            // Temporary mock until dynamic categories are fetched in the parent
            Science: [{ id: 1, name: "Informatique" }],
          }}
          selectedCategories={searchData.selectedCategories}
          onCategoryChange={(id, selected) => {
            const updatedCategories = selected
              ? [...searchData.selectedCategories, id]
              : searchData.selectedCategories.filter((catId) => catId !== id);
            setSearchData({
              ...searchData,
              selectedCategories: updatedCategories,
            });
          }}
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Rechercher
        </button>
      </form>
    </div>
  );
};
