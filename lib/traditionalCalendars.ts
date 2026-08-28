/**
 * The six calendars ICU does not implement, computed from their own rules.
 *
 * Each of these previously rendered a Gregorian day and month under a different
 * year number, so only the year was ever close. They are all deterministic and
 * need no dependency: the Mayan Long Count is a day count, Armenian is a
 * 365-day wandering year, Nanakshahi and the Syriac calendar are fixed solar
 * schemes, Badí' is equinox-based, and the Javanese calendar is a tabular lunar
 * one.
 *
 * Every function here takes and returns plain day numbers (see calendarMath),
 * so display formatting stays in calendars.ts and grid layout in calendarViews.
 */

import {
  mod,
  rdFromGregorian,
  gregorianFromRd,
  rdFromJulian,
  rdFromJdn,
  isGregorianLeapYear,
} from "./calendarMath";
import { nawRuzRd } from "./astronomy";

export type CalendarDate = { year: number; month: number; day: number };

// ---------------------------------------------------------------------------
// Mayan Long Count
// ---------------------------------------------------------------------------

/**
 * Long Count day zero. The Goodman-Martinez-Thompson correlation is defined as
 * the constant 584283, so it is stated that way rather than as a proleptic date
 * in 3114 BCE - the previous code wrote that date as `new Date(-3114, 7, 11)`,
 * which is astronomical year -3114, i.e. 3115 BCE, putting every Long Count
 * exactly 365 days ahead.
 */
export const MAYAN_EPOCH_RD = rdFromJdn(584283);

export type MayanLongCount = {
  baktun: number;
  katun: number;
  tun: number;
  uinal: number;
  kin: number;
};

export function mayanLongCountFromRd(rd: number): MayanLongCount {
  const days = rd - MAYAN_EPOCH_RD;
  return {
    baktun: Math.floor(days / 144000),
    katun: mod(Math.floor(days / 7200), 20),
    tun: mod(Math.floor(days / 360), 20),
    uinal: mod(Math.floor(days / 20), 18),
    kin: mod(days, 20),
  };
}

export const formatLongCount = (c: MayanLongCount) =>
  `${c.baktun}.${c.katun}.${c.tun}.${c.uinal}.${c.kin}`;

const TZOLKIN_NAMES = [
  "Imix", "Ikʼ", "Akʼbʼal", "Kʼan", "Chikchan", "Kimi", "Manikʼ", "Lamat",
  "Muluk", "Ok", "Chuwen", "Ebʼ", "Bʼen", "Ix", "Men", "Kibʼ", "Kabʼan",
  "Etzʼnabʼ", "Kawak", "Ajaw",
];

const HAAB_NAMES = [
  "Pop", "Woʼ", "Sip", "Sotzʼ", "Sek", "Xul", "Yaxkʼin", "Mol", "Chʼen", "Yax",
  "Sakʼ", "Keh", "Mak", "Kʼankʼin", "Muwan", "Pax", "Kʼayabʼ", "Kumkʼu", "Wayebʼ",
];

/** Tzolkʼin: the 260-day round of 13 numbers against 20 day names. */
export function tzolkinFromRd(rd: number): { number: number; name: string } {
  const days = rd - MAYAN_EPOCH_RD;
  // Long Count 0.0.0.0.0 is 4 Ajaw, i.e. number 4 and name index 19.
  return {
    number: mod(days + 3, 13) + 1,
    name: TZOLKIN_NAMES[mod(days + 19, 20)],
  };
}

/** Haabʼ: 18 months of 20 days plus the 5-day Wayebʼ. */
export function haabFromRd(rd: number): { day: number; month: string } {
  const days = rd - MAYAN_EPOCH_RD;
  // Long Count 0.0.0.0.0 is 8 Kumkʼu, which is day 348 of the 365-day round.
  const dayOfYear = mod(days + 348, 365);
  return { day: mod(dayOfYear, 20), month: HAAB_NAMES[Math.floor(dayOfYear / 20)] };
}

