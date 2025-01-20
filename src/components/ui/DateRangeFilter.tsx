import React from "react";
import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  label: string;
  range?: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  range,
  onChange,
}) => {
  const handleDateSelect = (date: Date | undefined, mode: "from" | "to") => {
    const updatedRange: DateRange = {
      from: mode === "from" ? date || undefined : range?.from,
      to: mode === "to" ? date || undefined : range?.to,
    };
    onChange(updatedRange);
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range) return "Non spécifiée";
    const from = range.from
      ? new Date(range.from).toLocaleDateString()
      : "Début non spécifié";
    const to = range.to
      ? new Date(range.to).toLocaleDateString()
      : "Fin non spécifiée";
    return `${from} - ${to}`;
  };

  return (
    <div>
      <label className="block mb-2">{label}</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Après le</label>
          <Calendar
            mode="single"
            selected={range?.from || undefined}
            onSelect={(date) => handleDateSelect(date, "from")}
            className="rounded-md border"
          />
        </div>
        <div>
          <label className="text-sm">Avant le</label>
          <Calendar
            mode="single"
            selected={range?.to || undefined}
            onSelect={(date) => handleDateSelect(date, "to")}
            className="rounded-md border"
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Dates sélectionnées : {formatDateRange(range)}
      </p>
    </div>
  );
};
