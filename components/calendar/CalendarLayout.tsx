import Link from "next/link";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { CALENDAR_GRADIENTS, CALENDAR_GRADIENTS_DARK } from "@/lib/calendarThemes";
import { CALENDAR_NAMES, CALENDAR_ICONS } from "@/lib/calendarMeta";
import type { CalendarId } from "@/lib/types";
import DarkModeToggle from "@/components/DarkModeToggle";
import Footer from "@/components/Footer";

type CalendarLayoutProps = {
  calendarId: CalendarId;
  year: number;
  children: React.ReactNode;
};

export default function CalendarLayout({
  calendarId,
  year,
  children,
}: CalendarLayoutProps) {
  const name = CALENDAR_NAMES[calendarId];
  const Icon = CALENDAR_ICONS[calendarId];
  const gradientLight = CALENDAR_GRADIENTS[calendarId];
  const gradientDark = CALENDAR_GRADIENTS_DARK[calendarId];
  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <div className="min-h-screen">
      {/* Gradient background: light and dark variants */}
      <div
        className="fixed inset-0 -z-10 transition-opacity dark:opacity-0"
        style={{ background: gradientLight }}
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 opacity-0 transition-opacity dark:opacity-100"
        style={{ background: gradientDark }}
        aria-hidden
      />

      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 rounded-lg px-1 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Back to hub"
          >
            <LayoutGrid className="size-4" aria-hidden />
            <span className="hidden sm:inline">Back to hub</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:justify-start">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200/80 text-zinc-600 dark:bg-zinc-600/80 dark:text-zinc-300"
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <h1 className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg md:text-xl">
              {name}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <nav
              className="flex items-center gap-0.5 sm:gap-1"
              aria-label="Year navigation"
            >
              <Link
                href={`/calendar/${calendarId}?year=${prevYear}`}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                aria-label={`Previous year (${prevYear})`}
              >
                <ChevronLeft className="size-5" />
              </Link>
              <span className="min-w-[3rem] text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:min-w-[4rem] sm:text-base">
                {year}
              </span>
              <Link
                href={`/calendar/${calendarId}?year=${nextYear}`}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                aria-label={`Next year (${nextYear})`}
              >
                <ChevronRight className="size-5" />
              </Link>
            </nav>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
        <Footer />
      </main>
    </div>
  );
}
