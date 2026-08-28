/**
 * The March equinox, from Meeus, "Astronomical Algorithms" (2nd ed.), ch. 27.
 *
 * The Persian and Baha'i calendars are both *defined* by the equinox rather
 * than by arithmetic, so auditing them means computing it rather than trusting
 * a rule of thumb. Meeus' method is quoted as accurate to under a minute for
 * years 1000-3000, which is far tighter than the roughly four-hour margin that
 * normally separates the equinox from the noon cutoff.
 */

import { rdFromGregorian, gregorianFromRd, jdnFromRd } from "./reference";

const RAD = Math.PI / 180;

/** Mean equinox, Meeus table 27.B (years 1000-3000). Returns a Julian Ephemeris Day. */
function meanMarchEquinox(year: number): number {
  const y = (year - 2000) / 1000;
  return (
    2451623.80984 +
    365242.37404 * y +
    0.05169 * y * y -
    0.00411 * y * y * y -
    0.00057 * y * y * y * y
  );
}

/** Meeus table 27.C: 24 periodic terms, as [A, B degrees, C degrees]. */
const PERIODIC_TERMS: [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

/**
 * Difference between Terrestrial Time and UT, in seconds. Meeus ch. 10's
 * polynomial for the modern era; around 69s in the 2020s and slowly growing.
 * A few seconds of error here cannot move a date.
 */
function deltaT(year: number): number {
  if (year >= 2005 && year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 1986 && year < 2005) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t;
  }
  // Good enough beyond the tables for an audit that only spans a century or two.
  const u = (year - 1820) / 100;
  return -20 + 32 * u * u;
}

/** Instant of the March equinox as a Julian Day in UT. */
export function marchEquinoxJd(year: number): number {
  const jde0 = meanMarchEquinox(year);
  const t = (jde0 - 2451545.0) / 36525;
  const w = (35999.373 * t - 2.47) * RAD;
  const lambda = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w);
  const s = PERIODIC_TERMS.reduce((acc, [a, b, c]) => acc + a * Math.cos((b + c * t) * RAD), 0);
  const jde = jde0 + (0.00001 * s) / lambda;
  return jde - deltaT(year) / 86400;
}

/**
 * Equation of time in minutes (apparent solar time minus mean solar time),
 * from the standard low-precision series. Around -7.5 minutes in late March.
 */
function equationOfTime(dayOfYear: number): number {
  const b = ((2 * Math.PI) / 364) * (dayOfYear - 81);
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

/** Iran's legal meridian, which the Solar Hijri calendar is reckoned from. */
const TEHRAN_MERIDIAN = 52.5;

/** Julian Day of apparent (true solar) noon at the Tehran meridian on this RD. */
export function tehranApparentNoonJd(rd: number): number {
  const dayOfYear = rd - rdFromGregorian(gregorianFromRd(rd).year, 1, 1) + 1;
  // JD at 00:00 UT is the noon-based JDN minus half a day.
  const midnightUt = jdnFromRd(rd) - 0.5;
  const meanNoonUt = 12 / 24 - TEHRAN_MERIDIAN / 360;
  const apparentNoonUt = meanNoonUt - equationOfTime(dayOfYear) / 1440;
  return midnightUt + apparentNoonUt;
}

export type NowruzResult = {
  rd: number;
  /** Hours between the equinox and the noon cutoff. Small values mean the call is marginal. */
  marginHours: number;
};

/**
 * Nowruz for the Persian year beginning in the given Gregorian year: the first
 * day whose apparent noon at Tehran falls at or after the equinox. This is the
 * rule in Iran's calendar law and in Reingold & Dershowitz.
 */
export function nowruz(gregorianYear: number): NowruzResult {
  const equinox = marchEquinoxJd(gregorianYear);
  for (let d = 18; d <= 23; d++) {
    const rd = rdFromGregorian(gregorianYear, 3, d);
    const noon = tehranApparentNoonJd(rd);
    if (noon >= equinox) return { rd, marginHours: (noon - equinox) * 24 };
  }
  throw new Error(`no Nowruz found for ${gregorianYear}`);
}

/** Persian year number for the Nowruz beginning in this Gregorian year. */
export const persianYearStartingIn = (gregorianYear: number) => gregorianYear - 621;

/**
 * Persian date by the astronomical rule: 6 months of 31 days, 5 of 30, and a
 * final month running to the next Nowruz (29 or 30 days).
 */
export function persianAstronomicalFromRd(rd: number): { year: number; month: number; day: number } {
  const g = gregorianFromRd(rd).year;
  const thisYear = nowruz(g).rd;
  const [start, year] =
    rd >= thisYear
      ? [thisYear, persianYearStartingIn(g)]
      : [nowruz(g - 1).rd, persianYearStartingIn(g - 1)];
  const dayOfYear = rd - start;
  const month = dayOfYear < 186 ? Math.floor(dayOfYear / 31) + 1 : Math.floor((dayOfYear - 186) / 30) + 7;
  const monthStart = month <= 6 ? 31 * (month - 1) : 6 * 31 + 30 * (month - 7);
  return { year, month, day: dayOfYear - monthStart + 1 };
}

export const PERSIAN_MONTHS = [
  "", "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
  "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand",
];

// ---------------------------------------------------------------------------
// Lunisolar machinery, for auditing the Chinese and Korean calendars
// ---------------------------------------------------------------------------

/** Apparent solar longitude in degrees, Meeus ch. 25 (low precision, ~0.01 deg). */
export function solarLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) * RAD;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m);
  const omega = (125.04 - 1934.136 * t) * RAD;
  return mod360(l0 + c - 0.00569 - 0.00478 * Math.sin(omega));
}

