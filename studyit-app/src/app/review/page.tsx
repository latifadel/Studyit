"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
