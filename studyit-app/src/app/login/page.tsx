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
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full rounded bg-black p-2 text-white">Sign in</button>
      </form>
    </div>
  );
}
