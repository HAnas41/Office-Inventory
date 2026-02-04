"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Effect to redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </main>
    );
  }

  if (user) {
    // If user is logged in, they will be redirected by the effect above
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-2xl font-semibold">Redirecting to dashboard...</div>
      </main>
    );
  }

  // Show login/signup options if user is not logged in
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Inventory System</h1>
        <p className="text-gray-600 mb-8">Manage your office assets efficiently</p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Login
          </a>

          <a
            href="/signup"
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}