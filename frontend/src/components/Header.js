"use client";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div>
        <h1 className="font-semibold text-lg">Dashboard</h1>
        <p className="text-sm text-gray-500 capitalize">
          Logged in as: {user?.role}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
      >
        Logout
      </button>
    </header>
  );
}