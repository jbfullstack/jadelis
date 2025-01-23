"use client";

import { useState, FormEvent } from "react";
import { Spinner } from "./ui/Spinner";
import { SearchFormInput } from "./ui/SearchFormInput";
import { LifePathSelector } from "./ui/LifePathSelector";
import { IsMoralSelector } from "./ui/IsMoralSelector";
import { DaySelector } from "./ui/DaySelector";
import { DateRangeFilter } from "./ui/DateRangeFilter";
import { SearchFormCategorySelector } from "./ui/SearchFormCategorySelector";
import type { SearchData } from "@/types";
import { useCategories } from "../hooks/useCategories";

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  // Utilisation du hook de catégories
  const { cachedCategories: categories, categoriesLoading } = useCategories();

  const initialSearchData: SearchData = {
    name: "",
    numbers: [],
    birthDays: [],
    isMoralPerson: -1,
    birthDateRange: undefined,
    deathDateRange: undefined,
    selectedCategories: [],
  };

  const [searchData, setSearchData] = useState<SearchData>(initialSearchData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("searchData sent to backend:", searchData);
      await onSearch(searchData);
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
      {(loading || categoriesLoading) && (
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
        <IsMoralSelector
          value={searchData.isMoralPerson}
          onChange={(value) => {
            setSearchData({ ...searchData, isMoralPerson: value });
          }}
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

        <SearchFormCategorySelector
          categories={categories}
          searchData={searchData}
          setSearchData={setSearchData}
        />

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
