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
 *
 * FR #8: When the user selects a study mode and clicks "Start", the system shall display that mode.
 * FR #9: When the user clicks Generate Flashcards, the system shall display AI-generated flashcards.
 * FR #10: When the user clicks Done after a session, the system shall display the updated review schedule.
 */

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Flashcard } from "@/lib/db";
import { Loader2, Zap, RotateCw, Check, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Flashcards Page.
 * Allows users to view, study (spaced repetition), delete, and generate flashcards.
 * Uses AI to generate new cards based on topics.
 */
export default function FlashcardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (user) fetchCards();
  }, [user]);

  async function fetchCards() {
    try {
      const res = await fetch(`/api/flashcards?userId=${user?.id}`);
      const data = await res.json();
      setCards(data.cards);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRate(quality: number) {
    if (!cards[currentIndex]) return;

    const card = cards[currentIndex];

    // Optimistic update: move to next card
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("Review session complete!");
      setCurrentIndex(0);
      fetchCards(); // Refresh to re-sort
      return;
    }

    try {
      await fetch("/api/flashcards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, quality }),
      });
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  }

  async function generateCards() {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, topic, count: 5 }),
      });
      const data = await res.json();
      // Replace cards instead of appending to clear previous subject's cards
      setCards(data.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowGenerator(false);
      setTopic("");
    } catch (error) {
      console.error("Failed to generate cards:", error);
    } finally {
      setGenerating(false);
    }
  }

  async function deleteCard(id: string) {
    if (!confirm("Delete this card?")) return;
    try {
      await fetch(`/api/flashcards?cardId=${id}&userId=${user?.id}`, { method: "DELETE" });
      setCards(prev => prev.filter(c => c.id !== id));
      if (currentIndex >= cards.length - 1) setCurrentIndex(Math.max(0, cards.length - 2));
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Flashcards</h1>
          <p className="text-slate-600 mt-1">
            {cards.length} cards • {cards.length - currentIndex} to review
          </p>
        </div>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Cards
        </button>
      </div>

      {showGenerator && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-slate-900 mb-4">Generate with AI</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'Photosynthesis')"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              onClick={generateCards}
              disabled={generating || !topic.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {generating ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate"}
            </button>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No cards yet</h2>
          <p className="text-slate-500 mb-8">Create some cards or let AI generate them for you.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Area */}
          <div
            className="relative h-80 w-full [perspective:1000px] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={cn(
              "relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] shadow-lg rounded-3xl border border-slate-200 bg-white",
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
              {/* Front */}
              <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">{currentCard.topic}</span>
                <h3 className="text-2xl font-bold text-slate-900">{currentCard.front}</h3>
                <div className="absolute bottom-6 text-sm text-slate-400 flex items-center gap-2">
                  <RotateCw className="h-4 w-4" /> Click to flip
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCard(currentCard.id); }}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-8 text-center bg-indigo-50/50 rounded-3xl">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-4">Answer</span>
                <p className="text-xl font-medium text-slate-800">{currentCard.back}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => handleRate(0)} className="p-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors">Again</button>
              <button onClick={() => handleRate(3)} className="p-3 rounded-xl bg-orange-100 text-orange-700 font-medium hover:bg-orange-200 transition-colors">Hard</button>
              <button onClick={() => handleRate(4)} className="p-3 rounded-xl bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors">Good</button>
              <button onClick={() => handleRate(5)} className="p-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors">Easy</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
