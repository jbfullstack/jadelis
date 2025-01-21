"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

export default function CategoryPage() {
  const [groupedCategories, setGroupedCategories] = useState<
    Record<string, Category[]>
  >({});
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGroupedCategories(data.categories);
        }
      })
      .catch(console.error);
  }

  // CREATE
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Created!");
        setNewName("");
        fetchCategories();
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // DELETE
  async function handleDelete(categoryId: number) {
    if (!confirm("Delete category?")) return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json(); // parse JSON
      if (data.success) {
        alert("Deleted!");
        fetchCategories();
      } else {
        alert("Delete error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <h1>Categories (Grouped by SuperCategory)</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Category"
        />
        <button type="submit">Create</button>
      </form>

      {Object.keys(groupedCategories).map((scName) => (
        <div key={scName} style={{ marginBottom: 24 }}>
          <h2 style={{ background: "#444", padding: "4px 8px" }}>{scName}</h2>
          <table style={{ width: "60%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#555" }}>
              <tr>
                <th style={{ border: "1px solid #777", padding: 8 }}>ID</th>
                <th style={{ border: "1px solid #777", padding: 8 }}>Name</th>
                <th style={{ border: "1px solid #777", padding: 8 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedCategories[scName].map((cat) => (
                <tr key={cat.id}>
                  <td style={{ border: "1px solid #777", padding: 8 }}>
                    {cat.id}
                  </td>
                  <td style={{ border: "1px solid #777", padding: 8 }}>
                    {cat.name}
                  </td>
                  <td style={{ border: "1px solid #777", padding: 8 }}>
                    <a href={`/category/${cat.id}`} style={{ marginRight: 6 }}>
                      Edit
                    </a>
                    <button onClick={() => handleDelete(cat.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
