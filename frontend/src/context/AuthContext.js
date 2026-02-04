"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // Validate token hasn't expired by attempting to use it
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } else {
        setUser({ token, role });
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    if (userData.token && userData.user && userData.user.role) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.user.role);
      setUser({ token: userData.token, role: userData.user.role });
      router.push("/dashboard");
    } else {
      console.error("Invalid login data received:", userData);
      throw new Error("Invalid login data received from server");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    router.push("/login");
  };

  // Method to update token (useful for refresh scenarios)
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      // Extract role from token payload if needed
      try {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        if (payload.role) {
          localStorage.setItem("role", payload.role);
          setUser(prev => ({ ...prev, token: newToken, role: payload.role }));
        } else {
          setUser(prev => ({ ...prev, token: newToken }));
        }
      } catch (e) {
        console.warn("Could not extract role from token:", e);
        setUser(prev => ({ ...prev, token: newToken }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);