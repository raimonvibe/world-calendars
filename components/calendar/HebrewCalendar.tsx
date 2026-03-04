"use client";

import { useMemo } from "react";
import {
  getHebrewYearStructure,
  getTodayHebrew,
} from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type HebrewCalendarProps = {
  year: number;
};

export default function HebrewCalendar({ year }: HebrewCalendarProps) {
  const structure = useMemo(() => getHebrewYearStructure(year), [year]);
  const todayHijri = useMemo(() => getTodayHebrew(), []);

  const isCurrentYear = todayHijri?.year === year;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Hebrew calendar year ${year}`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          key={index}
          monthNameEn={month.monthNameEn}
          monthNameOriginal={month.monthNameOriginal}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          isToday={
            isCurrentYear && todayHijri && month.monthNum != null
              ? (day) =>
                  todayHijri.month === month.monthNum && todayHijri.day === day
              : undefined
          }
          ariaLabel={`${month.monthNameEn} ${year}`}
          calendarId="hebrew"
          year={year}
          monthIndex={index + 1}
        />
      ))}
    </section>
  );
}
