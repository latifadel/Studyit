"use client";

import { ChatSession } from "@/lib/db";
import { MessageSquare, Pin, Trash2 } from "lucide-react";

interface ChatSessionListProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
    onTogglePin: (id: string) => void;
}

export function ChatSessionList({
    sessions,
    currentSessionId,
    onSelectSession,
    onDeleteSession,
    onTogglePin,
}: ChatSessionListProps) {
    const pinnedSessions = sessions.filter((s) => s.pinned);
    const unpinnedSessions = sessions.filter((s) => !s.pinned);

    const SessionItem = ({ session }: { session: ChatSession }) => (
        <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`
        group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
        ${currentSessionId === session.id
                    ? "bg-indigo-50 border-2 border-indigo-200"
                    : "bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                }
      `}
        >
            <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate text-sm">
                    {session.title}
                </div>
                <div className="text-xs text-slate-500">
                    {new Date(session.updatedAt).toLocaleDateString()}
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(session.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${session.pinned
                            ? "text-amber-600 hover:bg-amber-100"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                >
                    <Pin className="h-3.5 w-3.5" fill={session.pinned ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {pinnedSessions.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                        Pinned
                    </h3>
                    <div className="space-y-2">
                        {pinnedSessions.map((session) => (
                            <SessionItem key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}

            {unpinnedSessions.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                        Recent
                    </h3>
                    <div className="space-y-2">
                        {unpinnedSessions.map((session) => (
                            <SessionItem key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
