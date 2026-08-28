/**
 * Independent reference implementations, written from the standard algorithms
 * in Reingold & Dershowitz, "Calendrical Calculations". Deliberately shares no
 * code with lib/ and never calls ICU, so agreement between this file and the
 * app is evidence rather than a tautology.
 *
 * Everything is expressed in RD ("rata die") fixed days: RD 1 = 1 January 1 CE
 * in the proleptic Gregorian calendar.
 */

export const mod = (a: number, b: number) => a - b * Math.floor(a / b);

const sum = (from: number, to: number, f: (i: number) => number) => {
  let total = 0;
  for (let i = from; i <= to; i++) total += f(i);
  return total;
};

// --- Gregorian / Julian ---

export const gregorianLeap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

export function rdFromGregorian(y: number, m: number, d: number): number {
  const correction = m <= 2 ? 0 : gregorianLeap(y) ? -1 : -2;
  return (
    365 * (y - 1) +
    Math.floor((y - 1) / 4) -
    Math.floor((y - 1) / 100) +
    Math.floor((y - 1) / 400) +
    Math.floor((367 * m - 362) / 12) +
    correction +
    d
  );
}

export function gregorianFromRd(rd: number): { year: number; month: number; day: number } {
  const d0 = rd - 1;
  const n400 = Math.floor(d0 / 146097);
  const d1 = mod(d0, 146097);
  const n100 = Math.floor(d1 / 36524);
  const d2 = mod(d1, 36524);
  const n4 = Math.floor(d2 / 1461);
  const d3 = mod(d2, 1461);
  const n1 = Math.floor(d3 / 365);
  const year = 400 * n400 + 100 * n100 + 4 * n4 + n1 + (n100 === 4 || n1 === 4 ? 0 : 1);
  const prior = rd - rdFromGregorian(year, 1, 1);
  const correction = rd < rdFromGregorian(year, 3, 1) ? 0 : gregorianLeap(year) ? 1 : 2;
  const month = Math.floor((12 * (prior + correction) + 373) / 367);
  const day = rd - rdFromGregorian(year, month, 1) + 1;
  return { year, month, day };
}

const julianLeap = (y: number) => mod(y, 4) === (y > 0 ? 0 : 3);

const JULIAN_EPOCH = -1; // 1 January 1 CE (Julian) in RD

export function rdFromJulian(y: number, m: number, d: number): number {
  const y0 = y < 0 ? y + 1 : y; // Julian numbering has no year zero
  const correction = m <= 2 ? 0 : julianLeap(y) ? -1 : -2;
  return (
    JULIAN_EPOCH -
    1 +
    365 * (y0 - 1) +
    Math.floor((y0 - 1) / 4) +
    Math.floor((367 * m - 362) / 12) +
    correction +
    d
  );
}

// --- Epochs ---

export const COPTIC_EPOCH = rdFromJulian(284, 8, 29);
export const ETHIOPIC_EPOCH = rdFromJulian(8, 8, 29);
export const ISLAMIC_EPOCH = rdFromJulian(622, 7, 16);
export const HEBREW_EPOCH = -1373427;
export const ARMENIAN_EPOCH = rdFromJulian(552, 7, 11);
export const BAHAI_EPOCH = rdFromGregorian(1844, 3, 21);
export const PERSIAN_EPOCH = rdFromJulian(622, 3, 19);

/** Julian Day Number of the day starting at the noon of this RD. */
export const jdnFromRd = (rd: number) => rd + 1721425;
export const rdFromJdn = (jdn: number) => jdn - 1721425;

/**
 * Long Count 0.0.0.0.0. The Goodman-Martinez-Thompson correlation is defined as
 * the constant 584283, so it is stated that way rather than derived from a
 * proleptic date in 3114 BCE, where Julian/Gregorian numbering is easy to slip on.
 */
export const MAYAN_EPOCH = rdFromJdn(584283);

// --- Coptic and Ethiopic: identical structure, different epoch ---

const alexandrian = (epoch: number) => ({
  toRd: (y: number, m: number, d: number) =>
    epoch - 1 + 365 * (y - 1) + Math.floor(y / 4) + 30 * (m - 1) + d,
  fromRd(rd: number) {
    const year = Math.floor((4 * (rd - epoch) + 1463) / 1461);
    const month = Math.floor((rd - this.toRd(year, 1, 1)) / 30) + 1;
    const day = rd - this.toRd(year, month, 1) + 1;
    return { year, month, day };
  },
});

