import Link from "next/link";
import { Calendar, ArrowRightLeft } from "lucide-react";
import { today } from "@/lib/dateUtils";
import { getAllCalendars } from "@/lib/calendars";
import CalendarCard from "@/components/CalendarCard";
import DarkModeToggle from "@/components/DarkModeToggle";
import Footer from "@/components/Footer";

/**
 * Homepage: responsive grid of 18 calendar cards.
 * Uses real-time date (new Date()) via today().
 */
export default function HomePage() {
  const now = today();
  const calendars = getAllCalendars(now);

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
              href="/convert"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:min-w-0"
            >
              <ArrowRightLeft className="size-4 shrink-0" aria-hidden />
              <span>Convert</span>
            </Link>
            <DarkModeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        <p className="mb-6 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Today&apos;s date ({now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}) in every major calendar:
        </p>
        <section
          className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
          aria-label="Calendar cards"
        >
          {calendars.map((info) => (
            <CalendarCard key={info.id} info={info} />
          ))}
        </section>
        <Footer />
      </main>
    </div>
  );
}
