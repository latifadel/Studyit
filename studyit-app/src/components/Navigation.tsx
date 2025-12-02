"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function Navigation() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/preferences", label: "Preferences" },
        { href: "/plan", label: "Plan" },
        { href: "/flashcards", label: "Flashcards" },
        { href: "/quiz", label: "Quiz" },
        { href: "/tutor", label: "AI Tutor" },
        { href: "/performance", label: "Performance" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
                <Link
                    href="/dashboard"
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                    StudyIt
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        <span className="text-sm font-medium text-gray-700 hidden lg:block">
                            {user.email}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