const mod360 = (x: number) => ((x % 360) + 360) % 360;

/** December solstice, Meeus table 27.B. */
export function decemberSolsticeJd(year: number): number {
  const y = (year - 2000) / 1000;
  const jde0 =
    2451900.05952 + 365242.74049 * y - 0.06223 * y * y - 0.00823 * y * y * y + 0.00032 * y * y * y * y;
  const t = (jde0 - 2451545.0) / 36525;
  const w = (35999.373 * t - 2.47) * RAD;
  const lambda = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w);
  const s = PERIODIC_TERMS.reduce((acc, [a, b, c]) => acc + a * Math.cos((b + c * t) * RAD), 0);
  return jde0 + (0.00001 * s) / lambda - deltaT(year) / 86400;
}

/**
 * Instant of the k-th new moon since the one of January 2000, Meeus ch. 49.
 * The 14 small planetary terms are omitted; the residual is well under a
 * minute, which is reported as a margin rather than assumed away.
 */
export function newMoonJd(k: number): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  let jde =
    2451550.09766 + 29.530588861 * k + 0.00015437 * t2 - 0.00000015 * t3 + 0.00000000073 * t4;

  const e = 1 - 0.002516 * t - 0.0000074 * t2;
  const m = (2.5534 + 29.1053567 * k - 0.0000014 * t2 - 0.00000011 * t3) * RAD;
  const mp = (201.5643 + 385.81693528 * k + 0.0107582 * t2 + 0.00001238 * t3 - 0.000000058 * t4) * RAD;
  const f = (160.7108 + 390.67050284 * k - 0.0016118 * t2 - 0.00000227 * t3 + 0.000000011 * t4) * RAD;
  const omega = (124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3) * RAD;

  jde +=
    -0.4072 * Math.sin(mp) +
    0.17241 * e * Math.sin(m) +
    0.01608 * Math.sin(2 * mp) +
    0.01039 * Math.sin(2 * f) +
    0.00739 * e * Math.sin(mp - m) -
    0.00514 * e * Math.sin(mp + m) +
    0.00208 * e * e * Math.sin(2 * m) -
    0.00111 * Math.sin(mp - 2 * f) -
    0.00057 * Math.sin(mp + 2 * f) +
    0.00056 * e * Math.sin(2 * mp + m) -
    0.00042 * Math.sin(3 * mp) +
    0.00042 * e * Math.sin(m + 2 * f) +
    0.00038 * e * Math.sin(m - 2 * f) -
    0.00024 * e * Math.sin(2 * mp - m) -
    0.00017 * Math.sin(omega) -
    0.00007 * Math.sin(mp + 2 * m) +
    0.00004 * Math.sin(2 * mp - 2 * f) +
    0.00004 * Math.sin(3 * m) +
    0.00003 * Math.sin(mp + m - 2 * f) +
    0.00003 * Math.sin(2 * mp + 2 * f) -
    0.00003 * Math.sin(mp + m + 2 * f) +
    0.00003 * Math.sin(mp - m + 2 * f) -
    0.00002 * Math.sin(mp - m - 2 * f) -
    0.00002 * Math.sin(3 * mp + m) +
    0.00002 * Math.sin(4 * mp);

  // The larger of Meeus' additional (planetary) corrections.
  const a1 = (299.77 + 0.107408 * k - 0.009173 * t2) * RAD;
  const a2 = (251.88 + 0.016321 * k) * RAD;
  const a3 = (251.83 + 26.651886 * k) * RAD;
  const a4 = (349.42 + 36.412478 * k) * RAD;
  const a5 = (84.66 + 18.206239 * k) * RAD;
  jde +=
    0.000325 * Math.sin(a1) +
    0.000165 * Math.sin(a2) +
    0.000164 * Math.sin(a3) +
    0.000126 * Math.sin(a4) +
    0.00011 * Math.sin(a5);

  const year = 2000 + k / 12.3685;
  return jde - deltaT(year) / 86400;
}

