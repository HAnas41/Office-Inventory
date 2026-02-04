"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddAssetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const token = user?.token;
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "Laptop",
    serialNumber: "",
    brand: "",
    model: "",
    purchaseDate: "",
    condition: "Good",
    status: "Available",
    assignedTo: "",
    location: ""
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");

  // Fetch users for assignment dropdown
  useEffect(() => {
    if (!token || !user || (user.role !== "admin" && user.role !== "manager")) {
      setLoadingUsers(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Error fetching users:", errorData.message || `HTTP ${res.status}`);
          setLoadingUsers(false);
          return;
        }

        const data = await res.json();
        setUsers(data.data || data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [token, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Prepare form data, removing assignedTo if user is viewer or if not assigned
      let submitData = { ...formData };

      // For viewer role, don't send assignedTo field
      if (user && user.role === "viewer") {
        delete submitData.assignedTo;
      }

      // If assignedTo is empty, set it to null or exclude it
      if (!submitData.assignedTo) {
        submitData.assignedTo = null;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || data.error || `Failed to add asset (${res.status})`;
        setError(errorMessage);
        return;
      }

      router.push("/assets");
    } catch (err) {
      console.error("Add asset error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Asset</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Asset Name *</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Asset Type *</label>
          <select
            name="assetType"
            value={formData.assetType}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Printer">Printer</option>
            <option value="Router">Router</option>
            <option value="Chair">Chair</option>
            <option value="Table">Table</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Serial Number *</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purchase Date *</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Only show assignedTo dropdown for Admin and Manager */}
        {user && (user.role === "admin" || user.role === "manager") && (
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            {loadingUsers ? (
              <div className="w-full border p-2 rounded bg-gray-100 text-gray-500">
                Loading users...
              </div>
            ) : (
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Unassigned</option>
                {users.map((usr) => (
                  <option key={usr._id} value={usr._id}>
                    {usr.name} ({usr.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {/* For Viewer role, show assignedTo as read-only */}
        {user && user.role === "viewer" && (
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <input
              type="text"
              value="Not available for viewers"
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Asset
          </button>
          <a
            href="/assets"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}