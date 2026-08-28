/**
 * Year structure and weekday names for full calendar views.
 * Used by calendar components (e.g. Islamic, Gregorian uses Luxon directly).
 */

import { HDate } from "@hebcal/core";
import { DateTime } from "luxon";
import {
  ICU_CALENDARS,
  getIcuYear,
  getIcuPosition,
  isLeapMonthToken,
  icuMonthNumber,
} from "./icu";
import { rdFromDate, weekdayFromRd, gregorianFromRd } from "./calendarMath";
import { nowruzRd } from "./astronomy";
import {
  armenianFromRd, rdFromArmenian, armenianMonthLength, ARMENIAN_MONTHS, ARMENIAN_MONTHS_HY,
  nanakshahiFromRd, rdFromNanakshahi, nanakshahiMonthLength, NANAKSHAHI_MONTHS, NANAKSHAHI_MONTHS_PA,
  assyrianFromRd, rdFromAssyrian, assyrianMonthLength, ASSYRIAN_MONTHS, ASSYRIAN_MONTHS_SYR,
  bahaiFromRd, rdFromBahai, bahaiMonthLength, BAHAI_MONTHS, BAHAI_MONTHS_IN_YEAR,
  javaneseFromRd, rdFromJavanese, javaneseMonthLength, JAVANESE_MONTHS,
  haabYearFromRd, rdFromHaabYear, haabMonthLength, HAAB_MONTHS,
} from "./traditionalCalendars";

/**
 * The calendars computed in lib/traditionalCalendars, described uniformly so
 * the year offset, the month grid and the today marker all come from the same
 * implementation. Keeping a second hand-maintained offset per calendar is what
 * let the Armenian date string and its year navigation disagree by 1104 years.
 */
type TraditionalCalendar = {
  fromRd: (rd: number) => { year: number; month: number; day: number };
  toRd: (year: number, month: number, day: number) => number;
  monthLength: (year: number, month: number) => number;
  monthsInYear: number;
  namesEn: string[];
  namesOriginal?: string[];
};

const TRADITIONAL: Record<string, TraditionalCalendar> = {
  armenian: {
    fromRd: armenianFromRd,
    toRd: rdFromArmenian,
    monthLength: (_year, month) => armenianMonthLength(month),
    monthsInYear: 13,
    namesEn: ARMENIAN_MONTHS,
    namesOriginal: ARMENIAN_MONTHS_HY,
  },
  sikh: {
    fromRd: nanakshahiFromRd,
    toRd: rdFromNanakshahi,
    monthLength: nanakshahiMonthLength,
    monthsInYear: 12,
    namesEn: NANAKSHAHI_MONTHS,
    namesOriginal: NANAKSHAHI_MONTHS_PA,
  },
  assyrian: {
    fromRd: assyrianFromRd,
    toRd: rdFromAssyrian,
    monthLength: assyrianMonthLength,
    monthsInYear: 12,
    namesEn: ASSYRIAN_MONTHS,
    namesOriginal: ASSYRIAN_MONTHS_SYR,
  },
  bahai: {
    fromRd: bahaiFromRd,
    toRd: rdFromBahai,
    monthLength: bahaiMonthLength,
    monthsInYear: BAHAI_MONTHS_IN_YEAR,
    namesEn: BAHAI_MONTHS,
  },
  javanese: {
    fromRd: javaneseFromRd,
    toRd: rdFromJavanese,
    monthLength: javaneseMonthLength,
    monthsInYear: 12,
    namesEn: JAVANESE_MONTHS,
  },
  mayan: {
    fromRd: haabYearFromRd,
    toRd: rdFromHaabYear,
    monthLength: (_year, month) => haabMonthLength(month),
    monthsInYear: 19,
    namesEn: HAAB_MONTHS,
  },
};

const ISLAMIC_MONTH_NAMES_AR = [
  "مُحَرَّم", "صَفَر", "رَبِيع ٱلْأَوَّل", "رَبِيع ٱلثَّانِي", "جُمَادَىٰ ٱلْأُولَىٰ", "جُمَادَىٰ ٱلثَّانِيَة",
  "رَجَب", "شَعْبَان", "رَمَضَان", "شَوَّال", "ذُو ٱلْقَعْدَة", "ذُو ٱلْحِجَّة",
];

