"use client";

/**
 * AI Tutor (placeholder).
 *
 * Behavior
 * - Simple local chat transcript (no backend).
 * - Each user message gets a canned assistant reply.
 *
 * Future
 * - Replace `send()` with a call to an API route or model provider.
 *
 * FR #15: When the user clicks Ask AI Tutor, the system shall display the Tutor Chat page.
 */

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { ChatSessionList } from "@/components/tutor/ChatSessionList";
import { ChatSession } from "@/lib/db";
import { Send, Loader2, Bot, User as UserIcon, Menu } from "lucide-react";

export default function TutorPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) setMessages(session.messages);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchHistory() {
    try {
      const res = await fetch(`/api/tutor/history?userId=${user?.id}`);
      const data = await res.json();
      setSessions(data.history);
      if (data.history.length > 0 && !currentSessionId) {
        setCurrentSessionId(data.history[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          userId: user?.id,
          sessionId: currentSessionId
        }),
      });

      const data = await res.json();

      const aiMsg = { role: "model", content: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      // Update session ID if this was a new chat
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        fetchHistory(); // Refresh list to show new title
      } else {
        // Optimistic update for existing session
        fetchHistory();
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id: string) {
    try {
      await fetch(`/api/tutor/history?sessionId=${id}&userId=${user?.id}`, { method: "DELETE" });
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }

  function togglePin(id: string) {
    // TODO: Implement pin functionality in API
    setSessions(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={`fixed md:relative z-50 h-full w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto overflow-x-hidden transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <ChatSessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={(id) => { setCurrentSessionId(id); setSidebarOpen(false); }}
          onDeleteSession={deleteSession}
          onTogglePin={togglePin}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-900">AI Tutor</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <Bot className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 max-w-md">
                Ask me about any subject, request a quiz, or get help with your homework.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-indigo-600" : "bg-emerald-600"}`}>
                  {msg.role === "user" ? <UserIcon className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                  }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={sendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
