/**
 * Calendar display logic: get "today" in each calendar system + 1–2 fun facts.
 *
 * Islamic, Coptic, Ethiopian, Chinese, Korean, Japanese and Indian dates come
 * from ICU via lib/icu. Hebrew uses @hebcal/core and Persian uses Luxon. The
 * six calendars ICU does not implement - Mayan, Armenian, Sikh, Assyrian,
 * Baha'i and Javanese - are computed from their own rules in
 * lib/traditionalCalendars. See docs/CALENDAR_ACCURACY.md for what each one is
 * checked against.
 */

import { DateTime } from "luxon";
import { HDate } from "@hebcal/core";
import {
  ICU_CALENDARS,
  readIcuDate,
  readIcuMonthName,
  isLeapMonthToken,
  icuMonthNumber,
} from "./icu";
import { rdFromDate, weekdayFromRd } from "./calendarMath";
import {
  mayanLongCountFromRd,
  formatLongCount,
  tzolkinFromRd,
  haabFromRd,
  armenianFromRd,
  ARMENIAN_MONTHS,
  ARMENIAN_MONTHS_HY,
  nanakshahiFromRd,
  NANAKSHAHI_MONTHS,
  NANAKSHAHI_MONTHS_PA,
  assyrianFromRd,
  ASSYRIAN_MONTHS,
  ASSYRIAN_MONTHS_SYR,
  bahaiFromRd,
  bahaiAyyamIHaLength,
  BAHAI_MONTHS,
  BAHAI_MONTH_MEANINGS,
  BAHAI_AYYAM_I_HA_INDEX,
  javaneseFromRd,
  JAVANESE_MONTHS,
  pasaranFromRd,
  winduYearName,
} from "./traditionalCalendars";

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

/** Arabic month name for the Hijri month containing `d`. */
function arabicHijriMonth(d: Date): string {
  return (
    new Intl.DateTimeFormat(`ar-u-ca-${ICU_CALENDARS.islamic}`, { month: "long" })
      .formatToParts(d)
      .find((p) => p.type === "month")?.value ?? ""
  );
}

/** Islamic (Hijri): Umm al-Qura via ICU — English + Arabic display */
export function getHijri(d: Date): CalendarInfo {
  const { year, day } = readIcuDate(ICU_CALENDARS.islamic, d);
  const monthName = readIcuMonthName(ICU_CALENDARS.islamic, d);

  return {
    id: "islamic",
    name: "Islamic (Hijri)",
    dateString: `${monthName} ${day}, ${year} AH`,
    dateOriginal: `${day} ${arabicHijriMonth(d)} ${year} هـ`,
    facts: [
      "Lunar calendar; months follow the moon.",
      "Epoch is the Hijra (622 CE).",
    ],
  };
}

const ZODIAC_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

/**
 * Zodiac animal for a Chinese year. Keyed off the year ICU relates the lunar
 * year to, so the animal changes at Lunar New Year rather than 1 January.
 */
function zodiacAnimal(relatedYear: number): string {
  return ZODIAC_ANIMALS[((relatedYear - 4) % 12 + 12) % 12];
}

/** Chinese (Lunar): ICU — leap months and real month lengths included */
export function getChinese(d: Date): CalendarInfo {
  const { year, monthToken, day } = readIcuDate(ICU_CALENDARS.chinese, d);
  const monthName = readIcuMonthName(ICU_CALENDARS.chinese, d);
  const animal = zodiacAnimal(year);
  // ICU marks a leap month as e.g. "6bis"; show it the way Chinese calendars do.
  const isLeapMonth = isLeapMonthToken(monthToken);
  const monthNumber = icuMonthNumber(monthToken);

  return {
    id: "chinese",
    name: "Chinese (Lunar)",
    dateString: `${year}/${isLeapMonth ? "leap " : ""}${monthNumber}/${day} (${animal})`,
    dateOriginal: `${year}年${isLeapMonth ? "闰" : ""}${monthNumber}月${day}日`,
    facts: [
      `Year of the ${animal}${isLeapMonth ? ` — currently in a leap ${monthName.toLowerCase()}` : ""}.`,
      "Used for traditional festivals (e.g. Lunar New Year).",
    ],
  };
}

