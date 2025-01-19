// src/components/SearchForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Calendar } from "./ui/calendar";
import type { SearchData } from "@/types";
import { DateRange } from "react-day-picker";

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    number: "",
    birthDateRange: null,
    deathDateRange: null,
    selectedCategories: [],
  });

  // Helper functions to convert between null and undefined
  const dateRangeOrUndefined = (
    date: DateRange | null
  ): DateRange | undefined => date ?? undefined;
  const dateRangeOrNull = (date: DateRange | undefined): DateRange | null =>
    date ?? null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchData.name}
        onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Life Path Number"
        value={searchData.number}
        onChange={(e) =>
          setSearchData({ ...searchData, number: e.target.value })
        }
        className="w-full p-2 border rounded"
        min="1"
        max="33"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Birth Date Range</label>
          <Calendar
            mode="range"
            selected={dateRangeOrUndefined(searchData.birthDateRange)}
            onSelect={(range) =>
              setSearchData({
                ...searchData,
                birthDateRange: dateRangeOrNull(range),
              })
            }
            className="rounded-md border"
            numberOfMonths={2}
          />
        </div>

        <div>
          <label className="block mb-2">Death Date Range</label>
          <Calendar
            mode="range"
            selected={dateRangeOrUndefined(searchData.deathDateRange)}
            onSelect={(range) =>
              setSearchData({
                ...searchData,
                deathDateRange: dateRangeOrNull(range),
              })
            }
            className="rounded-md border"
            numberOfMonths={2}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};
