"use client";

import { useAuth } from "@/components/AuthProvider";
import { FormEvent, useEffect, useState } from "react";

type Pref = { subjects: string; goal: string; style: string; level: string };

export default function Preferences() {
  const { user } = useAuth();
  const [pref, setPref] = useState<Pref>({
    subjects: "",
    goal: "",
    style: "visual",
    level: "medium",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/preferences?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.preferences) {
            // Convert array to string for input if needed
            const subjects = Array.isArray(data.preferences.subjects)
              ? data.preferences.subjects.join(", ")
              : data.preferences.subjects || "";

            setPref({
              ...data.preferences,
              subjects
            });
          }
        })
        .catch(err => console.error("Failed to load preferences", err));
    }
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          preferences: pref
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subjects & Preferences</h1>
        <p className="text-gray-600">
          Customize your AI tutor, quiz questions, and flashcards to match your learning style.
        </p>
      </div>

      <div className="card">
        {message && (
          <div className={`mb-6 rounded-xl border p-4 flex items-start gap-3 ${message.type === 'success'
              ? 'bg-green-50 border-green-100 text-green-700'
              : 'bg-red-50 border-red-100 text-red-700'
            }`}>
            <div className="mt-0.5">{message.type === 'success' ? '✅' : '⚠️'}</div>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="col-span-2">
              <label className="label">Subjects</label>
              <input
                className="input-field"
                placeholder="e.g., Math, CS, Stats"
                value={pref.subjects}
                onChange={(e) => setPref({ ...pref, subjects: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple subjects with commas</p>
            </div>

            <div className="col-span-2">
              <label className="label">Current Goal</label>
              <input
                className="input-field"
                placeholder="e.g., Exam on Nov 10, target A-"
                value={pref.goal}
                onChange={(e) => setPref({ ...pref, goal: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Learning Style</label>
              <select
                className="input-field"
                value={pref.style}
                onChange={(e) => setPref({ ...pref, style: e.target.value })}
              >
                <option value="visual">Visual (Images, Diagrams)</option>
                <option value="reading">Reading/Writing (Text based)</option>
                <option value="auditory">Auditory (Listening)</option>
                <option value="kinesthetic">Kinesthetic (Hands-on)</option>
              </select>
            </div>

            <div>
              <label className="label">Difficulty Level</label>
              <select
                className="input-field"
                value={pref.level}
                onChange={(e) => setPref({ ...pref, level: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
