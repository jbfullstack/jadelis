// src/components/ui/CategoriesSelector.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { SharedCategorySelector } from "./SharedCategorySelector";

interface CategorySelectorProps {
  categories: Record<string, { id: number; name: string }[]>;
  selectedCategories: number[];
  onCategoryChange: (categoryId: number, isSelected: boolean) => void;
}

export const CategoriesSelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <SharedCategorySelector
      categories={categories}
      selectedCategories={selectedCategories}
      onCategoryChange={onCategoryChange}
    />
  );
};
