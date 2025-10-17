"use client";
/**
 * Flashcards page: demo generator + session tracking.
 *
 * Data
 * - localStorage keys:
 *   - `studyit_cards`: `Card[]` where `Card = { q, a, due }`.
 *   - `studyit_stats`: `{ streak, sessions, quizzes }`.
 *
 * Behavior
 * - "Generate" creates 3 stub cards for the given topic and persists them.
 * - Each generation counts as a study session and increases streak.
 */

import { FormEvent, useEffect, useState } from "react";

/** Representation of a flashcard. */
type Card = { q: string; a: string; due: string };
const CARDS_KEY = "studyit_cards";
const STATS_KEY = "studyit_stats";

export default function Flashcards() {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<Card[]>([]);

  // Load previously generated cards
  useEffect(() => {
    const raw = localStorage.getItem(CARDS_KEY);
    if (raw) setCards(JSON.parse(raw));
  }, []);

  /**
   * Create a small set of cards for the provided topic.
   * @param t Topic to embed in generated Q/A text.
   * @returns Three flashcards with the current timestamp as `due`.
   */
  function genCards(t: string): Card[] {
    const base = t || "General";
    return [1, 2, 3].map((i) => ({
      q: `${base}: concept ${i}?`,
      a: `Definition of ${base} concept ${i}.`,
      due: new Date().toISOString(),
    }));
  }

  /** Handle form submission to generate new cards. */
  function onGenerate(e: FormEvent) {
    e.preventDefault();
    const newCards = genCards(topic);
    const all = [...newCards, ...cards];
    setCards(all);
    localStorage.setItem(CARDS_KEY, JSON.stringify(all));
    bumpSessions();
  }

  /** Update aggregate stats for dashboard/performance. */
  function bumpSessions() {
    const raw = localStorage.getItem(STATS_KEY);
    const s = raw ? JSON.parse(raw) : { streak: 0, sessions: 0, quizzes: 0 };
    s.sessions += 1;
    s.streak = Math.min(s.streak + 1, 999);
    localStorage.setItem(STATS_KEY, JSON.stringify(s));
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Flashcards</h1>

      <form onSubmit={onGenerate} className="flex gap-2">
        <input
          className="w-full rounded border p-2"
          placeholder="Topic (e.g., Linear Regression)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="rounded bg-black px-4 py-2 text-white">Generate</button>
      </form>

      <ul className="grid gap-3 md:grid-cols-2">
        {cards.map((c, i) => (
          <li key={i} className="rounded-2xl bg-white p-4 shadow">
            <div className="font-medium">Q: {c.q}</div>
            <div className="mt-2 text-sm text-gray-700">A: {c.a}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
