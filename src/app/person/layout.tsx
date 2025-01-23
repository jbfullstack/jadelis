"use client";

import { useRouter } from "next/navigation";

export default function PersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      style={{ background: "#1a1a1a", color: "#f0f0f0", minHeight: "100vh" }}
    >
      <header
        style={{
          background: "#2c2c2c",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/person/create")}
        >
          Jadelis Life Path
        </h1>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <button
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "1rem",
              borderRadius: 4,
              transition: "background 0.3s",
            }}
            onClick={() => handleNavigation("/person/create")}
          >
            Ajouter
          </button>
          <button
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "1rem",
              borderRadius: 4,
              transition: "background 0.3s",
            }}
            onClick={() => handleNavigation("/person/search")}
          >
            Rechercher
          </button>
          <button
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "1rem",
              borderRadius: 4,
              transition: "background 0.3s",
            }}
            onClick={() => handleNavigation("/category")}
          >
            Categories
          </button>
        </nav>
      </header>
      <main
        style={{
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
