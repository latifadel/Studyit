"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  preferences?: any;
} | null;

type Ctx = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => { },
});

/**
 * Hook to access the authentication context.
 * @returns {Ctx} The authentication context containing user, isAuthenticated, login, signup, and logout.
 */
export const useAuth = () => useContext(AuthCtx);

/**
 * Provider component that wraps the application and handles user authentication state.
 * Manages user session persistence and protection of routes.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load user from local storage on mount (session persistence)
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("studyit_user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (e) {
          console.error("Failed to parse user from storage", e);
          localStorage.removeItem("studyit_user");
        }
      }
    }
    setLoading(false);
  }, []);

  // Protect routes
  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/login", "/signup", "/"];
    const isPublic = publicPaths.includes(pathname);

    if (!user && !isPublic) {
      router.push("/login");
    } else if (user && (pathname === "/login" || pathname === "/signup")) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("studyit_user", JSON.stringify(data.user));
        router.push("/dashboard");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Signup error:", e);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("studyit_user", JSON.stringify(data.user));
        router.push("/dashboard");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("studyit_user");
    setUser(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
