"use client";

import { useEffect, useState } from "react";

interface SuperCategory {
  id: number;
  name: string;
}

export default function SuperCategoryPage() {
  const [superCats, setSuperCats] = useState<SuperCategory[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    refetchSuperCats();
  }, []);

  function refetchSuperCats() {
    fetch("/api/supercategories")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSuperCats(data.data);
        }
      })
      .catch(console.error);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/supercategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Created superCategory!");
      setNewName("");
      refetchSuperCats();
    } else {
      alert("Failed: " + json.error);
    }
  }

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
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
        <h1 style={{ marginTop: 0 }}>SuperCategories</h1>

        <form
          onSubmit={handleCreate}
          style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New superCategory name"
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

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#444", color: "#fff" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {superCats.map((sc) => (
              <tr key={sc.id} style={{ borderBottom: "1px solid #555" }}>
                <td style={{ padding: "0.5rem" }}>{sc.id}</td>
                <td style={{ padding: "0.5rem" }}>{sc.name}</td>
                <td style={{ padding: "0.5rem" }}>
                  <a
                    href={`/supercategory/${sc.id}`}
                    style={{ color: "#00bfff", textDecoration: "underline" }}
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
