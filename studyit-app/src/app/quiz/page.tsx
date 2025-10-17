"use client";
/**
 * Quiz page: create → take → submit → see results.
 *
 * Data
 * - Aggregates `studyit_stats.quizzes` on submit.
 * - Quiz items are generated locally for demo (no server).
 *
 * UX
 * - Build a 3-question quiz for a topic and difficulty.
 * - Show score after submission.
 */

import { FormEvent, useEffect, useState } from "react";

type Q = { q: string; options: string[]; answer: number };
const STATS_KEY = "studyit_stats";

/** Deterministic quiz factory; replace with real item bank later. */
function buildQuiz(topic: string, level: string): Q[] {
  const base = topic || "General";
  const diff = level || "medium";
  const opts = ["A", "B", "C", "D"];
  return [1, 2, 3].map((i) => ({
    q: `${base} (${diff}) — question ${i}?`,
    options: opts.map((o) => `${base} option ${o}${i}`),
    answer: i % 4, // rotate correct index to avoid trivial patterns
  }));
}

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("medium");
  const [quiz, setQuiz] = useState<Q[] | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // Reset answers when a new quiz is created
  useEffect(() => setAnswers(quiz ? Array(quiz.length).fill(-1) : []), [quiz]);

  /** Build quiz from form inputs. */
  function onCreate(e: FormEvent) {
    e.preventDefault();
    const q = buildQuiz(topic, level);
    setQuiz(q);
    setScore(null);
  }

  /** Score answers and update aggregate quiz count. */
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!quiz) return;
    const s = quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    setScore(s);
    bumpQuizzes();
  }

  /** Increment quiz counter (consumed by Dashboard/Performance). */
  function bumpQuizzes() {
    const raw = localStorage.getItem(STATS_KEY);
    const st = raw ? JSON.parse(raw) : { streak: 0, sessions: 0, quizzes: 0 };
    st.quizzes += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(st));
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Quiz</h1>

      {/* Quiz builder */}
      <form onSubmit={onCreate} className="flex gap-2">
        <input
          className="w-full rounded border p-2"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <select className="rounded border p-2" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-white">Create</button>
      </form>

      {/* Quiz taker */}
      {quiz && (
        <form onSubmit={onSubmit} className="space-y-4">
          {quiz.map((q, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow">
              <div className="font-medium">{q.q}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {q.options.map((op, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === idx}
                      onChange={() => {
                        const copy = [...answers];
                        copy[i] = idx;
                        setAnswers(copy);
                      }}
                    />
                    {op}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="rounded bg-green-600 px-4 py-2 text-white">Submit</button>
        </form>
      )}

      {/* Results */}
      {score !== null && quiz && (
        <div className="rounded-2xl bg-white p-4 shadow">
          <div className="text-lg font-semibold">Results</div>
          <div className="mt-1">Score: {score} / {quiz.length}</div>
        </div>
      )}
    </section>
  );
}
