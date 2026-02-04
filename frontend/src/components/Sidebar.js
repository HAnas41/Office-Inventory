"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const role = user.role;

  const menu = {
    admin: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assets", href: "/assets" },
      { label: "Add Asset", href: "/assets/new" },
      { label: "Manage Users", href: "/users" },
      { label: "Manage Categories", href: "/categories" },
      { label: "Reports", href: "/reports" },
    ],
    manager: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assets", href: "/assets" },
      { label: "Reports", href: "/reports" },
    ],
    viewer: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assets", href: "/assets" },
    ],
  };

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-black text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Inventory System</h2>

      <nav className="space-y-2">
        {menu[role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
              pathname === item.href
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}