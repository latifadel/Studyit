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
 * FR #16: When the user clicks Ask AI Tutor, the system shall display the Tutor Chat page.
 */

import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function Tutor() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hi! Ask me any study question." },
  ]);
  const [input, setInput] = useState("");

  /** Append user message and a placeholder assistant response. */
  function send() {
    const text = input.trim();
    if (!text) return;

    // Create user message
    const userMsg: Msg = { role: "user", text };

    // Stubbed response for demo; swap with real API later
    const aiMsg: Msg = {
      role: "assistant",
      text: "Thanks! Here’s a step-by-step approach. (Replace this with real model output.)",
    };

    // Append both to the transcript
    setMsgs((m) => [...m, userMsg, aiMsg]);
    setInput("");
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>

      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="space-y-2">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block rounded-xl px-3 py-2 ${
                  m.role === "user" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="w-full rounded border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
            placeholder="Type a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