export const coptic = alexandrian(COPTIC_EPOCH);
export const ethiopic = alexandrian(ETHIOPIC_EPOCH);

// --- Islamic (tabular). Umm al-Qura is observational-ish and may differ by a day or two. ---

export const islamicTabular = {
  toRd: (y: number, m: number, d: number) =>
    ISLAMIC_EPOCH -
    1 +
    354 * (y - 1) +
    Math.floor((3 + 11 * y) / 30) +
    29 * (m - 1) +
    Math.floor(m / 2) +
    d,
  fromRd(rd: number) {
    const year = Math.floor((30 * (rd - ISLAMIC_EPOCH) + 10646) / 10631);
    let month = 1;
    while (month < 12 && this.toRd(year, month + 1, 1) <= rd) month++;
    const day = rd - this.toRd(year, month, 1) + 1;
    return { year, month, day };
  },
};

// --- Hebrew ---

export const hebrewLeapYear = (y: number) => mod(7 * y + 1, 19) < 7;
const lastMonthOfHebrewYear = (y: number) => (hebrewLeapYear(y) ? 13 : 12);

function hebrewElapsedDays(year: number): number {
  const monthsElapsed = Math.floor((235 * year - 234) / 19);
  const partsElapsed = 12084 + 13753 * monthsElapsed;
  const days = 29 * monthsElapsed + Math.floor(partsElapsed / 25920);
  return mod(3 * (days + 1), 7) < 3 ? days + 1 : days;
}

function hebrewYearCorrection(year: number): number {
  const ny0 = hebrewElapsedDays(year - 1);
  const ny1 = hebrewElapsedDays(year);
  const ny2 = hebrewElapsedDays(year + 1);
  if (ny2 - ny1 === 356) return 2;
  if (ny1 - ny0 === 382) return 1;
  return 0;
}

export const hebrewNewYear = (year: number) =>
  HEBREW_EPOCH + hebrewElapsedDays(year) + hebrewYearCorrection(year);

const daysInHebrewYear = (year: number) => hebrewNewYear(year + 1) - hebrewNewYear(year);
const longHeshvan = (year: number) => mod(daysInHebrewYear(year), 10) === 5;
const shortKislev = (year: number) => mod(daysInHebrewYear(year), 10) === 3;

export function lastDayOfHebrewMonth(year: number, month: number): number {
  if ([2, 4, 6, 10, 13].includes(month)) return 29;
  if (month === 12 && !hebrewLeapYear(year)) return 29;
  if (month === 8 && !longHeshvan(year)) return 29;
  if (month === 9 && shortKislev(year)) return 29;
  return 30;
}

/** Ecclesiastical month numbering: Nisan = 1 ... Adar II = 13, and Tishrei = 7 starts the year. */
export function rdFromHebrew(year: number, month: number, day: number): number {
  const TISHRI = 7;
  const before =
    month < TISHRI
      ? sum(TISHRI, lastMonthOfHebrewYear(year), (m) => lastDayOfHebrewMonth(year, m)) +
        sum(1, month - 1, (m) => lastDayOfHebrewMonth(year, m))
      : sum(TISHRI, month - 1, (m) => lastDayOfHebrewMonth(year, m));
  return hebrewNewYear(year) + before + day - 1;
}

export function hebrewFromRd(rd: number): { year: number; month: number; day: number } {
  let year = Math.floor((rd - HEBREW_EPOCH) / 365.2468);
  while (hebrewNewYear(year + 1) <= rd) year++;
  while (hebrewNewYear(year) > rd) year--;
  let month = rd < rdFromHebrew(year, 1, 1) ? 7 : 1;
  while (rd > rdFromHebrew(year, month, lastDayOfHebrewMonth(year, month))) month++;
  const day = rd - rdFromHebrew(year, month, 1) + 1;
  return { year, month, day };
}

export const HEBREW_MONTHS = [
  "", "Nisan", "Iyyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei",
  "Cheshvan", "Kislev", "Tevet", "Shvat", "Adar", "Adar II",
];

// --- Indian National (Saka) ---

