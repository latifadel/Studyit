"use client";

// FR #0: When the user clicks the link, the system shall display the Login page.

import { useAuth } from "@/components/AuthProvider";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    const success = login(email.trim(), password);
    
    if (!success) {
      setError("Invalid email or password");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>
      
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
          Sign in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:text-purple-600 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
