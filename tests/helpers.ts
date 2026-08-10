/**
 * Ground truth for calendar tests.
 *
 * ICU (via Intl) ships reference implementations for most of the calendars this
 * app renders, so we assert against it rather than against hand-written expected
 * strings. Calendars ICU does not implement are pinned to hand-checked anchors.
 */

/** ICU calendar identifier for each app calendar id that has one. */
export const ICU_CALENDAR: Partial<Record<string, string>> = {
  islamic: "islamic-umalqura",
  hebrew: "hebrew",
  chinese: "chinese",
  korean: "dangi",
  persian: "persian",
  buddhist: "buddhist",
  "thai-solar": "buddhist",
  japanese: "japanese",
  coptic: "coptic",
  ethiopian: "ethiopic",
  hindu: "indian",
};

export type CalParts = {
  year?: number;
  month: string;
  day: number;
  era?: string;
  relatedYear?: number;
};

/** Convert a Gregorian Date into its parts in an ICU calendar. */
export function icuParts(icuCalendar: string, date: Date): CalParts {
  // No timeZone: the app reads dates with local-time getters throughout, so the
  // reference must be read the same way or results differ by machine.
  const parts = new Intl.DateTimeFormat(`en-u-ca-${icuCalendar}`, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    era: "short",
  }).formatToParts(date);

  const value = (type: string) => parts.find((p) => p.type === type)?.value;
  const num = (type: string) => {
    const raw = value(type);
    const parsed = raw == null ? NaN : Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  return {
    // Chinese and dangi expose relatedYear instead of a plain year.
    year: num("year"),
    // Hebrew returns month names, Chinese marks leap months as e.g. "6bis".
    month: value("month") ?? "",
    day: num("day") ?? NaN,
    era: value("era"),
    relatedYear: num("relatedYear"),
  };
}

/**
 * Local noon on the given Gregorian date. Noon rather than midnight so a DST
 * transition can never push the date onto the previous or next day.
 */
export function day(year: number, month: number, dayOfMonth: number): Date {
  return new Date(year, month - 1, dayOfMonth, 12, 0, 0, 0);
}

/**
 * Every `stepDays` days across a span of years, so a single test covers leap
 * years, month-length variation and new-year boundaries in each calendar.
 */
export function dateSweep(fromYear: number, toYear: number, stepDays = 11): Date[] {
  const dates: Date[] = [];
  const end = day(toYear, 12, 31).getTime();
  for (let d = day(fromYear, 1, 1); d.getTime() <= end; d = new Date(d.getTime() + stepDays * 86400000)) {
    // Re-normalise to local noon so DST shifts do not accumulate across the sweep.
    dates.push(day(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  }
  return dates;
}

/**
 * The real length and starting weekday of the calendar month containing
 * `date`, derived by walking days in ICU. This is the reference the app's own
 * month grids are checked against.
 */
export function icuMonthStructure(
  icuCalendar: string,
  date: Date
): { month: string; daysCount: number; firstWeekday: number } {
  const monthOf = (d: Date) => icuParts(icuCalendar, d).month;
  const month = monthOf(date);

  // Rewind to the first day of this month.
  let cursor = new Date(date);
  while (icuParts(icuCalendar, cursor).day !== 1) {
    cursor = new Date(cursor.getTime() - 86400000);
    cursor.setHours(12, 0, 0, 0);
  }
  const first = new Date(cursor);

  let daysCount = 0;
  while (monthOf(cursor) === month) {
    daysCount++;
    cursor = new Date(cursor.getTime() + 86400000);
    cursor.setHours(12, 0, 0, 0);
  }

  return { month, daysCount, firstWeekday: (first.getDay() + 6) % 7 };
}

/** Every distinct month length in the calendar year containing `date`. */
export function icuYearMonthLengths(icuCalendar: string, date: Date): number[] {
  const lengths: number[] = [];
  const seen = new Set<string>();
  let cursor = new Date(date);
  // Walk back roughly a year, then forward collecting each distinct month.
  cursor = new Date(cursor.getTime() - 200 * 86400000);
  cursor.setHours(12, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const structure = icuMonthStructure(icuCalendar, cursor);
    if (!seen.has(structure.month)) {
      seen.add(structure.month);
      lengths.push(structure.daysCount);
    }
    cursor = new Date(cursor.getTime() + 25 * 86400000);
    cursor.setHours(12, 0, 0, 0);
    if (seen.size >= 14) break;
  }
  return lengths;
}

/** Julian Day Number for a Gregorian date, used by the Mayan Long Count. */
export function julianDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) + 2440588;
}