/** Chaitra 1 falls on 22 March, or 21 March when the Gregorian year is a leap year. */
export function sakaFromRd(rd: number): { year: number; month: number; day: number } {
  const g = gregorianFromRd(rd).year;
  const chaitra1Of = (gy: number) => rdFromGregorian(gy, 3, gregorianLeap(gy) ? 21 : 22);
  const inCurrent = rd >= chaitra1Of(g);
  const gYear = inCurrent ? g : g - 1;
  const start = chaitra1Of(gYear);
  // Chaitra has 31 days when the Saka year began in a Gregorian leap year.
  const firstMonthLen = gregorianLeap(gYear) ? 31 : 30;
  let offset = rd - start;
  if (offset < firstMonthLen) return { year: gYear - 78, month: 1, day: offset + 1 };
  offset -= firstMonthLen;
  if (offset < 5 * 31) {
    return { year: gYear - 78, month: 2 + Math.floor(offset / 31), day: mod(offset, 31) + 1 };
  }
  offset -= 5 * 31;
  return { year: gYear - 78, month: 7 + Math.floor(offset / 30), day: mod(offset, 30) + 1 };
}

export const SAKA_MONTHS = [
  "", "Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra",
  "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna",
];

// --- Persian leap-year pattern (33-year rule), used only as a secondary cross-check ---

export const persianLeap33 = (y: number) => mod(25 * y + 11, 33) < 8;

// --- Armenian: traditional 365-day wandering year, 12 x 30 days + 5 epagomenal ---

export function armenianFromRd(rd: number): { year: number; month: number; day: number } {
  const elapsed = rd - ARMENIAN_EPOCH;
  const year = Math.floor(elapsed / 365) + 1;
  const dayOfYear = mod(elapsed, 365);
  return { year, month: Math.floor(dayOfYear / 30) + 1, day: mod(dayOfYear, 30) + 1 };
}

export const ARMENIAN_MONTHS = [
  "", "Nawasardi", "Hori", "Sahmi", "Tre", "Kaghots", "Arats", "Mehekani",
  "Areg", "Ahekani", "Mareri", "Margats", "Hrotits", "Aveleats",
];

// --- Mayan Long Count ---

export function mayanLongCount(rd: number) {
  const days = rd - MAYAN_EPOCH;
  return {
    baktun: Math.floor(days / 144000),
    katun: mod(Math.floor(days / 7200), 20),
    tun: mod(Math.floor(days / 360), 20),
    uinal: mod(Math.floor(days / 20), 18),
    kin: mod(days, 20),
    toString() {
      return `${this.baktun}.${this.katun}.${this.tun}.${this.uinal}.${this.kin}`;
    },
  };
}

// --- Sikh: original 2003 Nanakshahi, fixed solar months, Chet 1 = 14 March ---

export const NANAKSHAHI_MONTHS = [
  "", "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
  "Assu", "Katak", "Maghar", "Poh", "Magh", "Phagun",
];

export function nanakshahiFromRd(rd: number): { year: number; month: number; day: number } {
  const g = gregorianFromRd(rd).year;
  const chet1Of = (gy: number) => rdFromGregorian(gy, 3, 14);
  const gYear = rd >= chet1Of(g) ? g : g - 1;
  const lengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, gregorianLeap(gYear + 1) ? 31 : 30];
  let offset = rd - chet1Of(gYear);
  let month = 1;
  while (offset >= lengths[month - 1]) {
    offset -= lengths[month - 1];
    month++;
  }
  return { year: gYear - 1468, month, day: offset + 1 };
}

// --- Assyrian: Gregorian month structure, year + 4750, new year 1 April (Kha b-Nisan) ---

export const ASSYRIAN_MONTHS = [
  "", "Nisan", "Iyyar", "Khzeeran", "Tamuz", "Aab", "Eloul",
  "Tishrin I", "Tishrin II", "Kanoon I", "Kanoon II", "Shwadt", "Adar",
];

export function assyrianFromRd(rd: number): { year: number; month: number; day: number } {
  const g = gregorianFromRd(rd);
  // The Assyrian year rolls over on 1 April, so Jan-Mar still belongs to the previous one.
  return { year: g.year + 4750 - (g.month < 4 ? 1 : 0), month: g.month, day: g.day };
}
