"use client";

import { PersonForm } from "@/components/PersonForm";

export default function CreatePersonPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mb-8">
        Enregistrer une personne
      </h1>
      <PersonForm />
    </main>
  );
}
