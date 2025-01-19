"use client";

import { useState, useEffect, FormEvent } from "react";
import type { PersonData } from "@/types";
import { Calendar } from "./ui/calendar";

export const PersonForm = () => {
  const [formData, setFormData] = useState<PersonData>({
    firstName: "",
    lastName: "",
    description: "",
    birthDate: undefined,
    deathDate: undefined,
    selectedCategories: [],
  });

  const [categories, setCategories] = useState<
    Record<string, { id: number; name: string }[]>
  >({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories:", data.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const validateForm = () => {
    const validationErrors: string[] = [];

    // Au moins un des champs (nom, prénom, description) doit être renseigné
    if (!formData.firstName && !formData.lastName && !formData.description) {
      validationErrors.push(
        "Veuillez renseigner au moins un champ parmi Nom, Prénom ou Description."
      );
    }

    // La date de naissance est obligatoire
    if (!formData.birthDate) {
      validationErrors.push("La date de naissance est obligatoire.");
    }

    // La date de décès, si renseignée, ne peut pas être avant la date de naissance
    if (
      formData.deathDate &&
      formData.birthDate &&
      formData.deathDate < formData.birthDate
    ) {
      validationErrors.push(
        "La date de décès ne peut pas être avant la date de naissance."
      );
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    alert("Formulaire validé !");
  };

  return (
    <div className="space-y-6 mx-auto max-w-4xl px-4 text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block mb-2">Nom</label>
            <input
              type="text"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full p-3 border rounded bg-gray-800 border-gray-600"
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block mb-2">Prénom</label>
            <input
              type="text"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full p-3 border rounded bg-gray-800 border-gray-600"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border rounded bg-gray-800 border-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Birth Date */}
          <div>
            <label className="block mb-2">Date de naissance</label>
            <Calendar
              mode="single"
              selected={formData.birthDate}
              onSelect={(date) => setFormData({ ...formData, birthDate: date })}
              className="border border-gray-600 rounded"
            />
            {formData.birthDate && (
              <p className="mt-2 text-sm text-gray-400">
                Date sélectionnée :{" "}
                {new Date(formData.birthDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Death Date */}
          <div>
            <label className="block mb-2">Date de décès</label>
            <Calendar
              mode="single"
              selected={formData.deathDate}
              onSelect={(date) => setFormData({ ...formData, deathDate: date })}
              className="border border-gray-600 rounded"
            />
            {formData.deathDate && (
              <p className="mt-2 text-sm text-gray-400">
                Date sélectionnée :{" "}
                {new Date(formData.deathDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block mb-2">Catégories</label>
          <div className="border border-gray-600 rounded p-4 max-h-[300px] overflow-y-auto">
            {Object.entries(categories).map(([superCategory, categoryList]) => (
              <div key={superCategory} className="mb-4">
                <h3 className="text-lg font-semibold">{superCategory}</h3>
                {categoryList.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedCategories.includes(
                        category.id
                      )}
                      onChange={(e) => {
                        const selected = e.target.checked
                          ? [...formData.selectedCategories, category.id]
                          : formData.selectedCategories.filter(
                              (id) => id !== category.id
                            );
                        setFormData({
                          ...formData,
                          selectedCategories: selected,
                        });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-orange-800 rounded text-white">
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Enregistrer la personne
        </button>
      </form>
    </div>
  );
};
