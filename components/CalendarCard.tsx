"use client";

import Link from "next/link";
import type { CalendarInfo } from "@/lib/calendars";
import { CALENDAR_COUNTRIES, CALENDAR_ICONS } from "@/lib/calendarMeta";
import { CALENDAR_GRADIENTS, CALENDAR_GRADIENTS_DARK, CALENDAR_ACCENT } from "@/lib/calendarThemes";
import type { CalendarId } from "@/lib/types";
import { MapPin } from "lucide-react";

type CalendarCardProps = {
  info: CalendarInfo;
};

/**
 * Card: calendar gradient theme (light/dark), countries, icon, original + English date, facts.
 * Clicking the card goes to full calendar view for that calendar.
 */
export default function CalendarCard({ info }: CalendarCardProps) {
  const calendarId = info.id as CalendarId;
  const countries = CALENDAR_COUNTRIES[calendarId];
  const Icon = CALENDAR_ICONS[calendarId];
  const gradientLight = CALENDAR_GRADIENTS[calendarId];
  const gradientDark = CALENDAR_GRADIENTS_DARK[calendarId];
  const accent = CALENDAR_ACCENT[calendarId];

  return (
    <Link href={`/calendar/${info.id}`} className="block min-w-0 transition hover:opacity-95">
      <article className="relative min-h-[12rem] min-w-0 overflow-hidden rounded-2xl border border-zinc-200/60 shadow-lg transition hover:shadow-xl dark:border-zinc-600/40">
        {/* Per-calendar gradient: light mode */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity dark:opacity-0"
          style={{ background: gradientLight }}
          aria-hidden
        />
        {/* Per-calendar gradient: dark mode */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity dark:opacity-100"
          style={{ background: gradientDark }}
          aria-hidden
        />
        {/* Content overlay for readability */}
        <div className="relative z-10 min-w-0 rounded-2xl bg-white/80 p-4 backdrop-blur-sm dark:bg-black/40 sm:p-5">
          {/* Accent line */}
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-2xl sm:w-1.5"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div className="min-w-0 pl-3 sm:pl-4">
            {/* Top: where this calendar is used */}
            <div className="mb-2 flex min-w-0 items-start gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:mb-3">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 break-words leading-snug">Used in: {countries}</span>
            </div>

            {/* Icon + calendar name */}
            <div className="mb-2 flex min-w-0 items-center gap-2 sm:mb-3">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg opacity-90 sm:size-10 sm:rounded-xl"
                style={{ backgroundColor: `${accent}30` }}
                aria-hidden
              >
                <Icon className="size-4 text-zinc-700 dark:text-zinc-200 sm:size-5" strokeWidth={1.8} />
              </span>
              <h2 className="min-w-0 truncate text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-lg" title={info.name}>
                {info.name}
              </h2>
            </div>

            {/* Original script date (when available) */}
            {info.dateOriginal && (
              <p
                className="mb-1 min-w-0 break-words text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 sm:text-lg"
                dir="auto"
                lang={info.id === "hebrew" || info.id === "islamic" ? "he" : info.id === "chinese" ? "zh" : undefined}
              >
                {info.dateOriginal}
              </p>
            )}

            {/* English date */}
            <p className="min-w-0 break-words text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:text-base">
              {info.dateString}
            </p>

            {/* Facts with list style (no emojis) */}
            <ul className="mt-2 space-y-1 border-t border-zinc-200/60 pt-2 text-xs text-zinc-600 dark:border-zinc-500/40 dark:text-zinc-400 sm:mt-3 sm:pt-3 sm:text-sm">
              {info.facts.map((fact, i) => (
                <li key={i} className="flex min-w-0 gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" aria-hidden />
                  <span className="min-w-0 break-words">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
}
