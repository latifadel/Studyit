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

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Loader2, Trophy, Flame, Target, Clock, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * Performance Page.
 * Visualizes user progress with charts and statistics.
 * Displays level, XP, streak, and study activity over time.
 */
export default function PerformancePage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/performance?userId=${user?.id}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (!data) return null;

  const { perf, activity } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Performance</h1>
        <p className="text-slate-600 mt-1">Track your progress and achievements</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="h-6 w-6 text-yellow-600" />} label="Level" value={perf.level} bg="bg-yellow-50" />
        <StatCard icon={<Star className="h-6 w-6 text-purple-600" />} label="XP" value={perf.xp} bg="bg-purple-50" />
        <StatCard icon={<Flame className="h-6 w-6 text-orange-600" />} label="Streak" value={`${perf.streak} Days`} bg="bg-orange-50" />
        <StatCard icon={<Clock className="h-6 w-6 text-blue-600" />} label="Study Time" value={`${Math.round(perf.totalStudyTime / 60)}h`} bg="bg-blue-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Study Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Target className="h-4 w-4 text-indigo-600" /></div>
                  <span className="font-medium text-slate-700">Quizzes Taken</span>
                </div>
                <span className="font-bold text-slate-900">{perf.quizzesTaken || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Zap className="h-4 w-4 text-yellow-600" /></div>
                  <span className="font-medium text-slate-700">Cards Reviewed</span>
                </div>
                <span className="font-bold text-slate-900">{perf.flashcardsReviewed || 0}</span>
              </div>
            </div>
          </div>

          {/* Next Level Progress */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium opacity-90">Next Level</span>
              <span className="font-bold">{perf.xp} / {perf.level * 100} XP</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (perf.xp / (perf.level * 100)) * 100)}%` }}
              />
            </div>
            <p className="text-sm mt-4 opacity-80">
              Keep studying to earn more XP and unlock new achievements!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string | number; bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
      </div>
    </div>
  );
}

import { Zap } from "lucide-react";
