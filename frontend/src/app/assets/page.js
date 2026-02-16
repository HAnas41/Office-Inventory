"use client";

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import API_URL from "@/utils/api";

export default function AssetsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const token = user?.token;
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/assets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Error fetching assets:", errorData.message || `HTTP ${res.status}`);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAssets(data.data || data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        setLoading(false);
      });
  }, [token]);

  const handleEdit = (assetId) => {
    router.push(`/assets/edit/${assetId}`);
  };

  const handleDelete = async (assetId) => {
    if (!confirm("Are you sure you want to delete this asset?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/assets/${assetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setAssets(assets.filter(asset => asset._id !== assetId));
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to delete asset");
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Error deleting asset");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Assets</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assets</h1>
        {user.role === "admin" && (
          <a
            href="/assets/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Asset
          </a>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Serial</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Assigned To</th>
              {(user.role === "admin" || user.role === "manager") && (
                <th className="p-2 border">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id}>
                <td className="p-2 border">{asset.assetName}</td>
                <td className="p-2 border">{asset.assetType}</td>
                <td className="p-2 border">{asset.serialNumber}</td>
                <td className="p-2 border">{asset.brand}</td>
                <td className="p-2 border">{asset.model}</td>
                <td className="p-2 border">{asset.condition}</td>
                <td className="p-2 border">{asset.status}</td>
                <td className="p-2 border">{asset.location || "-"}</td>
                <td className="p-2 border">
                  {asset.assignedTo?.name || "-"}
                </td>

                {(user.role === "admin" || user.role === "manager") && (
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(asset._id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {assets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No assets found
          </div>
        )}
      </div>
    </div>
  );
}