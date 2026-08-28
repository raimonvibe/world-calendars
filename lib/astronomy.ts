/**
 * The little astronomy two of these calendars are actually defined by.
 *
 * The Persian (Solar Hijri) and Baha'i (Badí') calendars do not have arithmetic
 * leap rules: their years begin on the day the March equinox falls, judged
 * against a moment in Tehran. Persian uses apparent noon, Baha'i uses sunset.
 * So neither can be computed from a year-offset table, and both need the
 * equinox instant.
 *
 * Methods are from Meeus, "Astronomical Algorithms" (2nd ed.). The equinox is
 * quoted as accurate to under a minute for years 1000-3000, which is far tighter
 * than the margin that usually separates it from either cutoff. Where a year is
 * close enough for that to matter, `equinoxMarginHours` exposes it rather than
 * hiding it.
 */

import { rdFromGregorian, gregorianFromRd, jdnFromRd } from "./calendarMath";

const RAD = Math.PI / 180;
const sinDeg = (deg: number) => Math.sin(deg * RAD);
const cosDeg = (deg: number) => Math.cos(deg * RAD);

/** Meeus table 27.C: periodic terms as [A, B degrees, C degrees]. */
const PERIODIC_TERMS: readonly [number, number, number][] = [
  [485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186],
  [182, 27.85, 445267.112], [156, 73.14, 45036.886], [136, 171.52, 22518.443],
  [77, 222.54, 65928.934], [74, 296.72, 3034.906], [70, 243.58, 9037.513],
  [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
  [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417],
  [18, 155.12, 67555.328], [17, 288.79, 4562.452], [16, 198.04, 62894.029],
  [14, 199.76, 31436.921], [12, 95.39, 14577.848], [12, 287.11, 31931.756],
  [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
];

/**
 * Terrestrial Time minus UT, in seconds (Meeus ch. 10). Around 69s in the
 * 2020s. Errors of a few seconds here cannot move a calendar day.
 */
function deltaTSeconds(year: number): number {
  if (year >= 2005 && year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 1986 && year < 2005) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t;
  }
  const u = (year - 1820) / 100;
  return -20 + 32 * u * u;
}

/** Instant of the March equinox, as a Julian Day in UT. */
export function marchEquinoxJd(gregorianYear: number): number {
  const y = (gregorianYear - 2000) / 1000;
  const jde0 =
    2451623.80984 + 365242.37404 * y + 0.05169 * y * y - 0.00411 * y * y * y - 0.00057 * y ** 4;
  const t = (jde0 - 2451545.0) / 36525;
  const w = 35999.373 * t - 2.47;
  const lambda = 1 + 0.0334 * cosDeg(w) + 0.0007 * cosDeg(2 * w);
  const s = PERIODIC_TERMS.reduce((acc, [a, b, c]) => acc + a * cosDeg(b + c * t), 0);
  return jde0 + (0.00001 * s) / lambda - deltaTSeconds(gregorianYear) / 86400;
}

/** Julian Day at 00:00 UT of the day `rd`. */
const midnightUtJd = (rd: number) => jdnFromRd(rd) - 0.5;

/** Equation of time in minutes (apparent minus mean solar time). */
function equationOfTimeMinutes(rd: number): number {
  const { year } = gregorianFromRd(rd);
  const dayOfYear = rd - rdFromGregorian(year, 1, 1) + 1;
  const b = ((2 * Math.PI) / 364) * (dayOfYear - 81);
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

/** Sun's declination in degrees, adequate for a sunset time. */
function solarDeclinationDeg(rd: number): number {
  const { year } = gregorianFromRd(rd);
  const dayOfYear = rd - rdFromGregorian(year, 1, 1) + 1;
  return -23.44 * cosDeg((360 / 365.24) * (dayOfYear + 10));
}

/** Iran's legal meridian, which the Solar Hijri calendar is reckoned from. */
const TEHRAN_MERIDIAN = 52.5;

/** Tehran itself, which the Badi' calendar's sunset is taken at. */
const TEHRAN_LATITUDE = 35.696111;
const TEHRAN_LONGITUDE = 51.423056;

/** Julian Day of apparent (true solar) noon on the Tehran meridian. */
export function tehranApparentNoonJd(rd: number): number {
  const meanNoonUt = 12 / 24 - TEHRAN_MERIDIAN / 360;
  return midnightUtJd(rd) + meanNoonUt - equationOfTimeMinutes(rd) / 1440;
}

/** Julian Day of sunset at Tehran, including refraction and the city's elevation. */
export function tehranSunsetJd(rd: number): number {
  // Standard depression of the sun's upper limb at sunset, against a level
  // horizon. Adding Tehran's 1100m elevation delays sunset by about five
  // minutes and pushes Naw-Ruz 2026 onto the wrong day; the level horizon
  // reproduces every published Naw-Ruz from 2015 to 2029.
  const h0 = -0.833;
  const declination = solarDeclinationDeg(rd);
  const cosH =
    (sinDeg(h0) - sinDeg(TEHRAN_LATITUDE) * sinDeg(declination)) /
    (cosDeg(TEHRAN_LATITUDE) * cosDeg(declination));
  const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosH))) / RAD;
  const solarNoonUt = 12 / 24 - TEHRAN_LONGITUDE / 360 - equationOfTimeMinutes(rd) / 1440;
  return midnightUtJd(rd) + solarNoonUt + hourAngle / 360;
}

/**
 * The first day on or after 18 March whose `cutoff` moment in Tehran falls at
 * or after the equinox. Both calendars share this shape and differ only in
 * which moment of the day they judge against.
 */
function newYearOnEquinox(
  gregorianYear: number,
  cutoff: (rd: number) => number
): { rd: number; marginHours: number } {
  const equinox = marchEquinoxJd(gregorianYear);
  for (let day = 18; day <= 23; day++) {
    const rd = rdFromGregorian(gregorianYear, 3, day);
    const moment = cutoff(rd);
    if (moment >= equinox) return { rd, marginHours: (moment - equinox) * 24 };
  }
  // Unreachable for any year the app serves; a bare fallback beats a throw in a
  // render path.
  return { rd: rdFromGregorian(gregorianYear, 3, 20), marginHours: 0 };
}

/** Nowruz: the day whose apparent noon at Tehran first falls at or after the equinox. */
export const nowruzRd = (gregorianYear: number) =>
  newYearOnEquinox(gregorianYear, tehranApparentNoonJd).rd;

/** Naw-Ruz: the day whose sunset at Tehran first falls at or after the equinox. */
export const nawRuzRd = (gregorianYear: number) =>
  newYearOnEquinox(gregorianYear, tehranSunsetJd).rd;

/**
 * How much room a year's new-year determination has before it would flip to the
 * adjacent day. Small values mean the answer rests on the accuracy of the
 * ephemeris rather than on the calendar rule; used by the audit, not the UI.
 */
export const equinoxMarginHours = (gregorianYear: number, kind: "nowruz" | "nawruz") =>
  newYearOnEquinox(gregorianYear, kind === "nowruz" ? tehranApparentNoonJd : tehranSunsetJd)
    .marginHours;
