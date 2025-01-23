import { Calendar } from "./calendar";
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
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Force une nouvelle date avec le fuseau horaire local en ajoutant l'offset
      const offset = date.getTimezoneOffset();
      const localDate = new Date(
        date.getTime() + offset * 60 * 1000 + 24 * 60 * 60 * 1000
      );
      console.log("Original selected date:", date);
      console.log("Timezone offset:", offset);
      console.log("Adjusted local date:", localDate);
      onSelect(localDate);
    } else {
      onSelect(undefined);
    }
  };

  return (
    <div className="calendar-container">
      <h3 className="calendar-title">{label}</h3>
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleDateSelect}
        classNames={{
          day_selected: "bg-blue-600 text-white hover:bg-blue-700",
        }}
      />
    </div>
  );
};
