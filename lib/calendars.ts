/**
 * Calendar display logic: get "today" in each calendar system + 1–2 fun facts.
 * Uses Luxon, hijri-date, chinese-lunar, @hebcal/core. Rest are approximate or stubbed.
 */

import { DateTime } from "luxon";
// hijri-date is CJS; default import
// @ts-expect-error - no types
import HijriDate from "hijri-date";
// @ts-expect-error - no types
import chineseLunar from "chinese-lunar";
import { HDate } from "@hebcal/core";

export type CalendarInfo = {
  id: string;
  name: string;
  /** English / Western date display */
  dateString: string;
  /** Original script where applicable (e.g. Hebrew, Chinese, Arabic) */
  dateOriginal?: string;
  facts: string[];
};

/** Gregorian: Luxon format */
export function getGregorian(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  return {
    id: "gregorian",
    name: "Gregorian",
    dateString: dt.toFormat("MMMM dd, yyyy"),
    facts: [
      "The world's most widely used civil calendar.",
      "Named after Pope Gregory XIII (1582).",
    ],
  };
}

/** Islamic (Hijri): hijri-date — English + optional Arabic-style display */
export function getHijri(d: Date): CalendarInfo {
  try {
    const h = new HijriDate(d) as { year?: number; month?: number; date?: number; getFullYear?: () => number; getMonth?: () => number; getDate?: () => number };
    const year = h.getFullYear?.() ?? h.year ?? 0;
    const month = h.getMonth?.() ?? h.month ?? 1;
    const day = h.getDate?.() ?? h.date ?? 1;
    const monthNames = [
      "Muharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II",
      "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
    ];
    const monthName = monthNames[month - 1] ?? "?";
    const dateString = `${monthName} ${day}, ${year} AH`;
    return {
      id: "islamic",
      name: "Islamic (Hijri)",
      dateString,
      dateOriginal: `${day} ${monthName} ${year} هـ`,
      facts: [
        "Lunar calendar; months follow the moon.",
        "Epoch is the Hijra (622 CE).",
      ],
    };
  } catch {
    return {
      id: "islamic",
      name: "Islamic (Hijri)",
      dateString: "—",
      facts: ["Lunar calendar; epoch is the Hijra (622 CE)."],
    };
  }
}

/** Chinese (Lunar): chinese-lunar — Chinese script + English */
export function getChinese(d: Date): CalendarInfo {
  try {
    const lunar = chineseLunar.solarToLunar(d);
    if (!lunar) return fallbackChinese(d);
    const animal = (chineseLunar as { animalName?: (y: number) => string }).animalName?.(lunar.year) ?? "";
    const format = (chineseLunar as { format?: (l: unknown, f: string) => string }).format;
    const dateOriginal = format?.(lunar, "Y年m月d日") ?? `${lunar.year}年${lunar.month}月${lunar.day}日`;
    const dateString = `${lunar.year}/${lunar.month}/${lunar.day} (${animal || "Lunar"})`;
    return {
      id: "chinese",
      name: "Chinese (Lunar)",
      dateString,
      dateOriginal,
      facts: [
        animal ? `Year of the ${animal}` : "Lunar calendar with 12–13 months.",
        "Used for traditional festivals (e.g. Lunar New Year).",
      ],
    };
  } catch {
    return fallbackChinese(d);
  }
}

function fallbackChinese(d: Date): CalendarInfo {
  return {
    id: "chinese",
    name: "Chinese (Lunar)",
    dateString: "—",
    facts: ["Lunar calendar; each year has an animal zodiac.", "Used for traditional festivals."],
  };
}

/** Hindu (Vikram Samvat): approximate — epoch 57 BCE → Gregorian year + 57 */
export function getHindu(d: Date): CalendarInfo {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const vsYear = y + 57;
  return {
    id: "hindu",
    name: "Hindu (Vikram Samvat)",
    dateString: `${day} / ${m} / ${vsYear} VS`,
    facts: [
      "Vikram Samvat starts in 57 BCE (Gregorian).",
      "Widely used in North India and Nepal.",
    ],
  };
}

