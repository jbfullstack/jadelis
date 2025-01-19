import { DateRange } from "react-day-picker";

export interface SearchData {
  name?: string;
  number?: string;
  birthDateRange: DateRange | null;
  deathDateRange: DateRange | null;
  selectedCategories: number[];
}

export interface PersonData {
  firstName: string;
  lastName: string;
  surname?: string;
  birthDate: Date | undefined; // Changed from Date | null
  deathDate: Date | undefined; // Changed from Date | null
  selectedCategories: number[];
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  surname?: string;
  birth_date: string;
  death_date?: string;
  number: number;
  category_names: string[];
}