export type IslamicMonthStructure = {
  monthNameEn: string;
  monthNameOriginal?: string;
  daysCount: number;
  /** 0 = Monday, 6 = Sunday */
  firstWeekday: number;
};

/**
 * Month structure for any ICU-backed calendar. Month names, lengths and leap
 * months all come from ICU, so this one function serves every such calendar.
 */
function icuStructure(
  calendar: string,
  year: number,
  originalNames?: string[]
): MonthStructure[] {
  const icuYear = getIcuYear(calendar, year);
  if (!icuYear) return [];

  return icuYear.months.map((month, i) => ({
    monthNameEn: month.nameEn,
    monthNameOriginal: originalNames?.[i],
    daysCount: month.daysCount,
    firstWeekday: month.firstWeekday,
  }));
}

export function getIslamicYearStructure(hijriYear: number): IslamicMonthStructure[] {
  return icuStructure(ICU_CALENDARS.islamic, hijriYear, ISLAMIC_MONTH_NAMES_AR);
}

/** Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) for day display */
export function toArabicNumeral(n: number): string {
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return n < 10 ? ar[n] ?? String(n) : String(n).split("").map((d) => ar[+d] ?? d).join("");
}

/** Persian numerals (۰۱۲۳۴۵۶۷۸۹) for day display */
export function toPersianNumeral(n: number): string {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  return n < 10 ? fa[n] ?? String(n) : String(n).split("").map((d) => fa[+d] ?? d).join("");
}

/** Today's position in an ICU-backed calendar, for "today" highlighting. */
function todayIn(calendar: string): { year: number; month: number; day: number } | null {
  const position = getIcuPosition(calendar, new Date());
  return position && { year: position.year, month: position.monthIndex, day: position.day };
}

/** Get today's Hijri date (year, month, day) for highlighting. */
export function getTodayHijri(): { year: number; month: number; day: number } | null {
  return todayIn(ICU_CALENDARS.islamic);
}

/**
 * Default year for a calendar view when there is no ?year= param.
 *
 * Every branch is derived from the implementation that renders the date, so
 * the navigation cannot drift from what the calendar actually says. The old
 * hand-written offsets were wrong for part of every year wherever a calendar's
 * new year is not 1 January - and the Armenian pair disagreed by 1104 years.
 */
export function getDefaultYearForCalendar(calendarId: string): number {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const rd = rdFromDate(now);

  // The library-backed cases can yield NaN when the underlying package fails to
  // load, and `??` does not catch NaN. A non-finite default would poison the
  // served year range and 404 every month page for that calendar.
  const finite = (value: number | undefined, fallback: number) =>
    Number.isFinite(value) ? (value as number) : fallback;

  const traditional = TRADITIONAL[calendarId];
  if (traditional) return traditional.fromRd(rd).year;

  switch (calendarId) {
    // ICU-backed: read the year from the calendar itself rather than keeping a
    // second, hand-maintained offset that can drift from the implementation.
    case "islamic":
      return finite(todayIn(ICU_CALENDARS.islamic)?.year, gregorianYear - 579);
    case "ethiopian":
      return finite(todayIn(ICU_CALENDARS.ethiopian)?.year, gregorianYear - 8);
    case "coptic":
      return finite(todayIn(ICU_CALENDARS.coptic)?.year, gregorianYear - 284);
    case "hindu":
      return finite(todayIn(ICU_CALENDARS.hindu)?.year, gregorianYear - 78);
    case "chinese":
      return finite(todayIn(ICU_CALENDARS.chinese)?.year, gregorianYear);
    case "korean":
      return finite(todayIn(ICU_CALENDARS.korean)?.year, gregorianYear);
    case "hebrew":
      return finite(getTodayHebrew()?.year, gregorianYear + 3761);
    case "buddhist":
    case "thai-solar":
      // Thailand's Buddhist year has rolled over on 1 January since 1941.
      return gregorianYear + 543;
    case "persian":
      // The Solar Hijri year rolls over at Nowruz, not on 1 January.
      return gregorianYear - 621 - (rd < nowruzRd(gregorianYear) ? 1 : 0);
    default:
      return gregorianYear;
  }
}

// --- Hebrew (Hebcal) ---
export type MonthStructure = {
  monthNameEn: string;
  monthNameOriginal?: string;
  daysCount: number;
  firstWeekday: number;
  /** Hebrew month number (1-13) when from getHebrewYearStructure */
  monthNum?: number;
};

