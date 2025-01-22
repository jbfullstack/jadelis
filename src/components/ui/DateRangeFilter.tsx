import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  label: string;
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  range,
  onChange,
}) => {
  const handleDateSelect = (date: Date | undefined, mode: "from" | "to") => {
    const updatedRange =
      mode === "from"
        ? { from: date || undefined, to: range?.to || undefined }
        : { from: range?.from || undefined, to: date || undefined };
    onChange(updatedRange);
  };

  const modifiersForFromCalendar = {
    selected: (date: Date) =>
      range?.from ? date.getTime() === range.from.getTime() : false,
  };

  const modifiersForToCalendar = {
    selected: (date: Date) =>
      range?.to ? date.getTime() === range.to.getTime() : false,
  };

  const modifiersClassNames = {
    selected: "day-selected",
  };

  return (
    <div className="calendar-container">
      <h3 className="calendar-title">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Après le</label>
          <Calendar
            mode="single"
            selected={range?.from || undefined}
            onSelect={(date) => handleDateSelect(date, "from")}
            modifiers={modifiersForFromCalendar}
            modifiersClassNames={modifiersClassNames}
          />
        </div>
        <div>
          <label className="text-sm">Avant le</label>
          <Calendar
            mode="single"
            selected={range?.to || undefined}
            onSelect={(date) => handleDateSelect(date, "to")}
            modifiers={modifiersForToCalendar}
            modifiersClassNames={modifiersClassNames}
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Dates sélectionnées :{" "}
        {range?.from
          ? `${new Date(range.from).toLocaleDateString()}`
          : "Non spécifiée"}{" "}
        -{" "}
        {range?.to
          ? `${new Date(range.to).toLocaleDateString()}`
          : "Non spécifiée"}
      </p>
    </div>
  );
};
