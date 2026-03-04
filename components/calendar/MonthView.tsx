"use client";

import type { CalendarId } from "@/lib/types";
import type { MonthInfo } from "@/lib/calendarViews";
import { getHolidaysForDay } from "@/lib/holidays";
import MonthDayCell from "./MonthDayCell";
import HolidaysThisMonth from "./HolidaysThisMonth";

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type MonthViewProps = {
  calendarId: CalendarId;
  year: number;
  month: number;
  monthInfo: MonthInfo;
  /** When viewing current month in current year, the day number for "today" (1–31); else null */
  todayDay?: number | null;
};

/**
 * Single-month view: traditional 7-column grid, spacious day cells.
 * Holidays will be wired in Phase E2 via getHolidaysForDay.
 */
export default function MonthView({
  calendarId,
  year,
  month,
  monthInfo,
  todayDay: todayDayProp = null,
}: MonthViewProps) {
  const { daysCount, firstWeekday } = monthInfo;
  const offset = firstWeekday;
  const showToday =
    todayDayProp != null ? (day: number) => day === todayDayProp : undefined;

  return (
    <div className="space-y-6 sm:space-y-8">
    <section
      className="min-w-0 max-w-full overflow-x-auto rounded-2xl border border-white/20 bg-white/70 p-3 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70 sm:p-6"
      aria-label={`${monthInfo.monthNameEn} ${year} — calendar month`}
      role="region"
    >
      <div className="mb-3 grid min-w-[280px] grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 sm:mb-4 sm:gap-2 sm:text-sm" role="presentation">
        {WEEKDAY_NAMES.map((name) => (
          <span key={name} className="py-1.5 sm:py-2">
            {name}
          </span>
        ))}
      </div>

      <div className="grid min-w-[280px] grid-cols-7 gap-1 sm:gap-2" role="grid" aria-label={`Days of ${monthInfo.monthNameEn}`}>
        {Array.from({ length: offset }, (_, i) => (
          <div key={`empty-${i}`} className="min-h-[5rem] sm:min-h-[6.5rem] md:min-h-[7rem]" aria-hidden />
        ))}
        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;
          const holidays = getHolidaysForDay(calendarId, year, month, day);
          return (
            <MonthDayCell
              key={day}
              day={day}
              isToday={showToday?.(day)}
              holidays={holidays}
            />
          );
        })}
      </div>
    </section>

    <HolidaysThisMonth
      calendarId={calendarId}
      year={year}
      month={month}
      daysCount={daysCount}
      monthNameEn={monthInfo.monthNameEn}
    />
    </div>
  );
}