/** China Standard Time is UTC+8, and the Chinese calendar is reckoned on it. */
const CST_OFFSET = 8 / 24;
/** Korea Standard Time is UTC+9, which is why the Dangi calendar can differ by a day. */
const KST_OFFSET = 9 / 24;

/** Julian Day (UT) of local midnight starting the day `rd`, at the given UTC offset. */
export const jdOfLocalMidnight = (rd: number, offset: number) => rd + 1721425 - 0.5 - offset;

/** RD of the local calendar day containing this instant, at the given UTC offset. */
export const rdOfInstant = (jd: number, offset: number) =>
  Math.floor(jd + 0.5 + offset) - 1721425;

/** RD of the new-moon day at or before `rd`, in the given zone. */
function newMoonOnOrBefore(rd: number, offset: number): number {
  let k = Math.floor(((rd + 1721425 - 2451550) / 29.530588861) * 1.0000001) + 1;
  while (rdOfInstant(newMoonJd(k), offset) > rd) k--;
  while (rdOfInstant(newMoonJd(k + 1), offset) <= rd) k++;
  return k;
}

export type LunisolarYear = {
  /** RD of the first day of month 1, i.e. Lunar New Year. */
  newYear: number;
  /** Month starts in order, with number and leap flag. */
  months: { number: number; leap: boolean; start: number; length: number }[];
};

/**
 * The lunisolar year whose Lunar New Year falls in `gregorianYear`, computed
 * from first principles: month 11 is the month containing the December
 * solstice, and if the span to the next month 11 holds 13 months, the first
 * month with no major solar term is the leap month.
 */
export function lunisolarYear(gregorianYear: number, offset = CST_OFFSET): LunisolarYear {
  const solstice1 = decemberSolsticeJd(gregorianYear - 1);
  const solstice2 = decemberSolsticeJd(gregorianYear);
  const k11 = newMoonOnOrBefore(rdOfInstant(solstice1, offset), offset);
  const kNext11 = newMoonOnOrBefore(rdOfInstant(solstice2, offset), offset);
  const monthCount = kNext11 - k11;

  const startOf = (k: number) => rdOfInstant(newMoonJd(k), offset);
  /** Which 30-degree sector of the ecliptic the sun is in at local midnight. */
  const majorTerm = (rd: number) => Math.floor(solarLongitude(jdOfLocalMidnight(rd, offset)) / 30);

  let leapIndex = -1;
  if (monthCount === 13) {
    for (let i = 1; i <= 12; i++) {
      if (majorTerm(startOf(k11 + i)) === majorTerm(startOf(k11 + i + 1))) {
        leapIndex = i;
        break;
      }
    }
  }

  const months: LunisolarYear["months"] = [];
  let number = 11;
  for (let i = 0; i < monthCount; i++) {
    const leap = i === leapIndex;
    if (!leap) {
      number = i === 0 ? 11 : (number % 12) + 1;
    }
    months.push({
      number: leap ? months[months.length - 1].number : number,
      leap,
      start: startOf(k11 + i),
      length: startOf(k11 + i + 1) - startOf(k11 + i),
    });
  }

  const monthOne = months.find((m) => m.number === 1 && !m.leap);
  if (!monthOne) throw new Error(`no month 1 found for ${gregorianYear}`);
  return { newYear: monthOne.start, months };
}

export const CST = CST_OFFSET;
export const KST = KST_OFFSET;
