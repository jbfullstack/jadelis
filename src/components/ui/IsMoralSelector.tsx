interface IsMoralSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const IsMoralSelector: React.FC<IsMoralSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="isMoralSelector"
        className="block text-sm font-medium text-gray-200"
      >
        Type de personne
      </label>
      <select
        id="isMoralSelector"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))} // Ensure value is a number
        className="block w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
      >
        <option value={-1}>Les deux</option>
        <option value={0}>Physique</option>
        <option value={1}>Moral</option>
      </select>
    </div>
  );
};
