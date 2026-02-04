"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Extract specific error message from backend
        const errorMessage = data.message || data.error || `Signup failed (${res.status})`;
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Validate the response data structure
      if (!data.token || !data.user || !data.user.role) {
        setError("Invalid response from server. Please contact support.");
        setIsLoading(false);
        return;
      }

      login(data);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Signup</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          value={form.name}
          disabled={isLoading}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          value={form.email}
          disabled={isLoading}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          value={form.password}
          disabled={isLoading}
        />

        <select
          name="role"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          value={form.role}
          disabled={isLoading}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>

        <button
          type="submit"
          className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}