/**
 * The Haab' round as a year structure, so the Mayan calendar has something a
 * month grid can render: 18 months of 20 days followed by the 5-day Wayeb'.
 * The Long Count itself has no years, so years are numbered by how many Haab'
 * rounds have elapsed since 0.0.0.0.0.
 */
export const HAAB_MONTHS = HAAB_NAMES;

/** Day 0 of Haab' year 1 - the round is offset because the epoch is 8 Kumk'u. */
const HAAB_YEAR_ONE_START = MAYAN_EPOCH_RD - 348;

export function haabYearFromRd(rd: number): { year: number; month: number; day: number } {
  const elapsed = rd - HAAB_YEAR_ONE_START;
  const dayOfYear = mod(elapsed, 365);
  return {
    year: Math.floor(elapsed / 365) + 1,
    month: Math.floor(dayOfYear / 20) + 1,
    day: mod(dayOfYear, 20) + 1,
  };
}

export const rdFromHaabYear = (year: number, month: number, day: number) =>
  HAAB_YEAR_ONE_START + 365 * (year - 1) + 20 * (month - 1) + day - 1;

/** Wayeb', the nameless days, has 5; the eighteen named months have 20. */
export const haabMonthLength = (month: number) => (month === 19 ? 5 : 20);

// ---------------------------------------------------------------------------
// Armenian: the traditional wandering year
// ---------------------------------------------------------------------------

/** 1 Nawasardi of year 1, 11 July 552 CE in the Julian calendar. */
export const ARMENIAN_EPOCH_RD = rdFromJulian(552, 7, 11);

export const ARMENIAN_MONTHS = [
  "Nawasardi", "Hoṙi", "Sahmi", "Trē", "Kʻałocʻ", "Aracʻ", "Mehekani",
  "Areg", "Ahekani", "Mareri", "Margacʻ", "Hroticʻ", "Aweleacʻ",
];

export const ARMENIAN_MONTHS_HY = [
  "Նաւասարդի", "Հոռի", "Սահմի", "Տրէ", "Քաղոց", "Արաց", "Մեհեկանի",
  "Արեգ", "Ահեկանի", "Մարերի", "Մարգաց", "Հրոտից", "Աւելեաց",
];

/**
 * The traditional Armenian year is exactly 365 days with no leap day, so it
 * drifts through the seasons - which is the point, and why deriving it from a
 * Gregorian month and day can never work. Twelve 30-day months are followed by
 * Aweleacʻ, the five epagomenal days, here numbered as a 13th month.
 */
export function armenianFromRd(rd: number): CalendarDate {
  const elapsed = rd - ARMENIAN_EPOCH_RD;
  const dayOfYear = mod(elapsed, 365);
  return {
    year: Math.floor(elapsed / 365) + 1,
    month: Math.floor(dayOfYear / 30) + 1,
    day: mod(dayOfYear, 30) + 1,
  };
}

export const rdFromArmenian = (year: number, month: number, day: number) =>
  ARMENIAN_EPOCH_RD + 365 * (year - 1) + 30 * (month - 1) + day - 1;

/** Aweleacʻ has 5 days; the twelve real months have 30. */
export const armenianMonthLength = (month: number) => (month === 13 ? 5 : 30);

// ---------------------------------------------------------------------------
// Sikh: the original (2003) Nanakshahi calendar
// ---------------------------------------------------------------------------

export const NANAKSHAHI_MONTHS = [
  "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
  "Assu", "Katak", "Maghar", "Poh", "Magh", "Phagun",
];

export const NANAKSHAHI_MONTHS_PA = [
  "ਚੇਤ", "ਵੈਸਾਖ", "ਜੇਠ", "ਹਾੜ", "ਸਾਵਣ", "ਭਾਦੋਂ",
  "ਅੱਸੂ", "ਕੱਤਕ", "ਮੱਘਰ", "ਪੋਹ", "ਮਾਘ", "ਫੱਗਣ",
];

