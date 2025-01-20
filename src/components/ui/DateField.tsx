import { Calendar } from "./calendar"; // Adjust the import path based on your structure
import "./calendar.css";

interface DateFieldProps {
  label: string;
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  selectedDate,
  onSelect,
}) => {
  const modifiers = {
    selected: (date: Date) =>
      selectedDate ? date.getTime() === selectedDate.getTime() : false,
  };

  const modifiersClassNames = {
    selected: "day-selected", // Use the same class for consistency
  };

  return (
    <div className="calendar-container">
      <h3 className="calendar-title">{label}</h3>
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={onSelect}
        modifiers={modifiers} // Highlight the selected date
        modifiersClassNames={modifiersClassNames} // Apply custom class
      />
    </div>
  );
};