/** Hebrew: @hebcal/core HDate — English + Hebrew script */
export function getHebrew(d: Date): CalendarInfo {
  const h = new HDate(d);
  const dateString = h.render("en", true) ?? h.toString();
  const dateOriginal = typeof (h as { renderGematriya?: (n?: boolean, y?: boolean) => string }).renderGematriya === "function"
    ? (h as { renderGematriya: (n?: boolean, y?: boolean) => string }).renderGematriya(false, false)
    : undefined;
  return {
    id: "hebrew",
    name: "Hebrew",
    dateString,
    dateOriginal: dateOriginal || undefined,
    facts: [
      "Lunisolar; months follow the moon, years follow the sun.",
      "Used for Jewish holidays and lifecycle events.",
    ],
  };
}

/** Ethiopian: approximate (≈ 7–8 years behind, New Year in September) */
export function getEthiopian(d: Date): CalendarInfo {
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const ethYear = y - 8 + (m < 8 ? 0 : 1);
  const ethMonth = m < 8 ? m + 5 : m - 7;
  return {
    id: "ethiopian",
    name: "Ethiopian",
    dateString: `${day} / ${ethMonth} / ${ethYear} EE`,
    facts: [
      "Roughly 7–8 years behind Gregorian.",
      "New Year (Enkutatash) in September.",
    ],
  };
}

/** Persian (Solar Hijri): Luxon outputCalendar 'persian' — English numerals + Persian numerals */
export function getPersian(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d).reconfigure({ outputCalendar: "persian" });
  const persian = dt.toFormat("yyyy/M/d") || dt.toFormat("yyyy/MM/dd");
  const persianNumerals = "۰۱۲۳۴۵۶۷۸۹";
  const dateOriginal = persian.replace(/\d/g, (n) => persianNumerals[+n] ?? n);
  return {
    id: "persian",
    name: "Persian (Solar Hijri)",
    dateString: persian,
    dateOriginal,
    facts: [
      "Solar calendar used in Iran and Afghanistan.",
      "Nowruz (New Year) on the vernal equinox.",
    ],
  };
}

/** Japanese: Gregorian + era (Reiwa since 2019) */
export function getJapanese(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  const y = d.getFullYear();
  const era = y >= 2019 ? "Reiwa" : y >= 1989 ? "Heisei" : "Shōwa";
  const eraYear = y >= 2019 ? y - 2018 : y >= 1989 ? y - 1988 : y - 1925;
  return {
    id: "japanese",
    name: "Japanese",
    dateString: `${era} ${eraYear} – ${dt.toFormat("MMMM d, yyyy")}`,
    facts: [
      `Era: ${era} (year ${eraYear}).`,
      "Japan uses Gregorian dates with imperial era names.",
    ],
  };
}

/** Buddhist (e.g. Thailand): Gregorian year + 543 */
export function getBuddhist(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  const y = d.getFullYear() + 543;
  return {
    id: "buddhist",
    name: "Buddhist",
    dateString: `${dt.toFormat("MMMM d")}, ${y} BE`,
    facts: [
      "Buddhist Era (BE): year 1 ≈ 544 BCE Gregorian.",
      "Used in Thailand, Cambodia, Laos, Myanmar.",
    ],
  };
}

/** Coptic: approximate (similar to Ethiopian, different epoch) */
export function getCoptic(d: Date): CalendarInfo {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const copticYear = y - 284;
  return {
    id: "coptic",
    name: "Coptic",
    dateString: `${day} / ${m} / ${copticYear} AM`,
    facts: [
      "Used by the Coptic Church (Egypt).",
      "Epoch: Era of Martyrs (284 CE).",
    ],
  };
}

/** Thai Solar: same as Buddhist in Thailand */
export function getThaiSolar(d: Date): CalendarInfo {
  const info = getBuddhist(d);
  return {
    id: "thai-solar",
    name: "Thai Solar",
    dateString: info.dateString,
    facts: [
      "Official calendar in Thailand (Buddhist Era).",
      "Solar calendar aligned with Gregorian.",
    ],
  };
}

/** Korean: often same as Chinese lunar; display similarly */
export function getKorean(d: Date): CalendarInfo {
  const info = getChinese(d);
  return {
    id: "korean",
    name: "Korean (Lunar-Solar)",
    dateString: info.dateString,
    facts: [
      "Traditional Korean calendar follows Chinese lunisolar system.",
      "Korean New Year (Seollal) on Lunar New Year.",
    ],
  };
}

