"use client";
/**
 * AuthProvider with localStorage-backed session and account management.
 *
 * Responsibilities
 * - Persist user accounts in `localStorage` under key `studyit_accounts`.
 * - Manage current session in `studyit_user`.
 * - Expose `login`, `signup`, and `logout` actions to consumers via React context.
 * - Hydrate initial session state on first client render.
 *
 * Exports
 * - `AuthProvider`: React provider that supplies the auth context to children.
 * - `useAuth`: Hook to consume the auth context.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

/** Represents the authenticated user payload stored in localStorage. */
type User = { email: string } | null;

/** Stored account with credentials */
type Account = { email: string; password: string };

/** Contract for the authentication context. */
type Ctx = {
  /** Current user, or `null` when signed out. */
  user: User;
  /** Sign in with email and password; returns true if successful, false otherwise. */
  login: (email: string, password: string) => boolean;
  /** Create a new account; returns true if successful, false if email already exists. */
  signup: (email: string, password: string) => boolean;
  /** Sign out; clears localStorage and navigates to `/login`. */
  logout: () => void;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

/**
 * Hook to access the authentication context.
 * @returns Current user and auth actions `login`, `signup`, and `logout`.
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
   * Get all stored accounts from localStorage.
   */
  const getAccounts = (): Account[] => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("studyit_accounts");
    return raw ? JSON.parse(raw) : [];
  };

  /**
   * Save accounts to localStorage.
   */
  const saveAccounts = (accounts: Account[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("studyit_accounts", JSON.stringify(accounts));
    }
  };

  /**
   * Create a new account.
   * @param email Email address for the new account.
   * @param password Password for the new account.
   * @returns true if account created successfully, false if email already exists.
   */
  const signup = (email: string, password: string): boolean => {
    const accounts = getAccounts();
    
    if (accounts.some(acc => acc.email === email)) {
      return false;
    }
    
    accounts.push({ email, password });
    saveAccounts(accounts);
    return true;
  };

  /**
   * Log in with email and password.
   * @param email Email address to authenticate.
   * @param password Password to verify.
   * @returns true if login successful, false otherwise.
   */
  const login = (email: string, password: string): boolean => {
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (!account) {
      return false;
    }
    
    const u = { email };
    if (typeof window !== "undefined") {
      localStorage.setItem("studyit_user", JSON.stringify(u));
      setUser(u);
    }
    return true;
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

  return <AuthCtx.Provider value={{ user, login, signup, logout }}>{children}</AuthCtx.Provider>;
}
