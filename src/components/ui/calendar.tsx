import { DayPicker, DayPickerProps } from "react-day-picker";
import { fr } from "date-fns/locale";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 text-white opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm relative p-0 h-8 w-8",
        day: "h-8 w-8 p-0 font-normal text-white hover:bg-slate-500 rounded-md",
        day_selected:
          "bg-orange-500 text-black font-bold hover:bg-orange-600 hover:text-black focus:bg-orange-600 focus:text-black rounded-md",
        day_today: "bg-orange-400 text-white rounded-md",
        day_outside: "text-slate-500 opacity-50",
        day_disabled: "text-slate-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-orange-500 aria-selected:text-white",
        day_hidden: "invisible",
        dropdown: "bg-black text-white border border-orange-500 rounded p-1",
        ...classNames,
      }}
      captionLayout="dropdown"
      {...props}
      fromYear={1900}
      toYear={2025}
    />
  );
}
