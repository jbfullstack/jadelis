// src/hooks/useCategories.ts
import { useState, useEffect } from "react";
import { categoryCache } from "../utils/categoryCache";

interface Category {
  id: number;
  name: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Vérifier le cache d'abord
        const cachedCategories =
          categoryCache.get<Record<string, Category[]>>();

        if (cachedCategories) {
          console.log("cached categories, fetch not needed");
          setCategories(cachedCategories);
          setLoading(false);
          return;
        } else {
          console.log("no cached categories, fetch needed");
        }

        // Si pas de cache ou expiré, faire la requête API
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.success) {
          // Mettre à jour le state et le cache
          setCategories(data.categories);
          categoryCache.set(data.categories);
        } else {
          throw new Error(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    cachedCategories: categories,
    categoriesLoading: loading,
    categoriesError: error,
  };
};
