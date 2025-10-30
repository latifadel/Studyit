"use client";
/**
 * Settings page.
 *
 * Data
 * - localStorage key: `studyit_settings`.
 * - Shape: `{ notif: boolean, difficulty: "easy" | "medium" | "hard" }`.
 *
 * Behavior
 * - Save settings locally; allow logout via `AuthProvider`.
 */

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";

const KEY = "studyit_settings";

export default function Settings() {
  const { user, logout } = useAuth();
  const [notif, setNotif] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");

  // Load saved settings (if any)
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      setNotif(!!s.notif);
      setDifficulty(s.difficulty ?? "medium");
    }
  }, []);

  /** Persist current settings to localStorage. */
  function save() {
    localStorage.setItem(KEY, JSON.stringify({ notif, difficulty }));
    alert("Settings saved.");
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="text-sm font-medium text-gray-700">Signed in as {user?.email}</div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={notif}
            onChange={(e) => setNotif(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-900">Enable reminders/notifications</span>
        </div>

        <div className="mt-3">
          <label className="mr-2 text-sm font-medium text-gray-700">Default Difficulty</label>
          <select
            className="rounded border border-gray-300 p-2 text-gray-900"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={save} className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
            Save
          </button>
          <button onClick={logout} className="rounded-lg bg-red-600 px-6 py-2 text-white font-medium hover:bg-red-700 shadow-md hover:shadow-lg transition-all">
            Log out
          </button>
        </div>
      </div>
    </section>
  );
}
