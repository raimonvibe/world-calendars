/**
 * Calendar conversion backed by ICU, via the Intl API built into the runtime.
 *
 * ICU ships reference implementations of most of the calendars this app shows,
 * so the arithmetic here is limited to searching and grouping - the calendar
 * rules themselves (leap years, leap months, variable month lengths, era
 * boundaries) come from ICU rather than from hand-written offsets.
 *
 * Intl only converts Gregorian -> calendar, so going the other way (given a
 * calendar year, which Gregorian day does it start on?) is a binary search.
 * Results are memoised per calendar-year because a page renders one year.
 */

/** ICU calendar identifiers for the calendars this app renders. */
export const ICU_CALENDARS = {
  islamic: "islamic-umalqura",
  coptic: "coptic",
  ethiopian: "ethiopic",
  chinese: "chinese",
  korean: "dangi",
  hindu: "indian",
  japanese: "japanese",
  persian: "persian",
  buddhist: "buddhist",
} as const;

export type IcuCalendar = (typeof ICU_CALENDARS)[keyof typeof ICU_CALENDARS];

export type IcuMonth = {
  /** 1-based position within the calendar year, counting leap months in place. */
  index: number;
  /** ICU's month token. Chinese leap months look like "6bis". */
  token: string;
  nameEn: string;
  daysCount: number;
  /** 0 = Monday ... 6 = Sunday, matching the app's grid. */
  firstWeekday: number;
  firstGregorian: Date;
};

export type IcuYear = {
  year: number;
  months: IcuMonth[];
};

const MS_PER_DAY = 86_400_000;

/** Gregorian bounds for the binary search. Covers every year the app serves. */
const SEARCH_MIN = Date.UTC(1700, 0, 1);
const SEARCH_MAX = Date.UTC(2300, 0, 1);

const numericFormatters = new Map<string, Intl.DateTimeFormat>();
const namedFormatters = new Map<string, Intl.DateTimeFormat>();

function numericFormatter(calendar: string): Intl.DateTimeFormat {
  let formatter = numericFormatters.get(calendar);
  if (!formatter) {
    // No `era` here: requesting it makes ICU return the Chinese month as
    // "Mo6" rather than "6", which breaks month-number parsing. Japanese eras
    // are read through their own formatter where they are actually needed.
    formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    numericFormatters.set(calendar, formatter);
  }
  return formatter;
}

function namedFormatter(calendar: string): Intl.DateTimeFormat {
  let formatter = namedFormatters.get(calendar);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, { month: "long" });
    namedFormatters.set(calendar, formatter);
  }
  return formatter;
}

export type IcuDate = {
  /** Chinese and dangi have no era year, so their relatedYear is used. */
  year: number;
  /** ICU's month token: "6" normally, "6bis" for a leap month. */
  monthToken: string;
  day: number;
};

/** True when the token marks a lunisolar leap month. */
export function isLeapMonthToken(token: string): boolean {
  return token.includes("bis");
}

/** The month number from an ICU token, tolerant of any non-digit decoration. */
export function icuMonthNumber(token: string): number {
  return parseInt(token.replace(/\D+/g, ""), 10);
}

/** Read a Gregorian date's parts in the given ICU calendar. */
export function readIcuDate(calendar: string, date: Date): IcuDate {
  const parts = numericFormatter(calendar).formatToParts(date);
  const value = (type: string) => parts.find((p) => p.type === type)?.value;

  const year = Number(value("year"));
  const relatedYear = Number(value("relatedYear"));

  return {
    year: Number.isFinite(year) ? year : relatedYear,
    monthToken: value("month") ?? "",
    day: Number(value("day")),
  };
}

/** English month name for the month containing `date`. */
export function readIcuMonthName(calendar: string, date: Date): string {
  return namedFormatter(calendar).formatToParts(date).find((p) => p.type === "month")?.value ?? "";
}

/** Local noon, so a DST transition can never shift the calendar day. */
function atNoon(time: number): Date {
  const d = new Date(time);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

/**
 * The first Gregorian day of the given calendar year, or null if that year
 * falls outside the searchable range.
 */
function findYearStart(calendar: string, targetYear: number): Date | null {
  let lo = SEARCH_MIN;
  let hi = SEARCH_MAX;

  // Smallest day whose calendar year is >= targetYear.
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / (2 * MS_PER_DAY)) * MS_PER_DAY;
    if (mid === lo) break;
    if (readIcuDate(calendar, atNoon(mid)).year < targetYear) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // The search lands within a day of the boundary; step to the exact one.
  let cursor = atNoon(lo);
  for (let i = 0; i < 800; i++) {
    if (readIcuDate(calendar, cursor).year >= targetYear) break;
    cursor = atNoon(cursor.getTime() + MS_PER_DAY);
  }
  if (readIcuDate(calendar, cursor).year !== targetYear) return null;

  // Walk back to the first day of that year.
  for (let i = 0; i < 800; i++) {
    const previous = atNoon(cursor.getTime() - MS_PER_DAY);
    if (readIcuDate(calendar, previous).year !== targetYear) break;
    cursor = previous;
  }
  return cursor;
}

const yearCache = new Map<string, IcuYear | null>();

/**
 * Every month of the given calendar year, in order, with real lengths and
 * starting weekdays. Leap months appear in place, so a Chinese leap year has
 * 13 entries and a Hebrew-style 13th month would too.
 */
export function getIcuYear(calendar: string, year: number): IcuYear | null {
  const key = `${calendar}:${year}`;
  const cached = yearCache.get(key);
  if (cached !== undefined) return cached;

  const start = findYearStart(calendar, year);
  if (!start) {
    yearCache.set(key, null);
    return null;
  }

  const months: IcuMonth[] = [];
  let cursor = start;
  let current: IcuMonth | null = null;

  // A calendar year is at most ~385 days; the cap guards against a runaway.
  for (let i = 0; i < 400; i++) {
    const parts = readIcuDate(calendar, cursor);
    if (parts.year !== year) break;

    if (!current || current.token !== parts.monthToken) {
      current = {
        index: months.length + 1,
        token: parts.monthToken,
        nameEn: readIcuMonthName(calendar, cursor),
        daysCount: 0,
        firstWeekday: (cursor.getDay() + 6) % 7,
        firstGregorian: cursor,
      };
      months.push(current);
    }
    current.daysCount++;
    cursor = atNoon(cursor.getTime() + MS_PER_DAY);
  }

  const result = months.length > 0 ? { year, months } : null;
  yearCache.set(key, result);
  return result;
}

/** Where a Gregorian date falls in its ICU calendar year: year, month index, day. */
export function getIcuPosition(
  calendar: string,
  date: Date
): { year: number; monthIndex: number; day: number } | null {
  const parts = readIcuDate(calendar, date);
  const icuYear = getIcuYear(calendar, parts.year);
  if (!icuYear) return null;

  const month = icuYear.months.find((m) => m.token === parts.monthToken);
  if (!month) return null;

  return { year: parts.year, monthIndex: month.index, day: parts.day };
}

/** The most months any year of this calendar has, across the served window. */
export function getIcuMonthCount(calendar: string, aroundYear: number, span = 8): number {
  let max = 12;
  for (let year = aroundYear - span; year <= aroundYear + span; year++) {
    const icuYear = getIcuYear(calendar, year);
    if (icuYear) max = Math.max(max, icuYear.months.length);
  }
  return max;
}
