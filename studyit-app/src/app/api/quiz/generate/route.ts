import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * POST /api/quiz/generate
 * Generates a multiple-choice quiz using AI.
 * @param {Request} req - The request object containing topic and count.
 * @returns {Promise<NextResponse>} JSON response with generated questions.
 */
export async function POST(req: Request) {
    try {
        const { topic, count = 5 } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      Create a ${count}-question multiple choice quiz about "${topic}".
      Return a JSON array where each object has:
      - question: string
      - options: array of 4 strings
      - correctIndex: number (0-3)
      
      Return ONLY valid JSON. Do not include markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            text = jsonMatch[0];
        } else {
            // Fallback cleanup
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const questions = JSON.parse(text);

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Quiz generation error:", error);
        return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
    }
}
