"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { KPI } from "@/components/KPI";

export default function Dashboard() {
  const { user } = useAuth();
  const token = user?.token;
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    lowStock: 0,
  });

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Error fetching assets for dashboard:", errorData.message || `HTTP ${res.status}`);
            return [];
          }
          return res.json();
        }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/low-stock`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Error fetching low stock report:", errorData.message || `HTTP ${res.status}`);
            return [];
          }
          return res.json();
        })
    ]).then(([assetsRes, lowStockRes]) => {
      const assets = assetsRes.data || assetsRes || [];
      const lowStock = lowStockRes.data || lowStockRes || [];

      setStats({
        total: assets.length,
        available: assets.filter((a) => a.status === "Available").length,
        inUse: assets.filter((a) => a.status === "In Use").length,
        lowStock: Array.isArray(lowStock) ? lowStock.length : 0,
      });
    }).catch(err => {
      console.error("Error loading dashboard stats:", err);
    });
  }, [token]);

  if (!user) return null;

  // Render different dashboard based on role
  if (user.role === "admin") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPI title="Total Assets" value={stats.total} />
          <KPI title="In Stock" value={stats.available} />
          <KPI title="In Use" value={stats.inUse} />
          <KPI title="Low Stock Alerts" value={stats.lowStock} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <a
            href="/assets/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Add New Asset
          </a>
        </div>
      </div>
    );
  } else if (user.role === "manager") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPI title="Total Assets" value={stats.total} />
          <KPI title="In Stock" value={stats.available} />
          <KPI title="In Use" value={stats.inUse} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Assets Overview</h2>
          <p>View and manage assigned assets</p>
        </div>
      </div>
    );
  } else {
    // Viewer dashboard
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Assets Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <KPI title="Total Assets" value={stats.total} />
          <KPI title="Available Assets" value={stats.available} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Asset List</h2>
          <p>View all available assets</p>
        </div>
      </div>
    );
  }
}