export function getHebrewYearStructure(hebrewYear: number): MonthStructure[] {
  const result: MonthStructure[] = [];
  const numMonths = HDate.monthsInYear(hebrewYear);
  const yearOrder: number[] = [7, 8, 9, 10, 11, 12];
  if (numMonths === 13) yearOrder.push(13);
  yearOrder.push(1, 2, 3, 4, 5, 6);

  for (const monthNum of yearOrder) {
    const daysCount = HDate.daysInMonth(monthNum, hebrewYear);
    const hd = new HDate(1, monthNum, hebrewYear);
    const greg = hd.greg();
    const firstWeekday = (greg.getDay() + 6) % 7;
    const monthName = HDate.getMonthName(monthNum, hebrewYear);
    result.push({
      monthNameEn: monthName,
      monthNameOriginal: HEBREW_MONTH_NAMES_HE[monthNum],
      daysCount,
      firstWeekday,
      monthNum,
    });
  }
  return result;
}

/** Hebrew month names in Hebrew script (optional, for display) */
const HEBREW_MONTH_NAMES_HE: Record<number, string> = {
  1: "ניסן", 2: "אייר", 3: "סיון", 4: "תמוז", 5: "אב", 6: "אלול",
  7: "תשרי", 8: "חשון", 9: "כסלו", 10: "טבת", 11: "שבט", 12: "אדר", 13: "אדר ב׳",
};

export function getTodayHebrew(): { year: number; month: number; day: number } | null {
  try {
    const h = new HDate(new Date());
    return { year: h.getFullYear(), month: h.getMonth(), day: h.getDate() };
  } catch {
    return null;
  }
}

// --- Persian (Luxon) ---
const PERSIAN_MONTH_NAMES = [
  "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
  "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand",
];
const PERSIAN_MONTH_NAMES_FA = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

/**
 * Six months of 31 days, five of 30, and Esfand running to the next Nowruz.
 *
 * This used to call `DateTime.fromObject({ year, month }, { outputCalendar: "persian" })`,
 * but Luxon's `outputCalendar` only affects formatting - it does not interpret
 * input - so that built Gregorian year 1405 CE and reported February as 28 days.
 */
export function getPersianYearStructure(persianYear: number): MonthStructure[] {
  const yearStart = nowruzRd(persianYear + 621);
  const nextYearStart = nowruzRd(persianYear + 622);

  const result: MonthStructure[] = [];
  let cursor = yearStart;
  for (let month = 1; month <= 12; month++) {
    const daysCount =
      month <= 6 ? 31 : month <= 11 ? 30 : nextYearStart - cursor;
    result.push({
      monthNameEn: PERSIAN_MONTH_NAMES[month - 1] ?? "",
      monthNameOriginal: PERSIAN_MONTH_NAMES_FA[month - 1],
      daysCount,
      firstWeekday: weekdayFromRd(cursor),
    });
    cursor += daysCount;
  }
  return result;
}

/** RD of the first day of a Persian month. */
function rdFromPersian(persianYear: number, month: number, day: number): number {
  const offset = month <= 6 ? 31 * (month - 1) : 6 * 31 + 30 * (month - 7);
  return nowruzRd(persianYear + 621) + offset + day - 1;
}

/** Which Persian year, month and day an RD falls on. */
function persianFromRd(rd: number): { year: number; month: number; day: number } {
  const { year: g } = gregorianFromRd(rd);
  const year = g - 621 - (rd < nowruzRd(g) ? 1 : 0);
  const dayOfYear = rd - nowruzRd(year + 621);
  const month =
    dayOfYear < 186 ? Math.floor(dayOfYear / 31) + 1 : Math.floor((dayOfYear - 186) / 30) + 7;
  return { year, month, day: rd - rdFromPersian(year, month, 1) + 1 };
}

/**
 * Luxon's `.year` / `.month` / `.day` getters stay Gregorian whatever
 * `outputCalendar` says, so reading them off a reconfigured DateTime returned
 * today's Gregorian date and the Persian month view never highlighted today.
 */
export function getTodayPersian(): { year: number; month: number; day: number } | null {
  try {
    return persianFromRd(rdFromDate(new Date()));
  } catch {
    return null;
  }
}

