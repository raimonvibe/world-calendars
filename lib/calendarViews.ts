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

/** Default year for calendar view when no ?year= param. Uses each calendar's native year. */
export function getDefaultYearForCalendar(calendarId: string): number {
  const gregorianYear = new Date().getFullYear();
  // The library-backed cases can yield NaN when the underlying package fails to
  // load, and `??` does not catch NaN. A non-finite default would poison the
  // served year range and 404 every month page for that calendar.
  const finite = (value: number | undefined, fallback: number) =>
    Number.isFinite(value) ? (value as number) : fallback;

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
      return gregorianYear + 543;
    case "persian":
      return gregorianYear - 621;
    case "armenian":
      return gregorianYear + 552;
    case "sikh":
      return gregorianYear - 1469;
    case "assyrian":
      return gregorianYear + 4750;
    case "javanese":
      return gregorianYear;
    case "mayan":
      return gregorianYear;
    case "bahai":
      return gregorianYear - 1844;
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

export function getPersianYearStructure(persianYear: number): MonthStructure[] {
  const result: MonthStructure[] = [];
  for (let month = 1; month <= 12; month++) {
    const dt = DateTime.fromObject({ year: persianYear, month }, { outputCalendar: "persian" });
    const daysInMonth = dt.endOf("month").day;
    const firstWeekday = (dt.weekday - 1 + 7) % 7;
    result.push({
      monthNameEn: PERSIAN_MONTH_NAMES[month - 1] ?? "",
      monthNameOriginal: PERSIAN_MONTH_NAMES_FA[month - 1],
      daysCount: daysInMonth,
      firstWeekday,
    });
  }
  return result;
}

export function getTodayPersian(): { year: number; month: number; day: number } | null {
  try {
    const dt = DateTime.now().reconfigure({ outputCalendar: "persian" });
    return { year: dt.year, month: dt.month, day: dt.day };
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
  javanese: 12, armenian: 12, sikh: 12, assyrian: 12, hindu: 12,
  islamic: 12,
  // Lunisolar and 13-month calendars.
  hebrew: 13, ethiopian: 13, coptic: 13, chinese: 13, korean: 13,
  bahai: 19,
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
        monthNameEn: ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"][month - 1] ?? "",
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
    case "bahai": {
      const BAHAI_NAMES = ["Bahá", "Jalál", "Jamál", "ʻAẓamat", "Núr", "Raḥmat", "Kalimát", "Kamál", "Asmáʼ", "ʻIzzat", "Mashíyyat", "ʻIlm", "Qudrat", "Qawl", "Masáʼil", "Sharaf", "Sulṭán", "Mulk", "ʻAláʼ"];
      return {
        monthNameEn: BAHAI_NAMES[month - 1] ?? "",
        daysCount: 19,
        firstWeekday: 0,
      };
    }
    default: {
      // Still approximate: these calendars render Gregorian month lengths under
      // their own year numbering. Phase 3 replaces them with real algorithms.
      let gYear = year;
      if (calendarId === "buddhist" || calendarId === "thai-solar") gYear = year - 543;
      else if (calendarId === "sikh") gYear = year + 1469;
      else if (calendarId === "assyrian") gYear = year - 4750;
      else if (calendarId === "armenian") gYear = year - 552;
      const start = DateTime.local(gYear, month, 1);
      const names: Record<string, string[]> = {
        buddhist: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "thai-solar": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        hindu: ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"],
        japanese: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        coptic: ["Thout", "Phaophi", "Hathor", "Koiak", "Tobi", "Meshir", "Paremhat", "Parmouti", "Pashons", "Paoni", "Epip", "Mesori"],
        armenian: ["Nawasardi", "Hoṙi", "Sahmi", "Trē", "Kʻaloch", "Arach", "Mehekani", "Areg", "Ahekani", "Mareri", "Margach", "Hrotich"],
        sikh: ["Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon", "Assu", "Katak", "Maghar", "Poh", "Magh", "Phaggan"],
        assyrian: ["Nisan", "Iyyar", "Sivan", "Tammuz", "Ab", "Elul", "Tishrin I", "Tishrin II", "Shabat", "Adar", "Nisan II", "Ilul"],
        javanese: ["Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal", "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Dulkangidah"],
      };
      const monthNames = names[calendarId] ?? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return {
        monthNameEn: monthNames[month - 1] ?? "",
        daysCount: start.daysInMonth ?? 30,
        firstWeekday: start.weekday - 1,
      };
    }
  }
}

/** If today falls in the given (calendarId, year, month), return the day number (1–N); else null. */
export function getTodayDayInMonth(
  calendarId: string,
  year: number,
  month: number
): number | null {
  const now = new Date();
  switch (calendarId) {
    case "gregorian": {
      if (now.getFullYear() !== year || now.getMonth() + 1 !== month) return null;
      return now.getDate();
    }
    case "islamic": {
      const t = getTodayHijri();
      if (!t || t.year !== year || t.month !== month) return null;
      return t.day;
    }
    case "hebrew": {
      const t = getTodayHebrew();
      if (!t || t.year !== year || t.month !== month) return null;
      return t.day;
    }
    case "persian": {
      const t = getTodayPersian();
      if (!t || t.year !== year || t.month !== month) return null;
      return t.day;
    }
    case "ethiopian":
    case "chinese":
    case "korean":
      return null;
    default: {
      const gy = now.getFullYear();
      const gm = now.getMonth() + 1;
      const gd = now.getDate();
      let calYear = gy;
      if (calendarId === "buddhist" || calendarId === "thai-solar") calYear = gy + 543;
      else if (calendarId === "hindu") calYear = gy + 57;
      else if (calendarId === "sikh") calYear = gy + 1469;
      else if (calendarId === "assyrian") calYear = gy + 4750;
      else if (calendarId === "armenian") calYear = gy + 552;
      else if (calendarId === "coptic") calYear = gy - 284;
      if (calYear !== year || gm !== month) return null;
      return gd;
    }
  }
}
