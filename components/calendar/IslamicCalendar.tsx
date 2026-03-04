"use client";

import { useMemo } from "react";
import {
  getIslamicYearStructure,
  getTodayHijri,
  toArabicNumeral,
} from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type IslamicCalendarProps = {
  year: number;
};

export default function IslamicCalendar({ year }: IslamicCalendarProps) {
  const structure = useMemo(() => getIslamicYearStructure(year), [year]);
  const todayHijri = useMemo(() => getTodayHijri(), []);

  const isCurrentYear = todayHijri?.year === year;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Islamic (Hijri) calendar year ${year} AH`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          key={index}
          monthNameEn={month.monthNameEn}
          monthNameOriginal={month.monthNameOriginal}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          isToday={
            isCurrentYear && todayHijri
              ? (day) =>
                  todayHijri.month === index + 1 && todayHijri.day === day
              : undefined
          }
          getDayOriginal={(day) => toArabicNumeral(day)}
          ariaLabel={`${month.monthNameEn} ${year} AH`}
          calendarId="islamic"
          year={year}
          monthIndex={index + 1}
        />
      ))}
    </section>
  );
}
