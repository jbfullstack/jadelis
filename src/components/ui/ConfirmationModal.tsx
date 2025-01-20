import React from "react";

interface ConfirmationModalProps {
  matches: Array<{
    id: number;
    first_name: string;
    last_name: string;
    description?: string;
    birth_date: string;
  }>;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  matches,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h3 className="text-lg font-bold mb-4">
        Personnes avec la même date de naissance :
      </h3>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.first_name} {match.last_name} - {match.description || "-"} -{" "}
            {match.birth_date}
          </li>
        ))}
      </ul>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={onConfirm}
          className="bg-green-600 p-2 rounded text-white hover:bg-green-700"
        >
          Enregistrer
        </button>
        <button
          onClick={onCancel}
          className="bg-red-600 p-2 rounded text-white hover:bg-red-700"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};
