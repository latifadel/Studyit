# StudyIt

StudyIt is an AI-powered study companion designed to format your educational journey. It helps students organize their study schedules, generate study plans, review materials with flashcards and quizzes, and track their performance over time.

## Features

-   **Personalized Study Plans**: Generates 3-day study plans (Review, Flashcards, Quiz) based on your subjects, goals, and learning style using Google Gemini AI.
-   **Flashcards**: Create and review flashcards with spaced repetition mechanics.
-   **Quizzes**: Generated quizzes to test your knowledge on specific topics.
-   **AI Tutor**: Chat-based AI tutor for asking questions and getting clarifications.
-   **Performance Tracking**: Track your XP, level, streaks, and study habits.
-   **User Preferences**: Customizable learning profile (Visual, Auditory, etc.) and themes.

## Tech Stack

-   **Frontend**: Next.js 16 (React)
-   **Styling**: Tailwind CSS 4
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **AI**: Google Generative AI (Gemini)
-   **State/Storage**: React Context + Local Storage (with JSON file persistence for local dev)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/latifadel/Studyit.git
    cd Studyit/studyit-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    You need a Google Gemini API Key.
    Create a `.env.local` file in the root of `studyit-app` and add the key: AIzaSyDUNUVSKK1Mn_VBfxDqjQty16Ga9Fk2O9w
    ```env
    GEMINI_API_KEY=AIzaSyDUNUVSKK1Mn_VBfxDqjQty16Ga9Fk2O9w
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) (or the URL shown in your terminal).

### Other Commands

-   `npm run build`: Build the application for production.
-   `npm run start`: Start the production server.
-   `npm run lint`: Run the linter to check for code issues.

## Project Structure

-   `src/app`: Next.js App Router pages and layouts.
-   `src/components`: Reusable UI components (Navigation, AuthProvider, etc.).
-   `src/lib`: Utility functions and database schema (`db.ts`).
-   `src/services`: Business logic and external services (`authService.ts`, `planGenerator.ts`).
-   `data`: Local JSON database file location (created on first run).