// --- Ethiopian (13 months) ---
const ETHIOPIAN_MONTH_NAMES = [
  "Meskerem", "Tikimit", "Hidar", "Tahesas", "Tir", "Yekatit", "Megabit",
  "Miazia", "Genbot", "Sene", "Hamle", "Nehase", "Pagumen",
];

export function getEthiopianYearStructure(ethiopianYear: number): MonthStructure[] {
  return icuStructure(ICU_CALENDARS.ethiopian, ethiopianYear);
}

export function getCopticYearStructure(copticYear: number): MonthStructure[] {
  return icuStructure(ICU_CALENDARS.coptic, copticYear);
}

export function getIndianYearStructure(sakaYear: number): MonthStructure[] {
  return icuStructure(ICU_CALENDARS.hindu, sakaYear);
}

// --- Chinese / Korean (lunisolar, 12 or 13 months with a leap month) ---
const CHINESE_MONTH_NAMES_ZH = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "冬月", "腊月",
];

/**
 * ICU names Chinese months "First Month".."Twelfth Month" and marks a leap
 * month with a "bis" token, so the Chinese-script label has to be derived from
 * the month's position rather than looked up by index.
 */
function chineseStructure(calendar: string, lunarYear: number): MonthStructure[] {
  const icuYear = getIcuYear(calendar, lunarYear);
  if (!icuYear) return [];

  return icuYear.months.map((month) => {
    const isLeap = isLeapMonthToken(month.token);
    const number = icuMonthNumber(month.token);
    return {
      monthNameEn: isLeap ? `Leap ${month.nameEn}` : month.nameEn,
      monthNameOriginal: `${isLeap ? "闰" : ""}${CHINESE_MONTH_NAMES_ZH[number - 1] ?? `${number}月`}`,
      daysCount: month.daysCount,
      firstWeekday: month.firstWeekday,
    };
  });
}

export function getChineseYearStructure(lunarYear: number): MonthStructure[] {
  return chineseStructure(ICU_CALENDARS.chinese, lunarYear);
}

export function getKoreanYearStructure(lunarYear: number): MonthStructure[] {
  return chineseStructure(ICU_CALENDARS.korean, lunarYear);
}

// --- Month view: single month structure for any calendar ---
export type MonthInfo = {
  monthNameEn: string;
  monthNameOriginal?: string;
  daysCount: number;
  /** 0 = Monday, 6 = Sunday */
  firstWeekday: number;
};

/**
 * Max month number (1-based) per calendar. This is the ceiling, not the count:
 * a Hebrew common year has 12 months and a Chinese common year has 12, so
 * getMonthInfo returns null for the absent 13th and the route redirects.
 */
export const MONTH_RANGES: Record<string, number> = {
  gregorian: 12, persian: 12, japanese: 12, buddhist: 12, "thai-solar": 12,
  javanese: 12, sikh: 12, assyrian: 12, hindu: 12, islamic: 12,
  // Lunisolar and 13-month calendars.
  hebrew: 13, ethiopian: 13, coptic: 13, chinese: 13, korean: 13,
  // The traditional Armenian year is 12 months of 30 days plus the five
  // epagomenal days of Aweleac, which need a slot of their own.
  armenian: 13,
  // Eighteen 19-day months, then Ayyam-i-Ha, then the 19-day month of the fast.
  bahai: 20,
  // The Haab round: eighteen 20-day months plus the five days of Wayeb. Without
  // an entry here getMonthInfo returned null and every Mayan month page 404d.
  mayan: 19,
};

/**
 * How many years either side of a calendar's current year we serve pages for.
 * Outside this window the routes 404 and the prev/next controls are disabled,
 * so crawlers can't walk the month/year links forever.
 */
export const YEAR_SPAN = 100;

export function getYearRangeForCalendar(calendarId: string): { minYear: number; maxYear: number } {
  const current = getDefaultYearForCalendar(calendarId);
  return { minYear: current - YEAR_SPAN, maxYear: current + YEAR_SPAN };
}

export function isYearInRange(calendarId: string, year: number): boolean {
  const { minYear, maxYear } = getYearRangeForCalendar(calendarId);
  return Number.isInteger(year) && year >= minYear && year <= maxYear;
}

export function clampYearToRange(calendarId: string, year: number): number {
  const { minYear, maxYear } = getYearRangeForCalendar(calendarId);
  if (!Number.isFinite(year)) return getDefaultYearForCalendar(calendarId);
  return Math.min(Math.max(Math.trunc(year), minYear), maxYear);
}

