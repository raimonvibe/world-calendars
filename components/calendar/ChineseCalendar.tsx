"use client";

import { useMemo } from "react";
import { getChineseYearStructure } from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type ChineseCalendarProps = {
  year: number;
};

/** Chinese (Lunar): simplified 12-month structure for Phase C */
export default function ChineseCalendar({ year }: ChineseCalendarProps) {
  const structure = useMemo(() => getChineseYearStructure(year), [year]);

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Chinese (Lunar) calendar year ${year}`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          key={index}
          monthNameEn={month.monthNameEn}
          monthNameOriginal={month.monthNameOriginal}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          ariaLabel={`${month.monthNameEn} ${year}`}
          calendarId="chinese"
          year={year}
          monthIndex={index + 1}
        />
      ))}
    </section>
  );
}
