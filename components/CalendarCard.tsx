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
    <Link href={`/calendar/${info.id}`} className="block transition hover:opacity-95">
      <article className="relative overflow-hidden rounded-2xl border border-zinc-200/60 shadow-lg transition hover:shadow-xl dark:border-zinc-600/40">
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
        <div className="relative z-10 rounded-2xl bg-white/80 p-5 backdrop-blur-sm dark:bg-black/40">
          {/* Accent line */}
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div className="pl-3">
            {/* Top: where this calendar is used */}
            <div className="mb-3 flex items-start gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="leading-snug">Used in: {countries}</span>
            </div>

            {/* Icon + calendar name */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex size-10 items-center justify-center rounded-xl opacity-90"
                style={{ backgroundColor: `${accent}30` }}
                aria-hidden
              >
                <Icon className="size-5 text-zinc-700 dark:text-zinc-200" strokeWidth={1.8} />
              </span>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {info.name}
              </h2>
            </div>

            {/* Original script date (when available) */}
            {info.dateOriginal && (
              <p
                className="mb-1 text-lg font-medium leading-relaxed text-zinc-800 dark:text-zinc-200"
                dir="auto"
                lang={info.id === "hebrew" || info.id === "islamic" ? "he" : info.id === "chinese" ? "zh" : undefined}
              >
                {info.dateOriginal}
              </p>
            )}

            {/* English date */}
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
              {info.dateString}
            </p>

            {/* Facts with list style (no emojis) */}
            <ul className="mt-3 space-y-1 border-t border-zinc-200/60 pt-3 text-sm text-zinc-600 dark:border-zinc-500/40 dark:text-zinc-400">
              {info.facts.map((fact, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" aria-hidden />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
}
