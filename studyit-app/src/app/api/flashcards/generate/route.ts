import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * POST /api/flashcards/generate
 * Generates flashcards using Google Gemini AI for a given topic.
 * @param {Request} req - The request object containing userId, topic, and count.
 * @returns {Promise<NextResponse>} JSON response with the generated flashcards.
 */
export async function POST(req: Request) {
    try {
        const { userId, topic, count = 5 } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      Create ${count} flashcards for the topic: "${topic}".
      Return a JSON array where each object has:
      - front: question or term
      - back: answer or definition
      
      Keep answers concise (under 20 words).
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

        const cards = JSON.parse(text);

        const data = db.read();
        const newCards = cards.map((c: any) => ({
            id: crypto.randomUUID(),
            userId,
            front: c.front,
            back: c.back,
            topic,
            nextReview: new Date().toISOString(),
            interval: 0,
            easeFactor: 2.5
        }));

        data.flashcards.push(...newCards);
        db.write(data);

        return NextResponse.json({ cards: newCards });
    } catch (error) {
        console.error("Flashcard generation error:", error);
        return NextResponse.json({ error: "Failed to generate cards" }, { status: 500 });
    }
}
