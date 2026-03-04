"use client";

import { DateTime } from "luxon";
import MonthGrid from "./MonthGrid";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type BuddhistCalendarProps = {
  year: number;
};

/** Buddhist Era: same structure as Gregorian, year = CE + 543 */
export default function BuddhistCalendar({ year }: BuddhistCalendarProps) {
  const gregorianYear = year - 543;
  const today = DateTime.now();
  const isCurrentYear = today.year === gregorianYear;

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={`Buddhist calendar year ${year} BE`}
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
                ? (day) =>
                    today.month === month && today.day === day
                : undefined
            }
            ariaLabel={`${monthName} ${year} BE`}
            calendarId="buddhist"
            year={year}
            monthIndex={month}
          />
        );
      })}
    </section>
  );
}
