import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DatabaseSchema {
    users: User[];
    sessions: Session[];
    plans: StudyPlan[];
    flashcards: Flashcard[];
    quizzes: Quiz[];
    quizResults: QuizResult[];
    chatHistory: ChatSession[];
    performance: UserPerformance[];
}

// Types (simplified for initial setup)
export interface User { id: string; email: string; passwordHash: string; name: string; preferences: UserPreferences; }
export interface UserPreferences { subjects: string[]; goal: string; style: string; theme: 'light' | 'dark'; }
export interface Session { id: string; userId: string; token: string; expiresAt: string; }
export interface StudyPlan { id: string; userId: string; items: PlanItem[]; createdAt: string; }
export interface PlanItem { id: string; topic: string; type: 'review' | 'flashcards' | 'quiz'; day: number; completed: boolean; }
export interface Flashcard { id: string; userId: string; front: string; back: string; topic: string; nextReview: string; interval: number; easeFactor: number; }
export interface Quiz { id: string; userId: string; topic: string; questions: QuizQuestion[]; score?: number; takenAt?: string; }
export interface QuizQuestion { id: string; question: string; options: string[]; correctIndex: number; }
export interface QuizResult { id: string; userId: string; topic: string; score: number; totalQuestions: number; date: string; }
export interface ChatSession { id: string; userId: string; title: string; messages: ChatMessage[]; pinned: boolean; createdAt: string; updatedAt: string; }
export interface ChatMessage { role: 'user' | 'model'; content: string; timestamp: string; }
export interface UserPerformance { userId: string; xp: number; level: number; streak: number; lastStudyDate: string; totalStudyTime: number; quizzesTaken?: number; flashcardsReviewed?: number; }

const INITIAL_DB: DatabaseSchema = {
    users: [],
    sessions: [],
    plans: [],
    flashcards: [],
    quizzes: [],
    quizResults: [],
    chatHistory: [],
    performance: []
};

function ensureDbExists() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
    }
}

export function readDb(): DatabaseSchema {
    ensureDbExists();
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Database read error:", error);
        return INITIAL_DB;
    }
}

export function writeDb(data: DatabaseSchema) {
    ensureDbExists();
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Database write error:", error);
    }
}

export const db = {
    read: readDb,
    write: writeDb
};
