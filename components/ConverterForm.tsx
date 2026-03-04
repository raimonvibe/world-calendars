"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ArrowRightLeft } from "lucide-react";
import { parseISODate, formatDisplayDate } from "@/lib/dateUtils";
import { convertToCalendar, CALENDAR_IDS } from "@/lib/converters";
import { getCalendarInfo } from "@/lib/calendars";
import { CALENDAR_NAMES } from "@/lib/calendarMeta";
import type { CalendarId } from "@/lib/types";

/**
 * Date picker + target calendar dropdown → output converted date.
 */
export default function ConverterForm() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [inputDate, setInputDate] = useState(todayISO);
  const [targetCalendar, setTargetCalendar] = useState<CalendarId>("hebrew");
  const [result, setResult] = useState<string | null>(null);
  const [resultOriginal, setResultOriginal] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const d = parseISODate(inputDate);
    const info = getCalendarInfo(targetCalendar, d);
    setResult(info.dateString);
    setResultOriginal(info.dateOriginal ?? null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/20 bg-white/70 p-5 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70 sm:p-6">
      <div>
        <label htmlFor="date" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <CalendarIcon className="size-4" aria-hidden />
          Pick a date
        </label>
        <input
          id="date"
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="calendar" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Target calendar
        </label>
        <select
          id="calendar"
          value={targetCalendar}
          onChange={(e) => setTargetCalendar(e.target.value as CalendarId)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {CALENDAR_IDS.map((id) => (
            <option key={id} value={id}>
              {CALENDAR_NAMES[id]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <ArrowRightLeft className="size-4" aria-hidden />
        Convert
      </button>
      {result !== null && (
        <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/90 p-4 dark:border-zinc-600/50 dark:bg-zinc-800/80">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatDisplayDate(parseISODate(inputDate))} in {CALENDAR_NAMES[targetCalendar]}:
          </p>
          {resultOriginal && (
            <p className="mt-1 text-lg font-medium leading-relaxed text-zinc-800 dark:text-zinc-200" dir="auto">
              {resultOriginal}
            </p>
          )}
          <p className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 ${resultOriginal ? "mt-0.5" : "mt-1"}`}>
            {result}
          </p>
        </div>
      )}
    </form>
  );
}
