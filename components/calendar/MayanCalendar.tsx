"use client";

import { useMemo } from "react";
import {
  mayanLongCountFromRd,
  formatLongCount,
  tzolkinFromRd,
  haabFromRd,
} from "@/lib/traditionalCalendars";
import { rdFromDate } from "@/lib/calendarMath";
import StructuredYear from "./StructuredYear";

type MayanCalendarProps = {
  year: number;
};

/**
 * Mayan: today's Long Count and Calendar Round, above the Haabʼ year grid.
 *
 * This component used to compute the Long Count from its own epoch,
 * `new Date(-3114, 7, 11)`, which is astronomical year -3114 and therefore
 * 3115 BCE - a second copy of the same off-by-one-year bug that was in
 * lib/calendars. Both now come from the correlation constant 584283.
 */
export default function MayanCalendar({ year }: MayanCalendarProps) {
  const today = useMemo(() => {
    const rd = rdFromDate(new Date());
    return {
      longCount: formatLongCount(mayanLongCountFromRd(rd)),
      tzolkin: tzolkinFromRd(rd),
      haab: haabFromRd(rd),
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-6" aria-label="Mayan calendar — Long Count, Tzolkin, Haab">
        <article
          className="rounded-xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
          aria-label="Long Count"
        >
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Long Count
          </h2>
          <p className="font-mono text-2xl text-zinc-700 dark:text-zinc-300">
            {today.longCount}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Baktun.Katun.Tun.Uinal.Kin — cycles of 20 (except Tun: 18 Uinal)
          </p>
        </article>

        <div className="grid gap-6 sm:grid-cols-2">
          <article
            className="rounded-xl border border-white/20 bg-white/70 p-5 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
            aria-label="Tzolkin (260-day sacred count)"
          >
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Tzolkʼin
            </h2>
            <p className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
              {today.tzolkin.number} {today.tzolkin.name}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              260-day cycle — 13 numbers × 20 day names
            </p>
          </article>

          <article
            className="rounded-xl border border-white/20 bg-white/70 p-5 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
            aria-label="Haab (365-day solar count)"
          >
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Haabʼ
            </h2>
            <p className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
              {today.haab.day} {today.haab.month}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              365-day year — 18 months × 20 days + 5 Wayebʼ
            </p>
          </article>
        </div>
      </section>

      <StructuredYear calendarId="mayan" year={year} label="Mayan Haab" />
    </div>
  );
}
