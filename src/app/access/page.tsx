"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const AccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/"; // Default to home if no redirect path
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (data.success) {
      document.cookie = `access_code=${code}; path=/;`; // Save the validated code as a cookie
      router.push(redirectTo); // Redirect to the intended page
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#f0f0f0",
      }}
    >
      <form
        onSubmit={handleAccess}
        style={{
          padding: "2rem",
          borderRadius: "8px",
          background: "#2c2c2c",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Restricted Access</h1>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter access code"
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #555",
            background: "#333",
            color: "#f0f0f0",
            width: "100%",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default function AccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccessPageContent />
    </Suspense>
  );
}
