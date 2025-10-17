"use client";
/**
 * Dashboard: primary hub after login.
 *
 * Data
 * - Reads `studyit_stats` from localStorage: `{ streak, sessions, quizzes }`.
 *
 * UI
 * - KPI cards + quick links to core features.
 */

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = { streak: number; sessions: number; quizzes: number };
const STATS_KEY = "studyit_stats";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ streak: 0, sessions: 0, quizzes: 0 });

  // Hydrate stats from localStorage on first render
  useEffect(() => {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) setStats(JSON.parse(raw));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-600">Signed in as {user?.email}</p>

      {/* KPI Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Streak" val={stats.streak} />
        <Card title="Study Sessions" val={stats.sessions} />
        <Card title="Quizzes Taken" val={stats.quizzes} />
      </div>

      {/* Quick access navigation */}
      <div className="grid gap-3 md:grid-cols-3">
        <QuickLink href="/preferences" label="Subjects & Preferences" />
        <QuickLink href="/plan" label="Create Plan" />
        <QuickLink href="/flashcards" label="Flashcards" />
        <QuickLink href="/quiz" label="New Quiz" />
        <QuickLink href="/tutor" label="Ask AI Tutor" />
        <QuickLink href="/performance" label="Performance" />
      </div>
    </section>
  );
}

/** Small UI helper for KPI tiles. */
function Card({ title, val }: { title: string; val: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-semibold">{val}</div>
    </div>
  );
}

/** Small UI helper for dash links. */
function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-white p-4 shadow hover:bg-gray-50">
      {label}
    </Link>
  );
}
