import { db, Flashcard } from "@/lib/db";
import { NextResponse } from "next/server";
import { addDays } from "date-fns";

/**
 * GET /api/flashcards
 * Retrieves all flashcards for a user, sorted by review priority.
 * @param {Request} req - The request object containing 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response with sorted flashcards.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();
        const cards = data.flashcards.filter(c => c.userId === userId);

        // Sort by next review date (due cards first)
        const now = new Date();
        const dueCards = cards.filter(c => new Date(c.nextReview) <= now);
        const futureCards = cards.filter(c => new Date(c.nextReview) > now);

        return NextResponse.json({ cards: [...dueCards, ...futureCards] });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/flashcards
 * Creates a new manual flashcard.
 * @param {Request} req - The request object containing userId, front, back, and topic.
 * @returns {Promise<NextResponse>} JSON response with the created card.
 */
export async function POST(req: Request) {
    try {
        const { userId, front, back, topic } = await req.json();

        const data = db.read();
        const newCard: Flashcard = {
            id: crypto.randomUUID(),
            userId,
            front,
            back,
            topic,
            nextReview: new Date().toISOString(),
            interval: 0,
            easeFactor: 2.5
        };

        data.flashcards.push(newCard);
        db.write(data);

        return NextResponse.json({ card: newCard });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PUT /api/flashcards
 * Updates a flashcard's review status based on user performance (Spaced Repetition).
 * @param {Request} req - The request object containing cardId and quality (0-5).
 * @returns {Promise<NextResponse>} JSON response with the updated card.
 */
export async function PUT(req: Request) {
    try {
        const { cardId, quality } = await req.json(); // quality: 0-5 (0=fail, 5=perfect)

        const data = db.read();
        const cardIndex = data.flashcards.findIndex(c => c.id === cardId);

        if (cardIndex === -1) {
            return NextResponse.json({ error: "Card not found" }, { status: 404 });
        }

        const card = data.flashcards[cardIndex];

        // Simple SM-2 Algorithm
        if (quality >= 3) {
            if (card.interval === 0) {
                card.interval = 1;
            } else if (card.interval === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }

            card.easeFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            if (card.easeFactor < 1.3) card.easeFactor = 1.3;
        } else {
            card.interval = 0; // Reset
        }

        card.nextReview = addDays(new Date(), card.interval).toISOString();

        // Update Performance
        const perf = data.performance.find(p => p.userId === card.userId);
        if (perf) {
            perf.flashcardsReviewed = (perf.flashcardsReviewed || 0) + 1;

            // Update XP if correct
            if (quality >= 3) {
                perf.xp += 10;
                // Simple level up logic
                if (perf.xp >= perf.level * 100) {
                    perf.level += 1;
                }
            }
        }

        data.flashcards[cardIndex] = card;
        db.write(data);

        return NextResponse.json({ card });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/flashcards
 * Deletes a flashcard.
 * @param {Request} req - The request object containing 'cardId' and 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response indicating success.
 */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cardId = searchParams.get("cardId");
        const userId = searchParams.get("userId");

        if (!cardId || !userId) {
            return NextResponse.json({ error: "Card ID and User ID required" }, { status: 400 });
        }

        const data = db.read();
        data.flashcards = data.flashcards.filter(c => c.id !== cardId || c.userId !== userId);
        db.write(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
