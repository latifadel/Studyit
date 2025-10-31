"use client";

// FR #1: When the user clicks on the button to "create an account", the system shall display the user interface to create an account.

import { useAuth } from "@/components/AuthProvider";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const success = signup(email.trim(), password);
    
    if (!success) {
      setError("An account with this email already exists");
      return;
    }

    alert("Account created successfully! Please log in.");
    window.location.href = "/login";
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>
      
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-purple-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
