"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { DailyOverview } from "@/components/dashboard/DailyOverview";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import Link from "next/link";
import { BookOpen, Brain, Calendar, Settings, Zap, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/dashboard?userId=${user?.id}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-8 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {data?.greeting || "Welcome back"}, <span className="text-indigo-600">{user.email.split('@')[0]}</span>! 👋
          </h1>
          <p className="text-slate-600 mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="text-sm font-medium bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-100">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Row */}
          {data?.stats && <StatsSummary stats={data.stats} />}

          {/* Today's Plan */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Plan</h2>
            {loading ? (
              <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ) : (
              <DailyOverview tasks={data?.todayItems || []} />
            )}
          </section>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid gap-3">
              <QuickAction href="/tutor" icon={<Brain className="h-5 w-5 text-purple-600" />} label="Ask AI Tutor" desc="Get instant help" />
              <QuickAction href="/flashcards" icon={<Zap className="h-5 w-5 text-yellow-600" />} label="Review Flashcards" desc="Practice key terms" />
              <QuickAction href="/quiz" icon={<BookOpen className="h-5 w-5 text-blue-600" />} label="Take a Quiz" desc="Test your knowledge" />
              <QuickAction href="/plan" icon={<Calendar className="h-5 w-5 text-green-600" />} label="Update Plan" desc="Manage schedule" />
              <QuickAction href="/performance" icon={<BarChart3 className="h-5 w-5 text-orange-600" />} label="View Progress" desc="Check your stats" />
              <QuickAction href="/preferences" icon={<Settings className="h-5 w-5 text-slate-600" />} label="Preferences" desc="Adjust settings" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </Link>
  );
}
