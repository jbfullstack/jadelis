"use client";

import { useState, FormEvent } from "react";
import type { PersonData } from "@/types";
import { Calendar } from "./ui/calendar";

interface Category {
  id: number;
  name: string;
  superCategory?: string;
}

export const PersonForm = () => {
  const [formData, setFormData] = useState<PersonData>({
    firstName: "",
    lastName: "",
    surname: "",
    birthDate: undefined,
    deathDate: undefined,
    selectedCategories: [],
  });

  const [matches, setMatches] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories: Category[] = [
    { id: 1, name: "pop", superCategory: "musique" },
    { id: 2, name: "metal", superCategory: "musique" },
    { id: 3, name: "mma", superCategory: "sport" },
  ];

  const categoriesData = categories.reduce((acc, cat) => {
    const key = cat.superCategory ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsChecking(true);

    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate
            ? formData.birthDate.toISOString()
            : null,
          deathDate: formData.deathDate
            ? formData.deathDate.toISOString()
            : null,
          confirm: false,
        }),
      });

      const data = await response.json();

      if (data.matches?.length > 0) {
        setMatches(data.matches);
      } else if (response.ok) {
        alert("Person saved successfully!");
        resetForm();
      } else {
        alert(`Failed to save person: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsChecking(false);
    }
  }

  async function handleConfirmSave() {
    setIsSaving(true);

    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate
            ? formData.birthDate.toISOString()
            : null,
          deathDate: formData.deathDate
            ? formData.deathDate.toISOString()
            : null,
          confirm: true,
        }),
      });

      if (response.ok) {
        alert("Person saved successfully!");
        resetForm();
      } else {
        const data = await response.json();
        alert(`Failed to save person: ${data.error}`);
      }
    } catch (error) {
      console.error("Error forcing save:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setFormData({
      firstName: "",
      lastName: "",
      surname: "",
      birthDate: undefined,
      deathDate: undefined,
      selectedCategories: [],
    });
    setMatches([]);
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl px-4 text-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full p-2 border rounded bg-gray-800 border-gray-600"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full p-2 border rounded bg-gray-800 border-gray-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Birth Date */}
          <div>
            <label className="block mb-2">Birth Date</label>
            <Calendar
              mode="single"
              selected={formData.birthDate}
              onSelect={(date) => setFormData({ ...formData, birthDate: date })}
              className="border border-gray-600 rounded"
            />
            {formData.birthDate && (
              <p className="mt-2 text-sm text-gray-400">
                Selected Date:{" "}
                {new Date(formData.birthDate).toLocaleDateString()}
              </p>
            )}
          </div>
          {/* Death Date */}
          <div>
            <label className="block mb-2">Death Date</label>
            <Calendar
              mode="single"
              selected={formData.deathDate}
              onSelect={(date) => setFormData({ ...formData, deathDate: date })}
              className="border border-gray-600 rounded"
            />
            {formData.deathDate && (
              <p className="mt-2 text-sm text-gray-400">
                Selected Date:{" "}
                {new Date(formData.deathDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700"
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Save Person"}
        </button>
      </form>

      {matches.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-bold">Potential Matches</h3>
          <ul className="mt-4 space-y-2">
            {matches.map((person) => (
              <li key={person.id} className="p-2 border rounded bg-gray-700">
                {person.first_name} {person.last_name} -{" "}
                {new Date(person.birth_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setMatches([])}
              className="p-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel Save
            </button>
            <button
              onClick={handleConfirmSave}
              className="p-2 bg-red-600 rounded hover:bg-red-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Anyway"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
