"use client";

import { useState, FormEvent } from "react";
import type { PersonData } from "@/types";
import { Calendar } from "./ui/calendar";

interface Category {
  id: number;
  name: string;
  superCategory?: string;
}

interface PersonFormProps {
  onSubmit: (data: PersonData) => void;
}

export const PersonForm = ({ onSubmit }: PersonFormProps) => {
  const [formData, setFormData] = useState<PersonData>({
    firstName: "",
    lastName: "",
    surname: "",
    birthDate: undefined,
    deathDate: undefined,
    selectedCategories: [],
  });

  const categories: Category[] = [
    { id: 1, name: "pop", superCategory: "musique" },
    { id: 2, name: "metal", superCategory: "musique" },
    { id: 3, name: "mma", superCategory: "sport" },
    // Add more categories...
  ];

  // Group categories by `superCategory`
  const categoriesData = categories.reduce((acc, cat) => {
    const key = cat.superCategory ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  // Define the missing handleSubmit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Person saved:", data);
        alert("Person saved successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          surname: "",
          birthDate: undefined,
          deathDate: undefined,
          selectedCategories: [],
        });
      } else {
        const error = await response.json();
        console.error("Error saving person:", error);
        alert(`Failed to save person: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mx-auto max-w-4xl px-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-[#fad6a5]">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full p-2 bg-transparent border border-[#fad6a5] rounded text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-[#fad6a5]">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full p-2 bg-transparent border border-[#fad6a5] rounded text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-[#fad6a5]">Surname</label>
        <input
          type="text"
          value={formData.surname}
          onChange={(e) =>
            setFormData({ ...formData, surname: e.target.value })
          }
          className="w-full p-2 bg-transparent border border-[#fad6a5] rounded text-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block mb-2 text-[#fad6a5]">Birth Date</label>
          <div className="border border-[#fad6a5] rounded p-1">
            <Calendar
              mode="single"
              selected={formData.birthDate}
              onSelect={(date) => setFormData({ ...formData, birthDate: date })}
              initialFocus
            />
          </div>
          {formData.birthDate && (
            <p className="mt-2 text-sm text-[#fad6a5]">
              Selected Date: {formData.birthDate.toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block mb-2 text-[#fad6a5]">Death Date</label>
          <div className="border border-[#fad6a5] rounded p-1">
            <Calendar
              mode="single"
              selected={formData.deathDate}
              onSelect={(date) => setFormData({ ...formData, deathDate: date })}
              disabled={!formData.birthDate}
              fromDate={formData.birthDate ?? undefined}
            />
          </div>
          {formData.deathDate && (
            <p className="mt-2 text-sm text-[#fad6a5]">
              Selected Date: {formData.deathDate.toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block mb-2 text-[#fad6a5]">Categories</label>
          <div className="border border-[#fad6a5] rounded p-4 max-h-[300px] overflow-y-auto">
            {Object.entries(categoriesData).map(([superCat, cats]) => (
              <div key={superCat} className="mb-4">
                <h3 className="text-[#fad6a5] font-medium mb-2">{superCat}</h3>
                <div className="space-y-2 ml-4">
                  {cats.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.selectedCategories, cat.id]
                            : formData.selectedCategories.filter(
                                (id) => id !== cat.id
                              );
                          setFormData({
                            ...formData,
                            selectedCategories: newCategories,
                          });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 border-[#fad6a5]"
                      />
                      <span className="text-white">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Save Person
      </button>
    </form>
  );
};
