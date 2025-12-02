import { Flame, Trophy, Clock } from "lucide-react";

interface Stats {
    xp: number;
    level: number;
    streak: number;
    totalStudyTime: number;
}

export function StatsSummary({ stats }: { stats: Stats }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatCard
                icon={<Flame className="h-5 w-5 text-orange-500" />}
                label="Day Streak"
                value={stats.streak.toString()}
                bg="bg-orange-50"
            />
            <StatCard
                icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                label="Level"
                value={stats.level.toString()}
                bg="bg-yellow-50"
            />
            <StatCard
                icon={<Clock className="h-5 w-5 text-blue-500" />}
                label="Hours"
                value={Math.round(stats.totalStudyTime / 60).toString()}
                bg="bg-blue-50"
            />
        </div>
    );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className={`p-2 rounded-xl ${bg} mb-2`}>{icon}</div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs font-medium text-slate-500">{label}</div>
        </div>
    );
}
