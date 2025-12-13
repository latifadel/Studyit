"use client";

/**
 * redirects user to AI tutor
 * FR #15: When the user clicks "Ask AI Tutor", the system shall display the "Tutor Chat" Page
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Review Page (Redirect).
 * Automatically redirects the user to the Tutor page with a context-specific prompt.
 * Serves as a shortcut for starting a review session.
 */
export default function ReviewPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to tutor with a context prompt
        // In a real app, we might pass the specific topic to review
        router.replace("/tutor?initialPrompt=I want to review my study topics.");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
}
