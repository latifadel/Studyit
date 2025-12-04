"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Loader2, Trash2, Calendar, BookOpen, Brain, CheckCircle2 } from "lucide-react";
import { PlanItem } from "@/lib/db";

export default function PlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) fetchPlan();
  }, [user]);

  async function fetchPlan() {
    try {
      const res = await fetch(`/api/plan?userId=${user?.id}`);
      const data = await res.json();
      setPlan(data.plan);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setLoading(false);
    }
  }

  async function generatePlan() {
    setGenerating(true);
    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function clearPlan() {
    if (!confirm("Are you sure you want to clear your study plan? This cannot be undone.")) return;

    try {
      await fetch(`/api/plan?userId=${user?.id}`, { method: "DELETE" });
      setPlan(null);
    } catch (error) {
      console.error("Failed to clear plan:", error);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-8 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Plan</h1>
          <p className="text-slate-600 mt-1">Your AI-curated learning schedule</p>
        </div>

        {plan && (
          <button
            onClick={clearPlan}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear Plan
          </button>
        )}
      </div>

      {!plan ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No active study plan</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Let our AI analyze your preferences and create a personalized schedule for you.
          </p>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Generating Plan...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                Generate AI Plan
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plan.items.map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  Day {item.day}
                </span>
                {item.type === 'quiz' ? (
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                ) : (
                  <BookOpen className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.topic}</h3>
              <p className="text-sm text-slate-500 mb-4">{item.description}</p>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