/**
 * Nanakshahi is a fixed solar calendar pinned to the Gregorian one: Chet 1 is
 * always 14 March. Five months of 31 days, six of 30, and Phagun takes the
 * extra day whenever the Gregorian year it ends in is a leap year.
 *
 * Year 1 is 1469 CE, the birth of Guru Nanak, but the year *number* is the
 * Gregorian year minus 1468 from 14 March onward - the old `- 1469` was off by
 * one for the nine and a half months after Chet 1.
 */
export const NANAKSHAHI_EPOCH_GREGORIAN_YEAR = 1468;

const nanakshahiMonthLengths = (gregorianYearOfChet1: number) => [
  31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30,
  isGregorianLeapYear(gregorianYearOfChet1 + 1) ? 31 : 30,
];

export function nanakshahiFromRd(rd: number): CalendarDate {
  const { year: g } = gregorianFromRd(rd);
  const chet1 = (gy: number) => rdFromGregorian(gy, 3, 14);
  const gregorianYear = rd >= chet1(g) ? g : g - 1;
  const lengths = nanakshahiMonthLengths(gregorianYear);

  let remaining = rd - chet1(gregorianYear);
  let month = 1;
  while (remaining >= lengths[month - 1]) {
    remaining -= lengths[month - 1];
    month++;
  }
  return {
    year: gregorianYear - NANAKSHAHI_EPOCH_GREGORIAN_YEAR,
    month,
    day: remaining + 1,
  };
}

export function rdFromNanakshahi(year: number, month: number, day: number): number {
  const gregorianYear = year + NANAKSHAHI_EPOCH_GREGORIAN_YEAR;
  const lengths = nanakshahiMonthLengths(gregorianYear);
  const before = lengths.slice(0, month - 1).reduce((a, b) => a + b, 0);
  return rdFromGregorian(gregorianYear, 3, 14) + before + day - 1;
}

export const nanakshahiMonthLength = (year: number, month: number) =>
  nanakshahiMonthLengths(year + NANAKSHAHI_EPOCH_GREGORIAN_YEAR)[month - 1] ?? 30;

// ---------------------------------------------------------------------------
// Assyrian / Syriac
// ---------------------------------------------------------------------------

export const ASSYRIAN_MONTHS = [
  "Nisan", "Iyyar", "Khzeeran", "Tamuz", "Aab", "Eloul",
  "Teshrin I", "Teshrin II", "Kanoon I", "Kanoon II", "Shwadt", "Adar",
];

export const ASSYRIAN_MONTHS_SYR = [
  "ܢܝܣܢ", "ܐܝܪ", "ܚܙܝܪܢ", "ܬܡܘܙ", "ܐܒ", "ܐܝܠܘܠ",
  "ܬܫܪܝܢ ܐ", "ܬܫܪܝܢ ܒ", "ܟܢܘܢ ܐ", "ܟܢܘܢ ܒ", "ܫܒܛ", "ܐܕܪ",
];

export const ASSYRIAN_EPOCH_OFFSET = 4750;

/**
 * The Assyrian year keeps Gregorian month lengths but begins on 1 April
 * (Kha b-Nisan), so January to March still belong to the previous year - which
 * is what the old `+ 4750` on every day of the year got wrong for a quarter of
 * each year. Month 1 is Nisan (April), so the months are rotated too.
 */
export function assyrianFromRd(rd: number): CalendarDate {
  const g = gregorianFromRd(rd);
  const afterNewYear = g.month >= 4;
  return {
    year: g.year + ASSYRIAN_EPOCH_OFFSET - (afterNewYear ? 0 : 1),
    month: afterNewYear ? g.month - 3 : g.month + 9,
    day: g.day,
  };
}

/** Gregorian year and month that an Assyrian month maps onto. */
function assyrianToGregorianMonth(year: number, month: number) {
  const gregorianYear = year - ASSYRIAN_EPOCH_OFFSET + (month <= 9 ? 0 : 1);
  const gregorianMonth = month <= 9 ? month + 3 : month - 9;
  return { gregorianYear, gregorianMonth };
}

