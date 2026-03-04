import type { HolidayEntry } from "@/lib/holidays";

type MonthDayCellProps = {
  day: number;
  isToday?: boolean;
  original?: string;
  /** Holidays and observances for this day */
  holidays?: HolidayEntry[];
};

/**
 * Spacious day cell for month view: day number + optional holiday list.
 * Touch-friendly min height; supports many holidays with scroll.
 */
export default function MonthDayCell({
  day,
  isToday,
  original,
  holidays = [],
}: MonthDayCellProps) {
  const holidaySummary = holidays.length > 0
    ? holidays.map((h) => h.nameEn).join(", ")
    : "";
  const ariaLabel = holidaySummary
    ? `Day ${day}${isToday ? ", today" : ""}. ${holidaySummary}`
    : `Day ${day}${isToday ? ", today" : ""}`;

  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      className={`flex min-h-[5rem] flex-col rounded-lg border p-2 sm:min-h-[6.5rem] md:min-h-[7rem] ${
        isToday
          ? "border-zinc-900 bg-zinc-900/10 dark:border-zinc-100 dark:bg-zinc-100/10"
          : "border-zinc-200/60 bg-white/80 dark:border-zinc-600/40 dark:bg-zinc-800/80"
      }`}
      aria-current={isToday ? "date" : undefined}
      title={original ? `${day} (${original})` : holidaySummary || undefined}
    >
      <span
        className={`text-base font-semibold sm:text-lg ${
          isToday ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {day}
      </span>
      {holidays.length > 0 && (
        <ul className="mt-1 flex flex-1 flex-col gap-0.5 overflow-auto text-left" aria-label="Holidays and observances">
          {holidays.map((h) => (
            <li
              key={h.id}
              className={`text-xs font-medium ${
                h.type === "holiday" ? "text-amber-700 dark:text-amber-400" : "text-zinc-600 dark:text-zinc-400"
              }`}
              title={h.description ?? (h.nameOriginal ?? h.nameEn)}
            >
              {h.nameOriginal ? (
                <span dir="auto" lang={/[\u0590-\u05FF]/.test(h.nameOriginal) ? "he" : "ar"}>
                  {h.nameOriginal}
                </span>
              ) : (
                h.nameEn
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
