"use client";

import Link from "next/link";
import DayCell from "./DayCell";

const BAHAI_MONTH_NAMES = [
  "Bahá", "Jalál", "Jamál", "ʻAẓamat", "Núr", "Raḥmat", "Kalimát", "Kamál", "Asmáʼ",
  "ʻIzzat", "Mashíyyat", "ʻIlm", "Qudrat", "Qawl", "Masáʼil", "Sharaf", "Sulṭán", "Mulk", "ʻAláʼ",
];

type BahaiCalendarProps = {
  year: number;
};

/**
 * Baha'i (Badi'): 19 months × 19 days + Ayyám-i-Há (intercalary).
 */
export default function BahaiCalendar({ year }: BahaiCalendarProps) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const intercalaryDays = isLeap ? 5 : 4;

  return (
    <section
      className="space-y-6"
      aria-label={`Baha'i (Badi') calendar year ${year}`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {BAHAI_MONTH_NAMES.map((monthName, monthIndex) => (
          <Link
            key={monthIndex}
            href={`/calendar/bahai/${year}/${monthIndex + 1}`}
            className="block transition hover:opacity-95"
          >
            <article
              className="rounded-xl border border-white/20 bg-white/70 p-3 shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:border-zinc-300/50 dark:border-zinc-600/30 dark:bg-zinc-800/70 dark:hover:border-zinc-500/50"
              aria-label={`${monthName} — Baha'i month ${monthIndex + 1}`}
            >
              <h2 className="mb-2 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {monthName}
              </h2>
              <div className="grid grid-cols-5 gap-0.5 text-center">
                {Array.from({ length: 19 }, (_, i) => (
                  <DayCell key={i} day={i + 1} />
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>

      <article
        className="rounded-xl border border-dashed border-white/30 bg-white/50 p-4 dark:border-zinc-500/40 dark:bg-zinc-800/50"
        aria-label="Ayyám-i-Há (Intercalary days)"
      >
        <h2 className="mb-2 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Ayyám-i-Há ({intercalaryDays} days)
        </h2>
        <p className="mb-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
          Intercalary days between Mulk and ʻAláʼ
        </p>
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: intercalaryDays }, (_, i) => (
            <DayCell key={i} day={i + 1} />
          ))}
        </div>
      </article>
    </section>
  );
}
