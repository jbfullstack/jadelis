"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function CategoryPage() {
  // groupedCategories => { [superCatName: string]: Category[] }
  const [groupedCategories, setGroupedCategories] = useState<
    Record<string, Category[]>
  >({});
  const [newName, setNewName] = useState("");

  useEffect(() => {
    refetchCategories();
  }, []);

  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  function refetchCategories() {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGroupedCategories(data.categories);
        }
      })
      .catch(console.error);
  }

  // Create category
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Category created!");
        setNewName("");
        refetchCategories();
      } else {
        alert("Create failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Optional inline delete
  async function handleDelete(categoryId: number) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Deleted!");
        refetchCategories();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction pour recalculer tous les nombres
  async function handleRecalculateAll() {
    if (!confirm("Recalculer tous les nombres ?")) return;

    try {
      const res = await fetch("/api/person/recalculate-all", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert(`${data.updatedCount} nombres ont été recalculés !`);
        refetchCategories(); // Rafraîchir la liste si nécessaire
      } else {
        alert("Échec du recalcul : " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors du recalcul");
    }
  }

  // Fonction pour recalculer les nombres manquants
  async function handleRecalculateMissing() {
    if (!confirm("Recalculer les nombres manquants ?")) return;

    try {
      const res = await fetch("/api/person/recalculate-missing", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert(`${data.updatedCount} nombres manquants ont été recalculés !`);
        refetchCategories(); // Rafraîchir la liste si nécessaire
      } else {
        alert("Échec du recalcul : " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors du recalcul");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        color: "#f0f0f0",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "#2c2c2c",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Categories (Grouped by SuperCategory)</h1>

        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Premier bouton sur sa propre ligne */}
          <div>
            <button
              type="submit"
              style={{
                background: "#207020",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("/supercategory")}
            >
              ➢ Super Categories
            </button>
          </div>

          {/* Les deux nouveaux boutons sur la même ligne */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleRecalculateAll}
              style={{
                background: "#704020",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Recalculer tous les nombres
            </button>

            <button
              onClick={handleRecalculateMissing}
              style={{
                background: "#602040",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Recalculer les nombres manquants
            </button>
          </div>
        </div>

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
        >
          <input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #555",
              background: "#333",
              color: "#f0f0f0",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#0070f3",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>

        {/* Render grouped categories */}
        {Object.keys(groupedCategories).map((superCat) => (
          <div key={superCat} style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                margin: "1rem 0 0.5rem",
                borderBottom: "1px solid #444",
                paddingBottom: "0.25rem",
              }}
            >
              {superCat}
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#444", color: "#fff" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedCategories[superCat].map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: "1px solid #555" }}>
                    <td style={{ padding: "0.5rem" }}>{cat.id}</td>
                    <td style={{ padding: "0.5rem" }}>{cat.name}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <a
                        href={`/category/${cat.id}`}
                        style={{
                          color: "#00bfff",
                          textDecoration: "underline",
                          marginRight: "1rem",
                        }}
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{
                          background: "red",
                          border: "none",
                          color: "#fff",
                          padding: "0.3rem 0.6rem",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
