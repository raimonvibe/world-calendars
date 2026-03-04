import Link from "next/link";
import DayCell from "./DayCell";
import type { CalendarId } from "@/lib/types";

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type MonthGridProps = {
  monthNameEn: string;
  monthNameOriginal?: string;
  daysCount: number;
  /** 0 = Monday, 1 = Tuesday, ... 6 = Sunday */
  firstWeekday: number;
  isToday?: (day: number) => boolean;
  /** Optional original numeral for each day (e.g. Arabic, Hebrew) */
  getDayOriginal?: (day: number) => string | undefined;
  ariaLabel?: string;
  /** When set, the whole month block is a link to the month view */
  calendarId?: CalendarId;
  year?: number;
  monthIndex?: number;
};

/**
 * One month block: title (en + optional original), weekday row, day grid.
 */
export default function MonthGrid({
  monthNameEn,
  monthNameOriginal,
  daysCount,
  firstWeekday,
  isToday,
  getDayOriginal,
  ariaLabel,
  calendarId,
  year,
  monthIndex,
}: MonthGridProps) {
  const offset = firstWeekday;
  const href =
    calendarId != null && year != null && monthIndex != null
      ? `/calendar/${calendarId}/${year}/${monthIndex}`
      : null;

  const content = (
    <article
      className={`rounded-xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70 ${href ? "transition hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-zinc-500/50 cursor-pointer" : ""}`}
      aria-label={ariaLabel ?? `${monthNameEn}`}
    >
      <h2 className="mb-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
        {monthNameOriginal ? (
          <>
            <span>{monthNameEn}</span>
            <span className="ml-1.5 text-sm font-normal opacity-80" dir="auto">
              / {monthNameOriginal}
            </span>
          </>
        ) : (
          monthNameEn
        )}
      </h2>

      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {WEEKDAY_NAMES.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} className="min-h-10 min-w-10 sm:min-h-11 sm:min-w-11" />
        ))}
        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;
          return (
            <DayCell
              key={day}
              day={day}
              isToday={isToday?.(day)}
              original={getDayOriginal?.(day)}
            />
          );
        })}
      </div>
    </article>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}
