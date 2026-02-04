"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CategoriesPage() {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check if user is admin before making API call
        if (!user || user.role !== "admin") {
          setLoading(false);
          return;
        }

        if (!token) {
          setError("Authentication error: No token available");
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setError("Failed to load categories: " + (errorData.message || `HTTP ${res.status}`));
          setCategories([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCategories(data.data || data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories: Network error");
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, user]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Authentication error: No token available");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || data.error || `Failed to add category (${res.status})`;
        setError(errorMessage);
        return;
      }

      setCategories([...categories, data.data || data]);
      setNewCategory({ name: "", description: "" });
    } catch (err) {
      setError(err.message || "Network error. Please check your connection and try again.");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    if (!token) {
      setError("Authentication error: No token available");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError("Failed to delete category: " + (errorData.message || `HTTP ${res.status}`));
        return;
      }

      setCategories(categories.filter(cat => cat._id !== id));
    } catch (err) {
      setError("Failed to delete category: Network error");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <p className="text-gray-500">Access denied. Category management is available to Admin role only.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleAddCategory} className="mb-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-3">Add New Category</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={newCategory.description}
            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">{cat.description || "-"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}