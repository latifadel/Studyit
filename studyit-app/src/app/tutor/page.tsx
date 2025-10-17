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
      <h1 className="text-2xl font-semibold">AI Tutor</h1>

      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="space-y-2">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block rounded-xl px-3 py-2 ${
                  m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="w-full rounded border p-2"
            placeholder="Type a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} className="rounded bg-black px-4 py-2 text-white">Send</button>
        </div>
      </div>
    </section>
  );
}
