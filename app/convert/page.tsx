import Link from "next/link";
import { Calendar, Home, ArrowRightLeft } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import ConverterForm from "@/components/ConverterForm";

/**
 * /convert: pick a date, pick target calendar, get converted date.
 */
export default function ConvertPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/70 backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:flex-initial sm:text-xl">
            <Calendar className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400 sm:size-6" aria-hidden />
            <span className="truncate">World Calendar Hub</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:min-w-0"
            >
              <Home className="size-4 shrink-0" aria-hidden />
              <span>Home</span>
            </Link>
            <DarkModeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          <ArrowRightLeft className="size-7 text-zinc-500 dark:text-zinc-400" aria-hidden />
          Date converter
        </h1>
        <p className="mb-6 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Enter a date and choose a calendar to see the equivalent date.
        </p>
        <ConverterForm />
      </main>
    </div>
  );
}
