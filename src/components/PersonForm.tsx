"use client";

import { useState, FormEvent } from "react";
import { FormField } from "./ui/FormField";
import { DateField } from "./ui/DateField";
import { CategoriesSelector } from "./ui/CategorySelector";
import { ErrorList } from "./ui/ErrorList";
import { ConfirmationModal } from "./ui/ConfirmationModal";
import type { Match, PersonData } from "@/types";
import CheckboxField from "./ui/CheckboxField";
import { useCategories } from "../hooks/useCategories";

export const PersonForm = () => {
  const { cachedCategories: categories, categoriesLoading } = useCategories();

  const [formData, setFormData] = useState<PersonData>({
    firstName: "",
    lastName: "",
    description: "",
    isMoralPerson: false,
    birthDate: undefined,
    deathDate: undefined,
    selectedCategories: [],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!formData.firstName && !formData.lastName && !formData.description) {
      validationErrors.push(
        "Veuillez renseigner au moins un champ parmi Nom, Prénom ou Description."
      );
    }
    if (!formData.birthDate) {
      validationErrors.push("La date de naissance est obligatoire.");
    }
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, confirm: false }),
      });
      const data = await response.json();

      if (response.status === 409 && data.matches?.length > 0) {
        setMatches(data.matches);
        setShowConfirmation(true);
      } else if (response.ok) {
        alert("Person saved successfully!");
        resetForm();
      } else {
        alert(`Failed to save person: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleConfirmSave = async () => {
    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, confirm: true }),
      });

      if (response.ok) {
        alert("Person saved successfully!");
        resetForm();
      } else {
        const data = await response.json();
        alert(`Failed to save person: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during confirmation save:", error);
      alert("An unexpected error occurred while saving.");
    }
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
    setMatches([]);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      description: "",
      isMoralPerson: false,
      birthDate: undefined,
      deathDate: undefined,
      selectedCategories: [],
    });
    setMatches([]);
    setShowConfirmation(false);
  };

  const formatDate = (date?: Date): string =>
    date ? new Date(date).toLocaleDateString() : "Non spécifiée";

  return (
    <div className="space-y-6 mx-auto max-w-4xl px-4 text-white">
      {categoriesLoading && (
        <div className="text-center py-4">Chargement des catégories...</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && <ErrorList errors={errors} />}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 sm:items-center">
          <div className="sm:col-span-4">
            <FormField
              label="Nom"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(value) =>
                setFormData({ ...formData, lastName: value })
              }
            />
          </div>
          <div className="sm:col-span-4">
            <FormField
              label="Prénom"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(value) =>
                setFormData({ ...formData, firstName: value })
              }
            />
          </div>
          <div className="sm:col-span-2 sm:flex sm:items-center sm:justify-center">
            <CheckboxField
              label="Morale"
              value={formData.isMoralPerson}
              onChange={(checked) =>
                setFormData({ ...formData, isMoralPerson: checked })
              }
              title="Une personne morale désigne une entité juridique, comme une entreprise, une association ou une organisation, qui possède des droits et des obligations distincts de ceux des individus qui la composent."
              className="sm:relative sm:top-3"
            />
          </div>
        </div>

        <FormField
          label="Description"
          placeholder="Description"
          value={formData.description ?? ""}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <DateField
              label="Date de naissance"
              selectedDate={formData.birthDate}
              onSelect={(date) => {
                console.log("PersonForm receiving birthdate:", date);
                setFormData({ ...formData, birthDate: date || undefined });
              }}
            />
            <p className="mt-2 text-sm text-gray-400">
              Date sélectionnée : {formatDate(formData.birthDate)}
            </p>
          </div>
          <div>
            <DateField
              label="Date de décès"
              selectedDate={formData.deathDate}
              onSelect={(date) =>
                setFormData({ ...formData, deathDate: date || undefined })
              }
            />
            <p className="mt-2 text-sm text-gray-400">
              Date sélectionnée : {formatDate(formData.deathDate)}
            </p>
          </div>
        </div>

        {!categoriesLoading && (
          <CategoriesSelector
            categories={categories}
            selectedCategories={formData.selectedCategories}
            onCategoryChange={(id, selected) => {
              const updatedCategories = selected
                ? [...formData.selectedCategories, id]
                : formData.selectedCategories.filter((catId) => catId !== id);
              setFormData({
                ...formData,
                selectedCategories: updatedCategories,
              });
            }}
          />
        )}

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Enregistrer la personne
        </button>
      </form>
      {showConfirmation && (
        <ConfirmationModal
          matches={matches}
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
};
