"use client";
/**
 * Preferences form.
 * Data
 * - localStorage key: "studyit_prefs"
 * - Shape: { subjects, goal, style, level }
 * Behavior
 * - On submit: persist to localStorage; future pages (Plan, Quiz) can read it.
 */

import { FormEvent, useEffect, useState } from "react";

type Pref = { subjects: string; goal: string; style: string; level: string };
const PREF_KEY = "studyit_prefs";

export default function Preferences() {
  const [pref, setPref] = useState<Pref>({
    subjects: "",
    goal: "",
    style: "visual",
    level: "medium",
  });

  // Load existing prefs if present
  useEffect(() => {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) setPref(JSON.parse(raw));
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem(PREF_KEY, JSON.stringify(pref));
    alert("Preferences saved.");
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Subjects & Preferences</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subjects
          </label>
          <input
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Math, CS, Stats"
            value={pref.subjects}
            onChange={(e) => setPref({ ...pref, subjects: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal
          </label>
          <input
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Exam on Nov 10, target A-"
            value={pref.goal}
            onChange={(e) => setPref({ ...pref, goal: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Style
          </label>
          <select
            className="w-full rounded border border-gray-300 p-2 text-gray-900"
            value={pref.style}
            onChange={(e) => setPref({ ...pref, style: e.target.value })}
          >
            <option value="visual">Visual</option>
            <option value="reading">Reading/Writing</option>
            <option value="auditory">Auditory</option>
            <option value="kinesthetic">Kinesthetic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            className="w-full rounded border border-gray-300 p-2 text-gray-900"
            value={pref.level}
            onChange={(e) => setPref({ ...pref, level: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
          Save
        </button>
      </form>
    </section>
  );
}
