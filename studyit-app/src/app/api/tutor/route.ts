import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";

/**
 * POST /api/tutor
 * Sends a message to the AI tutor and receives a response.
 * Manages chat session context and persistence.
 * @param {NextRequest} req - The request object containing prompt, userId, and optional sessionId.
 * @returns {Promise<NextResponse>} JSON response with AI reply and sessionId.
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, userId, sessionId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // Use gemini-flash-latest as it is available
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Retrieve context if session exists
    const data = db.read();
    let currentSession = sessionId ? data.chatHistory.find(c => c.id === sessionId) : null;

    // Simple context: just send the prompt for now, but in a real app we'd send history
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const newMessage = { role: 'user' as const, content: prompt, timestamp: new Date().toISOString() };
    const aiMessage = { role: 'model' as const, content: text, timestamp: new Date().toISOString() };

    if (currentSession) {
      currentSession.messages.push(newMessage, aiMessage);
      currentSession.updatedAt = new Date().toISOString();
    } else {
      currentSession = {
        id: crypto.randomUUID(),
        userId,
        title: prompt.substring(0, 30) + "...",
        messages: [newMessage, aiMessage],
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.chatHistory.push(currentSession);
    }

    db.write(data);

    return NextResponse.json({
      reply: text,
      sessionId: currentSession.id
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ reply: "Error contacting Gemini API" }, { status: 500 });
  }
}
