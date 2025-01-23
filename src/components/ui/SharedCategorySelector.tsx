// src/components/ui/SharedCategorySelector.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import type { SearchData } from "@/types";

interface Category {
  id: number;
  name: string;
}

type SharedCategorySelectorProps = {
  categories: Record<string, Category[]>;
  selectedCategories: number[];
  onCategoryChange: (categoryId: number, checked: boolean) => void;
};

export const SharedCategorySelector: React.FC<SharedCategorySelectorProps> = ({
  categories = {},
  selectedCategories = [],
  onCategoryChange,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (superCategory: string) => {
    setExpandedCategories((prev) =>
      prev.includes(superCategory)
        ? prev.filter((cat) => cat !== superCategory)
        : [...prev, superCategory]
    );
  };

  const filterCategories = () => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchTerm) return Object.entries(categories);

    return Object.entries(categories).filter(
      ([superCategory, categoryList]) => {
        const matchingSuperCategory = superCategory
          .toLowerCase()
          .includes(searchLower);
        const matchingCategories = categoryList.some((category) =>
          category.name.toLowerCase().includes(searchLower)
        );
        return matchingSuperCategory || matchingCategories;
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filterCategories().map(([superCategory, categoryList]) => (
          <div key={superCategory} className="bg-gray-800 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleExpand(superCategory)}
            >
              <h3 className="text-lg font-semibold text-gray-200">
                {superCategory}
              </h3>
              <button className="text-gray-400 hover:text-gray-200">
                {expandedCategories.includes(superCategory) ? "−" : "+"}
              </button>
            </div>

            {expandedCategories.includes(superCategory) && (
              <div className="space-y-2 pl-2">
                {categoryList
                  .filter(
                    (category) =>
                      !searchTerm ||
                      category.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) =>
                          onCategoryChange(category.id, e.target.checked)
                        }
                        className="h-4 w-4 border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="text-gray-200">{category.name}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