/**
 * Indian National (Saka) calendar via ICU.
 *
 * This was previously labelled Vikram Samvat but implemented as Gregorian + 57,
 * which is not Vikram Samvat: that calendar is lunisolar and needs an ephemeris.
 * Saka is India's official civil calendar, is well defined, and ICU implements
 * it, so the label now matches what is actually computed.
 */
export function getHindu(d: Date): CalendarInfo {
  const { year, day } = readIcuDate(ICU_CALENDARS.hindu, d);
  const monthName = readIcuMonthName(ICU_CALENDARS.hindu, d);

  return {
    id: "hindu",
    name: "Indian National (Saka)",
    dateString: `${monthName} ${day}, ${year} Saka`,
    facts: [
      "India's official civil calendar, adopted in 1957.",
      "Year 1 of the Saka era is 78 CE; the year begins at Chaitra.",
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

/** Ethiopian: ICU — 12 months of 30 days plus the short 13th (Pagume) */
export function getEthiopian(d: Date): CalendarInfo {
  const { year, day } = readIcuDate(ICU_CALENDARS.ethiopian, d);
  const monthName = readIcuMonthName(ICU_CALENDARS.ethiopian, d);

  return {
    id: "ethiopian",
    name: "Ethiopian",
    dateString: `${monthName} ${day}, ${year} EE`,
    facts: [
      "Twelve 30-day months plus Pagume, a 5- or 6-day thirteenth month.",
      "New Year (Enkutatash) falls in September.",
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

/**
 * Japanese: ICU supplies the era. Era changes happen mid-year (Reiwa began on
 * 1 May 2019, Heisei on 8 January 1989), so deriving the era from the Gregorian
 * year alone mislabels every date between 1 January and the accession.
 */
export function getJapanese(d: Date): CalendarInfo {
  const dt = DateTime.fromJSDate(d);
  const parts = new Intl.DateTimeFormat(`en-u-ca-${ICU_CALENDARS.japanese}`, {
    era: "long",
    year: "numeric",
  }).formatToParts(d);
  const era = parts.find((p) => p.type === "era")?.value ?? "";
  const eraYear = parts.find((p) => p.type === "year")?.value ?? "";

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

/** Coptic: ICU — same 13-month structure as Ethiopian, different epoch */
export function getCoptic(d: Date): CalendarInfo {
  const { year, day } = readIcuDate(ICU_CALENDARS.coptic, d);
  const monthName = readIcuMonthName(ICU_CALENDARS.coptic, d);

  return {
    id: "coptic",
    name: "Coptic",
    dateString: `${monthName} ${day}, ${year} AM`,
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

/**
 * Korean (Dangi): the same lunisolar reckoning as the Chinese calendar, but
 * numbered in the Dangi era (Gregorian + 2333), which is what makes it a
 * distinct calendar rather than a relabelled copy.
 */
export function getKorean(d: Date): CalendarInfo {
  const { year, monthToken, day } = readIcuDate(ICU_CALENDARS.korean, d);
  const dangiYear = year + 2333;
  const isLeapMonth = isLeapMonthToken(monthToken);
  const monthNumber = icuMonthNumber(monthToken);

  return {
    id: "korean",
    name: "Korean (Dangi)",
    dateString: `${dangiYear}/${isLeapMonth ? "leap " : ""}${monthNumber}/${day} Dangi`,
    dateOriginal: `단기 ${dangiYear}년 ${isLeapMonth ? "윤" : ""}${monthNumber}월 ${day}일`,
    facts: [
      "Dangi era counts from the legendary founding of Gojoseon in 2333 BCE.",
      "Korean New Year (Seollal) falls on Lunar New Year.",
    ],
  };
}

/** Javanese: Anno Javanico, with the pasaran day that makes up the weton */
export function getJavanese(d: Date): CalendarInfo {
  const rd = rdFromDate(d);
  const { year, month, day } = javaneseFromRd(rd);
  const pasaran = pasaranFromRd(rd);
  const weekday = ["Senin", "Selasa", "Rebo", "Kemis", "Jemuwah", "Setu", "Ngahad"][
    weekdayFromRd(rd)
  ];

  return {
    id: "javanese",
    name: "Javanese",
    dateString: `${day} ${JAVANESE_MONTHS[month - 1]} ${year} AJ`,
    dateOriginal: `${weekday} ${pasaran}`,
    facts: [
      `Today is ${weekday} ${pasaran} — the weton, where the 7-day week meets the 5-day pasaran.`,
      `Year ${year} is ${winduYearName(year)} of the eight-year windu cycle.`,
    ],
  };
}

/** Armenian: the traditional 365-day wandering year, epoch 11 July 552 CE */
export function getArmenian(d: Date): CalendarInfo {
  const { year, month, day } = armenianFromRd(rdFromDate(d));
  const monthName = ARMENIAN_MONTHS[month - 1];

  return {
    id: "armenian",
    name: "Armenian",
    dateString: `${day} ${monthName} ${year}`,
    dateOriginal: `${day} ${ARMENIAN_MONTHS_HY[month - 1]} ${year}`,
    facts: [
      "Traditional Armenian calendar; year 1 = 552 CE.",
      month === 13
        ? "These are the five epagomenal days of Aweleacʻ, outside the twelve months."
        : "Every year is exactly 365 days, so the calendar drifts through the seasons.",
    ],
  };
}

/** Mayan: Long Count plus the Calendar Round (Tzolkʼin and Haabʼ) */
export function getMayan(d: Date): CalendarInfo {
  const rd = rdFromDate(d);
  const longCount = mayanLongCountFromRd(rd);
  const tzolkin = tzolkinFromRd(rd);
  const haab = haabFromRd(rd);

  return {
    id: "mayan",
    name: "Mayan",
    dateString: `Long Count: ${formatLongCount(longCount)}`,
    dateOriginal: `${tzolkin.number} ${tzolkin.name} ${haab.day} ${haab.month}`,
    facts: [
      `Calendar Round: ${tzolkin.number} ${tzolkin.name} ${haab.day} ${haab.month}.`,
      "Long Count: cycles of 20 (kins, uinals, tuns, katuns, baktuns).",
    ],
  };
}

/** Baha'i: the Badí' calendar, 19 months of 19 days plus Ayyám-i-Há */
export function getBahai(d: Date): CalendarInfo {
  const { year, month, day } = bahaiFromRd(rdFromDate(d));
  const isAyyamIHa = month === BAHAI_AYYAM_I_HA_INDEX;
  const monthName = BAHAI_MONTHS[month - 1];

  return {
    id: "bahai",
    name: "Baha'i",
    dateString: `${monthName} ${day}, ${year} BE`,
    dateOriginal: isAyyamIHa ? undefined : `${monthName} (${BAHAI_MONTH_MEANINGS[month - 1]})`,
    facts: [
      isAyyamIHa
        ? `Ayyám-i-Há: the ${bahaiAyyamIHaLength(year)} intercalary days of hospitality before the fast.`
        : "Badí' calendar: 19 months of 19 days plus the intercalary Ayyám-i-Há.",
      "Year 1 = 1844 CE; the year begins at Naw-Rúz, on the March equinox.",
    ],
  };
}

/** Sikh (Nanakshahi): fixed solar months, the year beginning 14 March */
export function getSikh(d: Date): CalendarInfo {
  const { year, month, day } = nanakshahiFromRd(rdFromDate(d));

  return {
    id: "sikh",
    name: "Sikh (Nanakshahi)",
    dateString: `${day} ${NANAKSHAHI_MONTHS[month - 1]} ${year} NS`,
    dateOriginal: `${day} ${NANAKSHAHI_MONTHS_PA[month - 1]} ${year}`,
    facts: [
      "Nanakshahi: year 1 is 1469 CE, the birth of Guru Nanak.",
      "A fixed solar calendar; Chet 1, the new year, is always 14 March.",
    ],
  };
}

/** Assyrian: Syriac months, the year beginning on 1 April (Kha b-Nisan) */
export function getAssyrian(d: Date): CalendarInfo {
  const { year, month, day } = assyrianFromRd(rdFromDate(d));

  return {
    id: "assyrian",
    name: "Assyrian",
    dateString: `${day} ${ASSYRIAN_MONTHS[month - 1]} ${year}`,
    dateOriginal: `${day} ${ASSYRIAN_MONTHS_SYR[month - 1]} ${year}`,
    facts: [
      "Assyrian/Syriac calendar; year 1 ≈ 4750 BCE.",
      "The year begins at Kha b-Nisan, 1 April.",
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
