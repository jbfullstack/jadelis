type CategorySelectorProps = {
  categories: Record<string, { id: number; name: string }[]>;
  selectedCategories: number[];
  onCategoryChange: (categoryId: number, isSelected: boolean) => void;
};

export const CategorySelector = ({
  categories,
  selectedCategories,
  onCategoryChange,
}: CategorySelectorProps) => (
  <div>
    <label className="block mb-2">Catégories</label>
    <div className="border border-gray-600 rounded p-4 max-h-[300px] overflow-y-auto">
      {Object.entries(categories).map(([superCategory, categoryList]) => (
        <div key={superCategory} className="mb-4">
          <h3 className="text-lg font-semibold">{superCategory}</h3>
          {categoryList.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) =>
                  onCategoryChange(category.id, e.target.checked)
                }
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  </div>
);
