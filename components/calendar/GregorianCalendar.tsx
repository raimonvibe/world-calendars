"use client";

import { DateTime } from "luxon";
import MonthGrid from "./MonthGrid";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type GregorianCalendarProps = {
  year: number;
};

export default function GregorianCalendar({ year }: GregorianCalendarProps) {
  const today = DateTime.now();
  const isCurrentYear = today.year === year;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Gregorian calendar year ${year}`}
    >
      {MONTH_NAMES.map((monthName, index) => {
        const month = index + 1;
        const start = DateTime.local(year, month, 1);
        const daysInMonth = start.daysInMonth ?? 31;
        const firstWeekday = start.weekday; // 1 = Monday, 7 = Sunday
        const offset = firstWeekday - 1; // 0–6 for MonthGrid (0 = Monday)

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
            ariaLabel={`${monthName} ${year}`}
            calendarId="gregorian"
            year={year}
            monthIndex={month}
          />
        );
      })}
    </section>
  );
}
