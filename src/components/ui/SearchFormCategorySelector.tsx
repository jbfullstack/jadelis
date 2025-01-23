import React, { useState } from "react";
import { Search } from "lucide-react";
import type { SearchData } from "@/types";
import { SharedCategorySelector } from "./SharedCategorySelector";

interface SearchFormCategorySelectorProps {
  categories: Record<string, { id: number; name: string }[]>;
  searchData: SearchData;
  setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
}

export const SearchFormCategorySelector: React.FC<
  SearchFormCategorySelectorProps
> = ({ categories, searchData, setSearchData }) => {
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSearchData((prev) => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, categoryId]
        : prev.selectedCategories.filter((id) => id !== categoryId),
    }));
  };

  return (
    <SharedCategorySelector
      categories={categories}
      selectedCategories={searchData.selectedCategories}
      onCategoryChange={handleCategoryChange}
    />
  );
};

export default SearchFormCategorySelector;
