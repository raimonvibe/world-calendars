"use client";

import { DateTime } from "luxon";
import MonthGrid from "./MonthGrid";

const MONTH_NAMES = [
  "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
  "Assu", "Katak", "Maghar", "Poh", "Magh", "Phagun",
];

type SikhCalendarProps = {
  year: number;
};

/** Sikh (Nanakshahi): 12 months, year starts 1469 CE. NS year = CE - 1469 */
export default function SikhCalendar({ year }: SikhCalendarProps) {
  const gregorianYear = year + 1469;
  const today = DateTime.now();
  const isCurrentYear = today.year === gregorianYear;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Sikh (Nanakshahi) calendar year ${year} NS`}
    >
      {MONTH_NAMES.map((monthName, index) => {
        const month = index + 1;
        const start = DateTime.local(gregorianYear, month, 1);
        const daysInMonth = start.daysInMonth ?? 31;
        const offset = start.weekday - 1;
        return (
          <MonthGrid
            key={month}
            monthNameEn={monthName}
            daysCount={daysInMonth}
            firstWeekday={offset}
            isToday={
              isCurrentYear
                ? (day) => today.month === month && today.day === day
                : undefined
            }
            ariaLabel={`${monthName} ${year} NS`}
            calendarId="sikh"
            year={year}
            monthIndex={month}
          />
        );
      })}
    </section>
  );
}
