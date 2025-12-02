"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle, Trophy, Play, History, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizResult {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export default function QuizPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'result'>('start');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (user) fetchResults();
  }, [user]);

  async function fetchResults() {
    try {
      const res = await fetch(`/api/quiz?userId=${user?.id}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  }

  async function startQuiz() {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: 5 }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setQuizState('playing');
      setCurrentQuestion(0);
      setScore(0);
      setIsAnswered(false);
      setSelectedOption(null);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(index: number) {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  }

  async function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    setQuizState('result');
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          topic,
          score: score + (selectedOption === questions[currentQuestion].correctIndex ? 1 : 0), // Add last question score if correct
          totalQuestions: questions.length
        }),
      });
      fetchResults();
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  }

  if (quizState === 'playing') {
    const q = questions[currentQuestion];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm font-medium text-indigo-600">{topic}</span>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all font-medium",
                  !isAnswered && "hover:border-indigo-200 hover:bg-slate-50 border-slate-200",
                  isAnswered && idx === q.correctIndex && "border-green-500 bg-green-50 text-green-700",
                  isAnswered && idx === selectedOption && idx !== q.correctIndex && "border-red-500 bg-red-50 text-red-700",
                  isAnswered && idx !== q.correctIndex && idx !== selectedOption && "opacity-50 border-slate-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && idx === q.correctIndex && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== q.correctIndex && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {isAnswered && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg hover:shadow-indigo-200 transition-all"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (quizState === 'result') {
    const finalScore = score + (selectedOption === questions[currentQuestion]?.correctIndex ? 1 : 0); // Ensure final score is accurate
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">You scored {finalScore} out of {questions.length}</p>

          <div className="text-5xl font-black text-indigo-600 mb-8">{percentage}%</div>

          <div className="flex gap-3">
            <button
              onClick={() => setQuizState('start')}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => { setTopic(""); setQuizState('start'); }}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quiz Mode</h1>
          <p className="text-slate-600 mt-1">Test your knowledge and earn XP</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Start Quiz Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Play className="h-5 w-5 text-indigo-600" />
            Start New Quiz
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., World History, Calculus..."
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={startQuiz}
              disabled={loading || !topic.trim()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate Quiz"}
            </button>
          </div>
        </div>

        {/* History Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Recent Results
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px]">
            {results.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No quizzes taken yet.</p>
            ) : (
              results.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-900">{res.topic}</div>
                    <div className="text-xs text-slate-500">{new Date(res.date).toLocaleDateString()}</div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-sm font-bold",
                    (res.score / res.totalQuestions) >= 0.8 ? "bg-green-100 text-green-700" :
                      (res.score / res.totalQuestions) >= 0.5 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                  )}>
                    {Math.round((res.score / res.totalQuestions) * 100)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
