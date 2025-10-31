// Gemini API backend route for AI tutor
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      reply: response.text || "Sorry, I couldn't generate a response.",
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ reply: "Error contacting Gemini API" }, { status: 500 });
  }
}
