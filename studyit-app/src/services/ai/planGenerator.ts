import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserPreferences } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Use gemini-flash-latest as it is available
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export interface GeneratedPlanItem {
    topic: string;
    type: 'review' | 'flashcards' | 'quiz';
    day: number;
    description: string;
}

export const AIService = {
    async generateStudyPlan(prefs: UserPreferences): Promise<GeneratedPlanItem[]> {
        const prompt = `
      Act as an expert study planner. Create a 3-day study plan for a student with the following profile:
      - Subjects: ${prefs.subjects.join(", ")}
      - Goal: ${prefs.goal}
      - Learning Style: ${prefs.style}

      Generate a JSON response containing an array of study items. 
      Each item should have:
      - topic: specific sub-topic to study
      - type: one of "review", "flashcards", "quiz"
      - day: 1, 2, or 3
      - description: brief instruction (max 10 words)

      Ensure the plan is balanced and follows the student's learning style.
      Return ONLY the JSON array, no markdown formatting.
    `;

        try {
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

            return JSON.parse(text);
        } catch (error) {
            console.error("AI Plan Generation Error:", error);
            // Fallback plan if AI fails
            return [
                { topic: "General Review", type: "review", day: 1, description: "Review core concepts" },
                { topic: "Key Terms", type: "flashcards", day: 1, description: "Memorize definitions" },
                { topic: "Self Assessment", type: "quiz", day: 2, description: "Test your knowledge" }
            ];
        }
    }
};
