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
      <h1 className="text-xl font-semibold">Subjects & Preferences</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {/* Comma-separated list to keep it simple */}
        <input
          className="w-full rounded border p-2"
          placeholder="Subjects (e.g., Math, CS, Stats)"
          value={pref.subjects}
          onChange={(e) => setPref({ ...pref, subjects: e.target.value })}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Goal (e.g., Exam on Nov 10, target A-)"
          value={pref.goal}
          onChange={(e) => setPref({ ...pref, goal: e.target.value })}
        />

        <select
          className="w-full rounded border p-2"
          value={pref.style}
          onChange={(e) => setPref({ ...pref, style: e.target.value })}
        >
          <option value="visual">Visual</option>
          <option value="reading">Reading/Writing</option>
          <option value="auditory">Auditory</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>

        <select
          className="w-full rounded border p-2"
          value={pref.level}
          onChange={(e) => setPref({ ...pref, level: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button className="rounded bg-black px-4 py-2 text-white">Save</button>
      </form>
    </section>
  );
}
