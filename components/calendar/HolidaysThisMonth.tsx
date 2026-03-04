"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { CalendarId } from "@/lib/types";
import type { HolidayEntry } from "@/lib/holidays";
import { getHolidaysForDay } from "@/lib/holidays";
import { CALENDAR_ACCENT } from "@/lib/calendarThemes";

type DayHoliday = { day: number; holiday: HolidayEntry };

type HolidaysThisMonthProps = {
  calendarId: CalendarId;
  year: number;
  month: number;
  daysCount: number;
  monthNameEn: string;
};

export default function HolidaysThisMonth({
  calendarId,
  year,
  month,
  daysCount,
  monthNameEn,
}: HolidaysThisMonthProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const list = useMemo(() => {
    const out: DayHoliday[] = [];
    for (let day = 1; day <= daysCount; day++) {
      const holidays = getHolidaysForDay(calendarId, year, month, day);
      for (const holiday of holidays) {
        out.push({ day, holiday });
      }
    }
    return out;
  }, [calendarId, year, month, daysCount]);

  const accent = CALENDAR_ACCENT[calendarId];

  if (list.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70 sm:p-6"
      aria-label={`Holidays in ${monthNameEn}`}
    >
      <h2
        className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100 sm:text-xl"
        style={{ borderLeftColor: accent }}
      >
        <span
          className="block pl-3 sm:pl-4"
          style={{ borderLeft: `4px solid ${accent}` }}
        >
          Holidays this month
        </span>
      </h2>
      <ul className="flex flex-col gap-2 sm:gap-3">
        {list.map(({ day, holiday }) => {
          const key = `${day}-${holiday.id}`;
          const isExpanded = expandedId === key;
          const hasInfo = Boolean(holiday.infoEn);

          const rowContent = (
            <>
              <span className="flex shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden>
                {hasInfo ? (isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />) : null}
              </span>
              <span className="min-w-[2rem] text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Day {day}
              </span>
              <span className="min-w-0 flex-1 break-words font-medium text-zinc-900 dark:text-zinc-100">
                {holiday.nameOriginal ? (
                  <>
                    <span dir="auto" className="mr-1">{holiday.nameOriginal}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">/ {holiday.nameEn}</span>
                  </>
                ) : (
                  holiday.nameEn
                )}
              </span>
              {hasInfo && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isExpanded ? "Less" : "Read more"}
                </span>
              )}
            </>
          );

          return (
            <li
              key={key}
              className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white/80 dark:border-zinc-600/40 dark:bg-zinc-800/80"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: accent,
              }}
            >
              {hasInfo ? (
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : key)}
                  className="flex w-full min-h-[44px] items-center gap-2 px-3 py-3 text-left sm:px-4 sm:py-3"
                  aria-expanded={isExpanded}
                  aria-controls={`holiday-detail-${key}`}
                  id={`holiday-trigger-${key}`}
                >
                  {rowContent}
                </button>
              ) : (
                <div className="flex min-h-[44px] items-center gap-2 px-3 py-3 sm:px-4 sm:py-3">
                  {rowContent}
                </div>
              )}
              {hasInfo && (
                <div
                  id={`holiday-detail-${key}`}
                  role="region"
                  aria-labelledby={`holiday-trigger-${key}`}
                  className={`border-t border-zinc-200/60 dark:border-zinc-600/40 ${isExpanded ? "block" : "hidden"}`}
                >
                  <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4 sm:pt-2">
                    <p className="max-w-prose break-words text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                      {holiday.infoEn}
                    </p>
                    {holiday.infoUrl && (
                      <a
                        href={holiday.infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        Learn more
                        <ExternalLink className="size-4" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