/** Javanese: simplified stub (complex cycle) */
export function getJavanese(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  return {
    id: "javanese",
    name: "Javanese",
    dateString: dt.toFormat("d MMMM yyyy") + " (CE)",
    facts: [
      "Combines Islamic, Hindu and indigenous cycles.",
      "Used traditionally in Java, Indonesia.",
    ],
  };
}

/** Armenian: traditional (year 1 = 552 CE) */
export function getArmenian(d: Date): CalendarInfo {
  const y = d.getFullYear();
  const armYear = y - 552;
  const dt = DateTime.fromJSDate(d);
  return {
    id: "armenian",
    name: "Armenian",
    dateString: `${dt.toFormat("d MMMM")} ${armYear}`,
    facts: [
      "Traditional Armenian calendar; year 1 = 552 CE.",
      "Fixed calendar (no leap day in same way as Gregorian).",
    ],
  };
}

/** Mayan: Long Count / Calendar Round stub */
export function getMayan(d: Date): CalendarInfo {
  const start = new Date(-3114, 7, 11);
  const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
  const baktun = Math.floor(diff / 144000) % 20;
  const katun = Math.floor(diff / 7200) % 20;
  const tun = Math.floor(diff / 360) % 20;
  const uinal = Math.floor(diff / 20) % 18;
  const kin = diff % 20;
  return {
    id: "mayan",
    name: "Mayan",
    dateString: `Long Count: ${baktun}.${katun}.${tun}.${uinal}.${kin}`,
    facts: [
      "Long Count: cycles of 20 (kins, uinals, tuns, katuns, baktuns).",
      "Classic Maya civilization used this calendar.",
    ],
  };
}

/** Baha'i: stub (solar, 19 months × 19 days + intercalary) */
export function getBahai(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  return {
    id: "bahai",
    name: "Baha'i",
    dateString: dt.toFormat("d MMMM yyyy") + " (BE approx.)",
    facts: [
      "Badi' calendar: 19 months of 19 days + intercalary days.",
      "Year 1 = 1844 CE (Declaration of the Báb).",
    ],
  };
}

/** Sikh (Nanakshahi): year 1 = 1469 CE */
export function getSikh(d: Date): CalendarInfo {
  const y = d.getFullYear() - 1469;
  const dt = DateTime.fromJSDate(d);
  return {
    id: "sikh",
    name: "Sikh (Nanakshahi)",
    dateString: `${dt.toFormat("d MMMM")} ${y} NS`,
    facts: [
      "Nanakshahi: starts from birth of Guru Nanak (1469 CE).",
      "Adopted in 1998 by SGPC for Sikh dates.",
    ],
  };
}

/** Assyrian: approximate (year 1 = 4750 BCE) */
export function getAssyrian(d: Date): CalendarInfo {
  const y = d.getFullYear() + 4750;
  const dt = DateTime.fromJSDate(d);
  return {
    id: "assyrian",
    name: "Assyrian",
    dateString: `${dt.toFormat("d MMMM")} ${y}`,
    facts: [
      "Assyrian/Syriac calendar; year 1 ≈ 4750 BCE.",
      "Used by some Assyrian and Syriac Christian communities.",
    ],
  };
}

/** All 18 calendars in display order */
export const CALENDAR_IDS = [
  "gregorian", "islamic", "chinese", "hindu", "hebrew", "ethiopian",
  "persian", "japanese", "buddhist", "coptic", "thai-solar", "korean",
  "javanese", "armenian", "mayan", "bahai", "sikh", "assyrian",
] as const;

const getters: Record<(typeof CALENDAR_IDS)[number], (d: Date) => CalendarInfo> = {
  gregorian: getGregorian,
  islamic: getHijri,
  chinese: getChinese,
  hindu: getHindu,
  hebrew: getHebrew,
  ethiopian: getEthiopian,
  persian: getPersian,
  japanese: getJapanese,
  buddhist: getBuddhist,
  coptic: getCoptic,
  "thai-solar": getThaiSolar,
  korean: getKorean,
  javanese: getJavanese,
  armenian: getArmenian,
  mayan: getMayan,
  bahai: getBahai,
  sikh: getSikh,
  assyrian: getAssyrian,
};

export function getCalendarInfo(id: (typeof CALENDAR_IDS)[number], d: Date): CalendarInfo {
  return getters[id](d);
}

export function getAllCalendars(d: Date): CalendarInfo[] {
  return CALENDAR_IDS.map((id) => getCalendarInfo(id, d));
}
