import { Calendar } from "./calendar";

type DateFieldProps = {
  label: string;
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

export const DateField = ({
  label,
  selectedDate,
  onSelect,
}: DateFieldProps) => (
  <div>
    <label className="block mb-2">{label}</label>
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      className="border border-gray-600 rounded"
    />
    {selectedDate && (
      <p className="mt-2 text-sm text-gray-400">
        Date sélectionnée : {new Date(selectedDate).toLocaleDateString()}
      </p>
    )}
  </div>
);
