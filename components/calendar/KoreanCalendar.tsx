"use client";

import { useMemo } from "react";
import { getChineseYearStructure } from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type KoreanCalendarProps = {
  year: number;
};

/** Korean (Lunar-Solar): same structure as Chinese for Phase C */
export default function KoreanCalendar({ year }: KoreanCalendarProps) {
  const structure = useMemo(() => getChineseYearStructure(year), [year]);

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Korean (Lunar-Solar) calendar year ${year}`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          key={index}
          monthNameEn={month.monthNameEn}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          ariaLabel={`${month.monthNameEn} ${year}`}
          calendarId="korean"
          year={year}
          monthIndex={index + 1}
        />
      ))}
    </section>
  );
}
