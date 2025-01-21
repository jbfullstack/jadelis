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

  // Category name for editing
  const [name, setName] = useState("");

  // Full list of super-categories (for checkboxes)
  const [superCats, setSuperCats] = useState<SuperCategory[]>([]);

  // The IDs of the super-categories currently linked to this category
  const [linkedSuperCats, setLinkedSuperCats] = useState<number[]>([]);

  // 1) fetch the single category (name)
  // 2) fetch all super-categories
  // 3) fetch which are linked
  useEffect(() => {
    // Get category /api/categories/:id
    fetch(`/api/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName(data.category.name);
        } else {
          alert("Category not found!");
          router.push("/category");
        }
      })
      .catch(console.error);

    // Get all supercategories /api/supercategories
    fetch("/api/supercategories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // data.data might be {success: true, data: []}
          setSuperCats(data.data);
        }
      })
      .catch(console.error);

    // Get which supercats are linked to this category
    fetch(`/api/categories/link?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // data.linked => array of IDs
          setLinkedSuperCats(data.linked);
        }
      })
      .catch(console.error);
  }, [categoryId, router]);

  // Update the category name
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Updated!");
        router.push("/category");
      } else {
        alert("Update failed: " + (data.error || "unknown error"));
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }

  // Delete the category
  async function handleDelete() {
    if (!confirm("Delete category?")) return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Deleted!");
        router.push("/category");
      } else {
        alert("Delete failed: " + (data.error || "unknown error"));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  // Toggle link/unlink when user checks or unchecks a box
  async function toggleLink(superCatId: number, isCurrentlyLinked: boolean) {
    try {
      if (isCurrentlyLinked) {
        // Unlink
        await fetch("/api/categories/link", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, superCategoryId: superCatId }),
        });
        // remove from local state
        setLinkedSuperCats((prev) => prev.filter((id) => id !== superCatId));
      } else {
        // Link
        await fetch("/api/categories/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, superCategoryId: superCatId }),
        });
        // add to local state
        setLinkedSuperCats((prev) => [...prev, superCatId]);
      }
    } catch (error) {
      console.error("Error toggling link:", error);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Edit Category #{categoryId}</h1>
      <form onSubmit={handleUpdate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
        <button type="submit">Save</button>
      </form>

      <button onClick={handleDelete}>Delete</button>

      <hr />

      <h2>Link with SuperCategories</h2>
      {superCats.map((sc) => {
        const isLinked = linkedSuperCats.includes(sc.id);
        return (
          <div key={sc.id}>
            <label>
              <input
                type="checkbox"
                checked={isLinked}
                onChange={() => toggleLink(sc.id, isLinked)}
              />
              {sc.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
