"use client";
/**
 * Plan page: builds a simple study plan using saved preferences.
 *
 * Data
 * - Reads `studyit_prefs` and writes `studyit_plan` to localStorage.
 * - `PlanItem`: `{ topic, type, day }` where `type` is one of `review|flashcards|quiz`.
 *
 * Logic
 * - Deterministically converts first 3 subjects into a short two-day plan.
 */

import { useEffect, useState } from "react";

/** User preferences driving the plan generator. */
type Pref = { subjects: string; goal: string; style: string; level: string };
/** Single scheduled learning unit to display in the UI. */
type PlanItem = { topic: string; type: "review" | "flashcards" | "quiz"; day: number };

const PREF_KEY = "studyit_prefs";
const PLAN_KEY = "studyit_plan";

export default function Plan() {
  const [plan, setPlan] = useState<PlanItem[]>([]);

  /**
   * Build a small plan from the provided preferences.
   * @param p Preferences containing a comma-separated `subjects` list.
   * @returns Array of `PlanItem`s spanning review, flashcards, and quiz.
   */
  function buildPlan(p: Pref): PlanItem[] {
    const subjects = (p.subjects || "General")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const topics = subjects.slice(0, 3); // cap to 3 to keep UI readable
    const out: PlanItem[] = [];
    topics.forEach((t, i) => {
      out.push({ topic: t, type: "review", day: i + 1 });
      out.push({ topic: t, type: "flashcards", day: i + 1 });
      out.push({ topic: t, type: "quiz", day: i + 2 });
    });
    return out;
  }

  // Hydrate on first render from either saved plan or prefs.
  // Preference hydration occurs only when there is no existing plan.
  useEffect(() => {
    const rawPlan = localStorage.getItem(PLAN_KEY);
    if (rawPlan) {
      setPlan(JSON.parse(rawPlan));
      return;
    }
    const rawPref = localStorage.getItem(PREF_KEY);
    if (rawPref) {
      const p = JSON.parse(rawPref) as Pref;
      const built = buildPlan(p);
      setPlan(built);
      localStorage.setItem(PLAN_KEY, JSON.stringify(built));
    }
  }, []);

  return (
    <section>
      <h1 className="mb-3 text-2xl font-semibold">Study Plan</h1>

      {plan.length === 0 && (
        <p className="text-sm text-gray-600">
          No plan yet. Set your subjects in <a className="underline" href="/preferences">Preferences</a>.
        </p>
      )}

      <ul className="space-y-2">
        {plan.map((it, idx) => (
          <li key={idx} className="rounded-2xl bg-white p-3 shadow">
            <div className="text-sm text-gray-500">Day {it.day}</div>
            <div className="font-medium">{it.topic}</div>
            <div className="text-sm">{it.type}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
