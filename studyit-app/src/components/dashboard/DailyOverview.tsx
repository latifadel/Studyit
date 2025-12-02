import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Task {
    id: string;
    topic: string;
    type: string;
    completed: boolean;
}

export function DailyOverview({ tasks }: { tasks: Task[] }) {
    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">You're all caught up! 🎉</h3>
                <p className="text-slate-500 mb-4">No tasks scheduled for today. Why not start a new session?</p>
                <Link href="/plan" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    Create a new plan <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Today's Focus</h3>
                <span className="text-sm text-slate-500">{tasks.length} tasks remaining</span>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                        <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                            <Circle className="h-6 w-6" />
                        </button>
                        <div className="flex-1">
                            <div className="font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">{task.topic}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{task.type}</div>
                        </div>
                        <Link href={`/${task.type}`} className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                            Start
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
