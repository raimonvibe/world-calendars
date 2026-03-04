"use client";

import { useMemo } from "react";
import { getEthiopianYearStructure } from "@/lib/calendarViews";
import MonthGrid from "./MonthGrid";

type EthiopianCalendarProps = {
  year: number;
};

export default function EthiopianCalendar({ year }: EthiopianCalendarProps) {
  const structure = useMemo(() => getEthiopianYearStructure(year), [year]);

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Ethiopian calendar year ${year}`}
    >
      {structure.map((month, index) => (
        <MonthGrid
          calendarId="ethiopian"
          year={year}
          monthIndex={index + 1}
          key={index}
          monthNameEn={month.monthNameEn}
          daysCount={month.daysCount}
          firstWeekday={month.firstWeekday}
          ariaLabel={`${month.monthNameEn} ${year}`}
        />
      ))}
    </section>
  );
}
