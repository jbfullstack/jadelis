import React from "react";

interface LifePathSelectorProps {
  selected: number[];
  onChange: (selected: number[]) => void;
}

const lifePathOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 28, 33];

export const LifePathSelector: React.FC<LifePathSelectorProps> = ({
  selected,
  onChange,
}) => {
  const toggleNumber = (num: number) => {
    const isSelected = selected.includes(num);
    const updatedNumbers = isSelected
      ? selected.filter((n) => n !== num)
      : [...selected, num];
    onChange(updatedNumbers);
  };

  return (
    <div>
      <label className="block mb-2">Numéros de chemin de vie</label>
      <div className="flex flex-wrap gap-2">
        {lifePathOptions.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => toggleNumber(num)}
            className={`px-4 py-2 rounded-full border ${
              selected.includes(num)
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-orange-400`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
