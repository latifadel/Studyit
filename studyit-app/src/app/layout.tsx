/**
 * Root layout: provides global shell for the app.
 *
 * Responsibilities
 * - Inject global styles via `globals.css`.
 * - Render top navigation links across pages.
 * - Wrap pages with `AuthProvider` (session) and `Protected` (route guard).
 *
 * Notes
 * - All routes except `"/"` and `"/login"` are treated as private.
 * - Uses Tailwind CSS utilities for layout and styling.
 */
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/components/AuthProvider";
import { Protected } from "@/components/Protected";



/** Static site metadata for Next.js. */
export const metadata: Metadata = {
  title: "StudyIt",
  description: "Personalized study planner",
};

/**
 * Global app shell with navigation and route protection.
 * @param children Active route content.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/* Provide auth context to the whole tree */}
        <AuthProvider>
          {/* Global top navigation; visible on all pages for quick access */}
          <header className="border-b bg-white shadow-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-3">
              <Link href="/dashboard" className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StudyIt</Link>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/dashboard" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Dashboard</Link>
                <Link href="/preferences" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Preferences</Link>
                <Link href="/plan" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Plan</Link>
                <Link href="/flashcards" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Flashcards</Link>
                <Link href="/quiz" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Quiz</Link>
                <Link href="/tutor" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">AI Tutor</Link>
                <Link href="/performance" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Performance</Link>
                <Link href="/settings" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">Settings</Link>
              </div>
            </nav>
          </header>

          {/* Route guard — blocks private pages when not logged in */}
          <Protected>
            <main className="mx-auto max-w-6xl p-4">{children}</main>
          </Protected>
        </AuthProvider>
      </body>
    </html>
  );
}
