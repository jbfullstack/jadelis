import type { DateRange as ReactDayPickerDateRange } from "react-day-picker";

export type DateRange = ReactDayPickerDateRange;

export interface SearchData {
  name: string;
  numbers: number[];
  birthDays: number[];
  birthDateRange?: DateRange; // Use optional
  deathDateRange?: DateRange; // Use optional
  selectedCategories: number[];
}

export interface PersonData {
  firstName: string;
  lastName: string;
  description?: string;
  birthDate: Date | undefined; // Changed from Date | null
  deathDate: Date | undefined; // Changed from Date | null
  selectedCategories: number[];
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  description: string; // Assurez-vous que `description` est obligatoire
  birth_date: string;
  death_date: string | null;
  number: number;
}

export interface PersonResult {
  id: number;
  first_name: string;
  last_name: string;
  description?: string;
  birth_date?: string;
  death_date?: string;
  number: number;
}

export interface Match {
  id: number;
  first_name: string;
  last_name: string;
  description?: string; // Optionnel si une description peut être absente
  birth_date: string; // Ou `Date` selon vos données
}
