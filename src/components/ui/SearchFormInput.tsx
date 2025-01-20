import React from "react";

interface SearchFormInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchFormInput: React.FC<SearchFormInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      placeholder="Rechercher par nom..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded bg-gray-800 border-gray-600"
    />
  );
};
