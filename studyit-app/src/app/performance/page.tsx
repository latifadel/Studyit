"use client";
/**
 * Performance page: small analytics snapshot.
 * Data
 * - Reads "studyit_stats": { streak, sessions, quizzes }.
 * UI
 * - KPI tiles; charts can be added later.
 *
 * FR #13: When the user clicks Performance, the system shall display analytics.
 */

import { useEffect, useState } from "react";
const STATS_KEY = "studyit_stats";

type Stats = { streak: number; sessions: number; quizzes: number };

export default function Performance() {
  const [stats, setStats] = useState<Stats>({ streak: 0, sessions: 0, quizzes: 0 });

  // Hydrate from localStorage once on client
  useEffect(() => {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) setStats(JSON.parse(raw));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Performance</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <Card label="Current Streak" value={stats.streak} />
        <Card label="Total Sessions" value={stats.sessions} />
        <Card label="Quizzes Completed" value={stats.quizzes} />
      </div>

      <p className="text-sm text-gray-700">
        Future work: add trend charts and strengths/weaknesses by topic.
      </p>
    </section>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
