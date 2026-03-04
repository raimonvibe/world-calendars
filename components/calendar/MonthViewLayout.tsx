import Link from "next/link";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { CALENDAR_GRADIENTS, CALENDAR_GRADIENTS_DARK } from "@/lib/calendarThemes";
import { CALENDAR_NAMES, CALENDAR_ICONS } from "@/lib/calendarMeta";
import { MONTH_RANGES } from "@/lib/calendarViews";
import type { CalendarId } from "@/lib/types";
import DarkModeToggle from "@/components/DarkModeToggle";
import Footer from "@/components/Footer";
import MonthPicker from "./MonthPicker";
import type { MonthOption } from "./MonthPicker";

type MonthViewLayoutProps = {
  calendarId: CalendarId;
  year: number;
  month: number;
  monthNameEn: string;
  monthNameOriginal?: string;
  /** Options for month dropdown (value 1..maxMonth, label) */
  monthOptions?: MonthOption[];
  children: React.ReactNode;
};

export default function MonthViewLayout({
  calendarId,
  year,
  month,
  monthNameEn,
  monthNameOriginal,
  monthOptions = [],
  children,
}: MonthViewLayoutProps) {
  const name = CALENDAR_NAMES[calendarId];
  const Icon = CALENDAR_ICONS[calendarId];
  const gradientLight = CALENDAR_GRADIENTS[calendarId];
  const gradientDark = CALENDAR_GRADIENTS_DARK[calendarId];
  const maxMonth = MONTH_RANGES[calendarId] ?? 12;

  const prevMonth = month === 1 ? maxMonth : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === maxMonth ? 1 : month + 1;
  const nextYear = month === maxMonth ? year + 1 : year;

  return (
    <div className="min-h-screen">
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
            href={`/calendar/${calendarId}?year=${year}`}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg px-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Back to year view"
          >
            <LayoutGrid className="size-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Back to year</span>
          </Link>

          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200/80 text-zinc-600 dark:bg-zinc-600/80 dark:text-zinc-300"
                aria-hidden
              >
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1 sm:flex-initial">
                <h1 className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg md:text-xl">
                  {name}
                </h1>
                <p className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:text-sm">
                  {monthNameOriginal ? (
                    <>
                      <span>{monthNameEn}</span>
                      <span className="ml-1.5" dir="auto">{monthNameOriginal}</span>
                    </>
                  ) : (
                    monthNameEn
                  )}{" "}
                  {year}
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2" aria-label="Month navigation">
              {monthOptions.length > 0 && (
                <MonthPicker
                  calendarId={calendarId}
                  year={year}
                  currentMonth={month}
                  options={monthOptions}
                />
              )}
              <div className="flex items-center gap-0.5">
                <Link
                  href={`/calendar/${calendarId}/${prevYear}/${prevMonth}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  aria-label={`Previous month (${prevMonth}/${prevYear})`}
                >
                  <ChevronLeft className="size-5" />
                </Link>
                <span className="min-w-[3rem] px-1 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100" aria-hidden>
                  {month}/{year}
                </span>
                <Link
                  href={`/calendar/${calendarId}/${nextYear}/${nextMonth}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  aria-label={`Next month (${nextMonth}/${nextYear})`}
                >
                  <ChevronRight className="size-5" />
                </Link>
              </div>
              <DarkModeToggle />
            </nav>
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
