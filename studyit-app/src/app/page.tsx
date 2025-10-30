import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to StudyIt
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          Your personalized study planner to organize learning, track progress, and achieve your goals.
        </p>
        
        <Link
          href="/login"
          className="rounded-full transition-all flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base h-12 px-8 mt-4"
        >
          Login
        </Link>
      </main>
    </div>
  );
}
