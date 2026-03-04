"use client";

import { useMemo } from "react";
import {
  getPersianYearStructure,
  getTodayPersian,
  toPersianNumeral,
} from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type PersianCalendarProps = {
  year: number;
};

export default function PersianCalendar({ year }: PersianCalendarProps) {
  const structure = useMemo(() => getPersianYearStructure(year), [year]);
  const todayPersian = useMemo(() => getTodayPersian(), []);

  const isCurrentYear = todayPersian?.year === year;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Persian (Solar Hijri) calendar year ${year}`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          key={index}
          monthNameEn={month.monthNameEn}
          monthNameOriginal={month.monthNameOriginal}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          isToday={
            isCurrentYear && todayPersian
              ? (day) =>
                  todayPersian.month === index + 1 && todayPersian.day === day
              : undefined
          }
          getDayOriginal={(day) => toPersianNumeral(day)}
          ariaLabel={`${month.monthNameEn} ${year}`}
          calendarId="persian"
          year={year}
          monthIndex={index + 1}
        />
      ))}
    </section>
  );
}
