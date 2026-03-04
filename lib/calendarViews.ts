/**
 * Year structure and weekday names for full calendar views.
 * Used by calendar components (e.g. Islamic, Gregorian uses Luxon directly).
 */

// @ts-expect-error - no types
import HijriDate from "hijri-date";
import { HDate } from "@hebcal/core";
import { DateTime } from "luxon";

const ISLAMIC_MONTH_NAMES = [
  "Muharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

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

export function getIslamicYearStructure(hijriYear: number): IslamicMonthStructure[] {
  const result: IslamicMonthStructure[] = [];

  for (let month = 1; month <= 12; month++) {
    const h1 = new HijriDate(hijriYear, month, 1) as {
      __proxy__?: Date;
    };
    const h2 =
      month === 12
        ? new HijriDate(hijriYear + 1, 1, 1) as { __proxy__?: Date }
        : new HijriDate(hijriYear, month + 1, 1) as { __proxy__?: Date };

    const p1 = h1.__proxy__;
    const p2 = h2.__proxy__;

    if (!p1 || !p2) {
      result.push({
        monthNameEn: ISLAMIC_MONTH_NAMES[month - 1] ?? "?",
        monthNameOriginal: ISLAMIC_MONTH_NAMES_AR[month - 1],
        daysCount: 30,
        firstWeekday: 0,
      });
      continue;
    }

    const daysCount = Math.round((p2.getTime() - p1.getTime()) / (24 * 60 * 60 * 1000));
    const firstWeekday = (p1.getDay() + 6) % 7;

    result.push({
      monthNameEn: ISLAMIC_MONTH_NAMES[month - 1] ?? "?",
      monthNameOriginal: ISLAMIC_MONTH_NAMES_AR[month - 1],
      daysCount,
      firstWeekday,
    });
  }

  return result;
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

/** Get today's Hijri date (year, month, day) for highlighting. */
export function getTodayHijri(): { year: number; month: number; day: number } | null {
  try {
    const h = new HijriDate(new Date()) as {
      getFullYear?: () => number;
      getMonth?: () => number;
      getDate?: () => number;
      year?: number;
      month?: number;
      date?: number;
    };
    const year = h.getFullYear?.() ?? h.year ?? 0;
    const month = h.getMonth?.() ?? h.month ?? 1;
    const day = h.getDate?.() ?? h.date ?? 1;
    return { year, month, day };
  } catch {
    return null;
  }
}

/** Default year for calendar view when no ?year= param. Uses each calendar's native year. */
export function getDefaultYearForCalendar(calendarId: string): number {
  const gregorianYear = new Date().getFullYear();
  switch (calendarId) {
    case "islamic":
      return getTodayHijri()?.year ?? gregorianYear - 579;
    case "buddhist":
    case "thai-solar":
      return gregorianYear + 543;
    case "hindu":
      return gregorianYear + 57;
    case "hebrew":
      return getTodayHebrew()?.year ?? gregorianYear + 3761;
    case "ethiopian":
      return gregorianYear - 8;
    case "persian":
      return gregorianYear - 621;
    case "coptic":
      return gregorianYear - 284;
    case "armenian":
      return gregorianYear + 552;
    case "sikh":
      return gregorianYear - 1469;
    case "assyrian":
      return gregorianYear + 4750;
    case "chinese":
    case "korean":
      return gregorianYear + 2698;
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
  const result: MonthStructure[] = [];
  const isLeap = (ethiopianYear % 4) === 3;
  const msPerDay = 24 * 60 * 60 * 1000;
  const sept11 = new Date(ethiopianYear + 8, 8, 11);
  for (let month = 1; month <= 13; month++) {
    const daysCount = month <= 12 ? 30 : isLeap ? 6 : 5;
    const firstDay =
      month <= 12
        ? new Date(sept11.getTime() + (month - 1) * 30 * msPerDay)
        : new Date(sept11.getTime() + 12 * 30 * msPerDay);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    result.push({
      monthNameEn: ETHIOPIAN_MONTH_NAMES[month - 1] ?? "",
      daysCount,
      firstWeekday,
    });
  }
  return result;
}

// --- Chinese (simplified lunar: 12 months, 29/30 days) ---
const CHINESE_MONTH_NAMES = [
  "Zheng Yue", "Er Yue", "San Yue", "Si Yue", "Wu Yue", "Liu Yue",
  "Qi Yue", "Ba Yue", "Jiu Yue", "Shi Yue", "Dong Yue", "La Yue",
];
const CHINESE_MONTH_NAMES_ZH = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "冬月", "腊月",
];

export function getChineseYearStructure(lunarYear: number): MonthStructure[] {
  const result: MonthStructure[] = [];
  for (let month = 1; month <= 12; month++) {
    const daysCount = month % 2 === 1 ? 30 : 29;
    const firstWeekday = (lunarYear * 12 + month + 3) % 7;
    result.push({
      monthNameEn: CHINESE_MONTH_NAMES[month - 1] ?? "",
      monthNameOriginal: CHINESE_MONTH_NAMES_ZH[month - 1],
      daysCount,
      firstWeekday,
    });
  }
  return result;
}

// --- Month view: single month structure for any calendar ---
export type MonthInfo = {
  monthNameEn: string;
  monthNameOriginal?: string;
  daysCount: number;
  /** 0 = Monday, 6 = Sunday */
  firstWeekday: number;
};

/** Max month number (1-based) per calendar. */
export const MONTH_RANGES: Record<string, number> = {
  gregorian: 12, islamic: 12, chinese: 12, hindu: 12, persian: 12,
  japanese: 12, buddhist: 12, coptic: 12, "thai-solar": 12, korean: 12,
  javanese: 12, armenian: 12, sikh: 12, assyrian: 12,
  hebrew: 13, ethiopian: 13,
  bahai: 19,
};

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
    case "chinese":
    case "korean": {
      const structure = getChineseYearStructure(year);
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
      let gYear = year;
      if (calendarId === "buddhist" || calendarId === "thai-solar") gYear = year - 543;
      else if (calendarId === "hindu") gYear = year - 57;
      else if (calendarId === "sikh") gYear = year + 1469;
      else if (calendarId === "assyrian") gYear = year - 4750;
      else if (calendarId === "armenian") gYear = year - 552;
      else if (calendarId === "coptic") gYear = year + 284;
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
