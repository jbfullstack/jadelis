interface DaySelectorProps {
  selectedDays: number[]; // Accept an array of numbers
  onChange: (days: number[]) => void; // Callback for updating selected days
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
}) => {
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleDay = (day: number) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange(updatedDays);
  };

  return (
    <div>
      <label className="block mb-2">Jours de naissance</label>
      <div className="flex flex-wrap gap-2">
        {daysOfMonth.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`px-4 py-2 rounded-full border ${
              selectedDays.includes(day)
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-orange-400`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
