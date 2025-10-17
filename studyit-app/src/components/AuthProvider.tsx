"use client";
/**
 * Minimal AuthProvider with localStorage-backed session.
 *
 * Responsibilities
 * - Persist a simple `{ email }` user object in `localStorage` under key `studyit_user`.
 * - Expose `login` and `logout` actions to consumers via React context.
 * - Hydrate initial session state on first client render.
 *
 * Exports
 * - `AuthProvider`: React provider that supplies the auth context to children.
 * - `useAuth`: Hook to consume the auth context.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

/** Represents the authenticated user payload stored in localStorage. */
type User = { email: string } | null;

/** Contract for the authentication context. */
type Ctx = {
  /** Current user, or `null` when signed out. */
  user: User;
  /** Sign in with an email; persists to localStorage and updates state. */
  login: (email: string) => void;
  /** Sign out; clears localStorage and navigates to `/login`. */
  logout: () => void;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  login: () => {},
  logout: () => {},
});

/**
 * Hook to access the authentication context.
 * @returns Current user and auth actions `login` and `logout`.
 */
export const useAuth = () => useContext(AuthCtx);

/**
 * Provides authentication context to the subtree.
 * Handles client-only hydration from localStorage.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("studyit_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  /**
   * Log in with the provided email.
   * @param email Email address to persist as the current user.
   */
  const login = (email: string) => {
    const u = { email };
    if (typeof window !== "undefined") {
      localStorage.setItem("studyit_user", JSON.stringify(u));
      setUser(u);
    }
  };

  /**
   * Log out and redirect to `/login`.
   * Clears the persisted user from localStorage and state.
   */
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("studyit_user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
