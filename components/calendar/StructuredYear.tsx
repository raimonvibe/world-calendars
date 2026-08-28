"use client";

import { useMemo } from "react";
import { getMonthInfo, getTodayDayInMonth, MONTH_RANGES } from "@/lib/calendarViews";
import type { CalendarId } from "@/lib/types";
import MonthGrid from "./MonthGrid";

type StructuredYearProps = {
  calendarId: CalendarId;
  year: number;
  /** Appended after the year in labels, e.g. "AM", "NS", "BE". */
  yearSuffix?: string;
  /** Overrides the calendar's name in the section label. */
  label?: string;
};

/**
 * A year view built from the calendar's own month structure.
 *
 * Each of these calendars previously had its own component that mapped
 * January-December onto a Gregorian year with an offset, so a Coptic year
 * showed twelve 28-to-31-day months instead of thirteen, and Armenian, Sikh,
 * Assyrian and Javanese years showed Gregorian month lengths under a renamed
 * year. Driving every one of them from getMonthInfo means the grid, the month
 * links and the today marker all agree with the date the calendar reports.
 */
export default function StructuredYear({
  calendarId,
  year,
  yearSuffix,
  label,
}: StructuredYearProps) {
  const months = useMemo(() => {
    const count = MONTH_RANGES[calendarId] ?? 12;
    return Array.from({ length: count }, (_, i) => getMonthInfo(calendarId, year, i + 1)).filter(
      (m): m is NonNullable<typeof m> => m != null
    );
  }, [calendarId, year]);

  const yearLabel = yearSuffix ? `${year} ${yearSuffix}` : `${year}`;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`${label ?? calendarId} calendar year ${yearLabel}`}
    >
      {months.map((month, index) => {
        const monthIndex = index + 1;
        const today = getTodayDayInMonth(calendarId, year, monthIndex);
        return (
          <MonthGrid
            key={monthIndex}
            calendarId={calendarId}
            year={year}
            monthIndex={monthIndex}
            monthNameEn={month.monthNameEn}
            monthNameOriginal={month.monthNameOriginal}
            daysCount={month.daysCount}
            firstWeekday={month.firstWeekday}
            isToday={today == null ? undefined : (day) => day === today}
            ariaLabel={`${month.monthNameEn} ${yearLabel}`}
          />
        );
      })}
    </section>
  );
}
