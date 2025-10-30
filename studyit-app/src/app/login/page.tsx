"use client";
/**
 * Login page (public).
 *
 * UX
 * - Single-field email login for demo; no password.
 *
 * Flow
 * - On submit: persist email via `AuthProvider` → redirect `/dashboard`.
 */

import { useAuth } from "@/components/AuthProvider";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const { user, login } = useAuth();
  // Pre-fill input when user exists (useful if they navigated back)
  const [email, setEmail] = useState(user?.email ?? "");

  /** Submit handler to sign in with email and navigate to dashboard. */
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return; // simple guard
    login(email.trim());
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
          Sign in
        </button>
      </form>
    </div>
  );
}
