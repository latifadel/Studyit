import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Welcome to StudyIt
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
          Your personalized study planner to organize learning, track progress, and achieve your goals.
        </p>
        
        <Link
          href="/login"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-8 mt-4"
        >
          Login
        </Link>
      </main>
    </div>
  );
}
