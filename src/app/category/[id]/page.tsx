"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: { id: string };
}

interface SuperCategory {
  id: number;
  name: string;
}

export default function CategoryDetailPage({ params }: Props) {
  const router = useRouter();
  const categoryId = parseInt(params.id, 10);

  const [name, setName] = useState("");
  const [superCats, setSuperCats] = useState<SuperCategory[]>([]);
  const [linkedIds, setLinkedIds] = useState<number[]>([]);

  useEffect(() => {
    // 1) get category => name
    fetch(`/api/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName(data.category.name);
        } else {
          alert("Category not found.");
          router.push("/category");
        }
      })
      .catch(console.error);

    // 2) get all supercategories
    fetch("/api/supercategories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuperCats(data.data); // data.data = array of {id,name}
        }
      })
      .catch(console.error);

    // 3) get linked supercats
    fetch(`/api/categories/link?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLinkedIds(data.linked);
        }
      })
      .catch(console.error);
  }, [categoryId, router]);

  // PATCH => update name
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Updated!");
      } else {
        alert("Update failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  }

  // DELETE => remove category
  async function handleDelete() {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        alert("Deleted!");
        router.push("/category");
      } else {
        alert("Delete failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  }

  // link/unlink checkbox
  async function toggleLink(superCategoryId: number, isLinked: boolean) {
    try {
      if (isLinked) {
        // unlink => DELETE /api/categories/link
        await fetch("/api/categories/link", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, superCategoryId }),
        });
        setLinkedIds((prev) => prev.filter((id) => id !== superCategoryId));
      } else {
        // link => POST /api/categories/link
        await fetch("/api/categories/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, superCategoryId }),
        });
        setLinkedIds((prev) => [...prev, superCategoryId]);
      }
    } catch (err) {
      console.error("Error toggling link:", err);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", padding: "2rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", color: "#f0f0f0" }}>
        <button
          onClick={() => router.push("/category")}
          style={{
            marginBottom: "1rem",
            background: "#444",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          &larr; Back to Categories
        </button>

        <div
          style={{
            background: "#2c2c2c",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Edit Category #{categoryId}</h1>

          {/* Update form */}
          <form onSubmit={handleUpdate} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #555",
                  borderRadius: 4,
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
                Save
              </button>
            </div>
          </form>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            style={{
              background: "red",
              border: "none",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>

        <div
          style={{
            background: "#2c2c2c",
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Link with SuperCategories</h2>
          {superCats.map((sc) => {
            const checked = linkedIds.includes(sc.id);
            return (
              <div key={sc.id} style={{ marginBottom: "0.5rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleLink(sc.id, checked)}
                    style={{ transform: "scale(1.2)" }}
                  />
                  <span>{sc.name}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
