"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: { id: string };
}

export default function SuperCategoryDetailPage({ params }: Props) {
  const router = useRouter();
  const scId = parseInt(params.id, 10);
  const [name, setName] = useState("");

  // fetch one superCategory
  useEffect(() => {
    fetch(`/api/supercategories/${scId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setName(data.superCategory.name);
        } else {
          alert("Not found!");
          router.push("/supercategory");
        }
      })
      .catch(console.error);
  }, [scId, router]);

  // update name
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/supercategories/${scId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Updated!");
      router.push("/supercategory");
    } else {
      alert("Failed: " + (json.error || "Unknown error"));
    }
  }

  // delete supercategory
  async function handleDelete() {
    if (!confirm("Delete this superCategory?")) return;
    const res = await fetch(`/api/supercategories/${scId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      alert("Deleted!");
      router.push("/supercategory");
    } else {
      alert("Delete failed: " + (json.error || "Unknown error"));
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
          maxWidth: 600,
          margin: "0 auto",
          background: "#2c2c2c",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
        <button
          onClick={() => router.push("/supercategory")}
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
          &larr; Back
        </button>

        <h1 style={{ marginTop: 0 }}>Edit SuperCategory #{scId}</h1>
        <form onSubmit={handleUpdate} style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Save
            </button>
          </div>
        </form>

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
    </div>
  );
}
