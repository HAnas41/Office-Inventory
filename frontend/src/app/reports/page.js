"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ReportsPage() {
  const { user } = useAuth();
  const token = user?.token;
  const [reports, setReports] = useState({
    byCategory: [],
    byLocation: [],
    damaged: [],
    lowStock: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const [categoryRes, locationRes, damagedRes, lowStockRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/assets-by-category`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/assets-by-location`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/damaged-assets`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/low-stock`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const reportsData = {};

        if (categoryRes.status === 'fulfilled') {
          const categoryData = await categoryRes.value.json();
          reportsData.byCategory = categoryData.data || categoryData;
        }

        if (locationRes.status === 'fulfilled') {
          const locationData = await locationRes.value.json();
          reportsData.byLocation = locationData.data || locationData;
        }

        if (damagedRes.status === 'fulfilled') {
          const damagedData = await damagedRes.value.json();
          reportsData.damaged = damagedData.data || damagedData;
        }

        if (lowStockRes.status === 'fulfilled') {
          const lowStockData = await lowStockRes.value.json();
          reportsData.lowStock = lowStockData.data || lowStockData;
        }

        setReports(reportsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (user.role !== "admin" && user.role !== "manager") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <p className="text-gray-500">Access denied. Reports are available to Admin and Manager roles only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Reports</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Assets by Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Count</th>
              </tr>
            </thead>
            <tbody>
              {reports.byCategory.length > 0 ? (
                reports.byCategory.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item._id}</td>
                    <td className="p-2 border">{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-2 border text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Assets by Location</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Count</th>
              </tr>
            </thead>
            <tbody>
              {reports.byLocation.length > 0 ? (
                reports.byLocation.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item._id || "Unassigned"}</td>
                    <td className="p-2 border">{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-2 border text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Damaged Assets</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Asset Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Serial Number</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {reports.damaged.length > 0 ? (
                reports.damaged.map((asset) => (
                  <tr key={asset._id}>
                    <td className="p-2 border">{asset.assetName}</td>
                    <td className="p-2 border">{asset.assetType}</td>
                    <td className="p-2 border">{asset.serialNumber}</td>
                    <td className="p-2 border">{asset.location || "Unassigned"}</td>
                    <td className="p-2 border">{asset.assignedTo?.name || "Unassigned"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 border text-center text-gray-500">
                    No damaged assets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Low Stock Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Count</th>
              </tr>
            </thead>
            <tbody>
              {reports.lowStock.length > 0 ? (
                reports.lowStock.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item._id}</td>
                    <td className="p-2 border">{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-2 border text-center text-gray-500">
                    No low stock items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}