const GREGORIAN_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getMonthInfo(
  calendarId: string,
  year: number,
  month: number
): MonthInfo | null {
  const max = MONTH_RANGES[calendarId];
  if (max == null || month < 1 || month > max) return null;

  switch (calendarId) {
    case "gregorian": {
      const start = DateTime.local(year, month, 1);
      return {
        monthNameEn: GREGORIAN_MONTH_NAMES[month - 1] ?? "",
        daysCount: start.daysInMonth ?? 31,
        firstWeekday: start.weekday - 1,
      };
    }
    case "islamic": {
      const structure = getIslamicYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, monthNameOriginal: m.monthNameOriginal, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "hebrew": {
      const structure = getHebrewYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, monthNameOriginal: m.monthNameOriginal, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "persian": {
      const structure = getPersianYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, monthNameOriginal: m.monthNameOriginal, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "ethiopian": {
      const structure = getEthiopianYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "coptic": {
      const structure = getCopticYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "hindu": {
      const structure = getIndianYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "chinese": {
      const structure = getChineseYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, monthNameOriginal: m.monthNameOriginal, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    case "korean": {
      const structure = getKoreanYearStructure(year);
      const m = structure[month - 1];
      return m ? { monthNameEn: m.monthNameEn, monthNameOriginal: m.monthNameOriginal, daysCount: m.daysCount, firstWeekday: m.firstWeekday } : null;
    }
    default: {
      const traditional = TRADITIONAL[calendarId];
      if (traditional) {
        if (month > traditional.monthsInYear) return null;
        return {
          monthNameEn: traditional.namesEn[month - 1] ?? "",
          monthNameOriginal: traditional.namesOriginal?.[month - 1],
          daysCount: traditional.monthLength(year, month),
          firstWeekday: weekdayFromRd(traditional.toRd(year, month, 1)),
        };
      }

      // Japanese, Buddhist and Thai Solar genuinely do use Gregorian months
      // under a different year number, so this branch is correct for them.
      let gYear = year;
      if (calendarId === "buddhist" || calendarId === "thai-solar") gYear = year - 543;
      const start = DateTime.local(gYear, month, 1);
      const names: Record<string, string[]> = {
        buddhist: GREGORIAN_MONTH_NAMES,
        "thai-solar": GREGORIAN_MONTH_NAMES,
        japanese: GREGORIAN_MONTH_NAMES,
      };
      return {
        monthNameEn: (names[calendarId] ?? GREGORIAN_MONTH_NAMES)[month - 1] ?? "",
        daysCount: start.daysInMonth ?? 30,
        firstWeekday: start.weekday - 1,
      };
    }
  }
}

/**
 * If today falls in the given (calendarId, year, month), the day number; else null.
 *
 * Every calendar resolves through its own implementation. The previous default
 * branch carried its own offsets, which had gone stale: `hindu` still used the
 * Vikram Samvat `+ 57` against a calendar that is now Saka, so today was never
 * highlighted, and `coptic` compared a Gregorian month number to a Coptic one
 * and then returned the Gregorian day.
 */
export function getTodayDayInMonth(
  calendarId: string,
  year: number,
  month: number
): number | null {
  const now = new Date();
  const matches = (t: { year: number; month: number; day: number } | null | undefined) =>
    t && t.year === year && t.month === month ? t.day : null;

  const traditional = TRADITIONAL[calendarId];
  if (traditional) return matches(traditional.fromRd(rdFromDate(now)));

  switch (calendarId) {
    case "gregorian":
      return matches({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
    case "buddhist":
    case "thai-solar":
      return matches({ year: now.getFullYear() + 543, month: now.getMonth() + 1, day: now.getDate() });
    case "japanese":
      return matches({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
    case "islamic":
      return matches(getTodayHijri());
    case "hebrew":
      return matches(getTodayHebrew());
    case "persian":
      return matches(getTodayPersian());
    case "ethiopian":
      return matches(todayIn(ICU_CALENDARS.ethiopian));
    case "coptic":
      return matches(todayIn(ICU_CALENDARS.coptic));
    case "hindu":
      return matches(todayIn(ICU_CALENDARS.hindu));
    case "chinese":
      return matches(todayIn(ICU_CALENDARS.chinese));
    case "korean":
      return matches(todayIn(ICU_CALENDARS.korean));
    default:
      return null;
  }
}