export function rdFromAssyrian(year: number, month: number, day: number): number {
  const { gregorianYear, gregorianMonth } = assyrianToGregorianMonth(year, month);
  return rdFromGregorian(gregorianYear, gregorianMonth, day);
}

export function assyrianMonthLength(year: number, month: number): number {
  const { gregorianYear, gregorianMonth } = assyrianToGregorianMonth(year, month);
  const lengths = [31, isGregorianLeapYear(gregorianYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[gregorianMonth - 1];
}

// ---------------------------------------------------------------------------
// Baha'i (Badí')
// ---------------------------------------------------------------------------

export const BAHAI_MONTHS = [
  "Bahá", "Jalál", "Jamál", "ʻAẓamat", "Núr", "Raḥmat", "Kalimát", "Kamál",
  "Asmáʼ", "ʻIzzat", "Mashíyyat", "ʻIlm", "Qudrat", "Qawl", "Masáʼil",
  "Sharaf", "Sulṭán", "Mulk", "Ayyám-i-Há", "ʻAláʼ",
];

export const BAHAI_MONTH_MEANINGS = [
  "Splendour", "Glory", "Beauty", "Grandeur", "Light", "Mercy", "Words",
  "Perfection", "Names", "Might", "Will", "Knowledge", "Power", "Speech",
  "Questions", "Honour", "Sovereignty", "Dominion", "Days of Há", "Loftiness",
];

/** Ayyám-i-Há sits between month 18 and the fast, so it is slot 19 of 20. */
export const BAHAI_AYYAM_I_HA_INDEX = 19;
export const BAHAI_MONTHS_IN_YEAR = 20;

/** Year 1 BE began at the Naw-Rúz of 1844 CE. */
export const BAHAI_EPOCH_GREGORIAN_YEAR = 1843;

/**
 * Naw-Ruz as published by the Universal House of Justice, which *defines* the
 * Badi' calendar rather than merely predicting it. Computation reproduces every
 * one of these, but some years turn on a margin of a minute or two - 2026's
 * equinox falls within a minute of sunset in Tehran - which is finer than any
 * approximate ephemeris can resolve. Where the published value is known it wins.
 *
 * Keyed by Gregorian year, value is the day of March. The official table runs
 * to 2064; extending this map from it makes those years exact too.
 */
const PUBLISHED_NAW_RUZ: Record<number, number> = {
  2015: 21, 2016: 20, 2017: 20, 2018: 21, 2019: 21, 2020: 20, 2021: 20,
  2022: 21, 2023: 21, 2024: 20, 2025: 20, 2026: 21, 2027: 21, 2028: 20,
  2029: 20,
};

/** Naw-Ruz of the Badi' year `year`, as an RD. */
export function bahaiNewYearRd(year: number): number {
  const gregorianYear = year + BAHAI_EPOCH_GREGORIAN_YEAR;
  const published = PUBLISHED_NAW_RUZ[gregorianYear];
  return published
    ? rdFromGregorian(gregorianYear, 3, published)
    : nawRuzRd(gregorianYear);
}

/**
 * Ayyám-i-Há absorbs whatever the astronomical year has left over: 18 months of
 * 19 days, then 4 or 5 intercalary days, then the 19-day month of the fast.
 */
export function bahaiAyyamIHaLength(year: number): number {
  const total = bahaiNewYearRd(year + 1) - bahaiNewYearRd(year);
  return total - 19 * 19;
}

export function bahaiMonthLength(year: number, month: number): number {
  return month === BAHAI_AYYAM_I_HA_INDEX ? bahaiAyyamIHaLength(year) : 19;
}

export function rdFromBahai(year: number, month: number, day: number): number {
  let offset = 0;
  for (let m = 1; m < month; m++) offset += bahaiMonthLength(year, m);
  return bahaiNewYearRd(year) + offset + day - 1;
}

export function bahaiFromRd(rd: number): CalendarDate {
  const { year: g } = gregorianFromRd(rd);
  // Naw-Rúz falls in March, so a date can belong to the year that began in the
  // previous Gregorian year.
  let year = g - BAHAI_EPOCH_GREGORIAN_YEAR;
  if (rd < bahaiNewYearRd(year)) year--;

  let remaining = rd - bahaiNewYearRd(year);
  let month = 1;
  while (remaining >= bahaiMonthLength(year, month)) {
    remaining -= bahaiMonthLength(year, month);
    month++;
  }
  return { year, month, day: remaining + 1 };
}

// ---------------------------------------------------------------------------
// Javanese
// ---------------------------------------------------------------------------

export const JAVANESE_MONTHS = [
  "Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal", "Jumadilakir",
  "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar",
];

/** The five market days, whose cycle against the 7-day week gives the weton. */
export const PASARAN_NAMES = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

/** The eight years of a windu, which set the pattern of long and short years. */
export const WINDU_YEAR_NAMES = [
  "Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir",
];

/**
 * Anchor of the current kurup, "Asapon": 1 Sura of the Alip year 1867 AJ fell
 * on Tuesday Pon, 24 March 1936 CE. The name encodes the anchor - "Sa" for
 * Selasa (Tuesday) and "pon" for the pasaran day - which is what makes this
 * checkable rather than a guessed offset.
 */
const ASAPON_EPOCH_RD = rdFromGregorian(1936, 3, 24);
const ASAPON_EPOCH_YEAR = 1867;

/** Sultan Agung's scheme: alternating 30/29-day months, Besar taking the leap day. */
const JAVANESE_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

/**
 * Years 2 (Ehe), 5 (Dal) and 8 (Jimakir) of each windu are long.
 *
 * A kurup runs 120 years before one day is dropped; Asapon covers 1867-1986 AJ,
 * roughly 1936-2052 CE. Outside that the pattern here drifts by a day per
 * kurup, so years far from the present are approximate - see
 * docs/CALENDAR_ACCURACY.md.
 */
const isJavaneseLongYear = (year: number) => [1, 4, 7].includes(mod(year - ASAPON_EPOCH_YEAR, 8));

const javaneseYearLength = (year: number) => (isJavaneseLongYear(year) ? 355 : 354);

export const javaneseMonthLength = (year: number, month: number) =>
  month === 12 && isJavaneseLongYear(year) ? 30 : JAVANESE_MONTH_LENGTHS[month - 1];

export function rdFromJavanese(year: number, month: number, day: number): number {
  let rd = ASAPON_EPOCH_RD;
  for (let y = ASAPON_EPOCH_YEAR; y < year; y++) rd += javaneseYearLength(y);
  for (let y = year; y < ASAPON_EPOCH_YEAR; y++) rd -= javaneseYearLength(y);
  for (let m = 1; m < month; m++) rd += javaneseMonthLength(year, m);
  return rd + day - 1;
}

export function javaneseFromRd(rd: number): CalendarDate {
  // A Javanese year is a lunar year, so step from the anchor rather than
  // dividing: the long/short pattern is not uniform within a windu.
  let year = ASAPON_EPOCH_YEAR + Math.floor(((rd - ASAPON_EPOCH_RD) / 354.37) * 1.0);
  while (rdFromJavanese(year, 1, 1) > rd) year--;
  while (rdFromJavanese(year + 1, 1, 1) <= rd) year++;

  let remaining = rd - rdFromJavanese(year, 1, 1);
  let month = 1;
  while (remaining >= javaneseMonthLength(year, month)) {
    remaining -= javaneseMonthLength(year, month);
    month++;
  }
  return { year, month, day: remaining + 1 };
}

/** The pasaran day, anchored on the Pon of the Asapon epoch. */
export const pasaranFromRd = (rd: number) => PASARAN_NAMES[mod(rd - ASAPON_EPOCH_RD + 2, 5)];

/** Which of the eight windu years this Javanese year is. */
export const winduYearName = (year: number) =>
  WINDU_YEAR_NAMES[mod(year - ASAPON_EPOCH_YEAR, 8)];
