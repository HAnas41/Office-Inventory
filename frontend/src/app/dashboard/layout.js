"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "viewer"]}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex flex-col flex-1 ml-64">
          <Header />
          <main className="p-6 bg-gray-100 flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}