/**
 * Day-number arithmetic shared by the calendars ICU does not implement.
 *
 * Everything is reduced to RD ("rata die") fixed days, where RD 1 is
 * 1 January 1 CE in the proleptic Gregorian calendar. Converting each calendar
 * to and from a single day number keeps the per-calendar code to its own rules
 * and removes the ad-hoc "Gregorian date with an offset added to the year"
 * arithmetic these calendars used to carry.
 *
 * The independent implementations in tests/audit check this file against
 * published algorithms and externally known dates; run `npm run audit`.
 */

/** Modulo that returns a non-negative result for negative operands. */
export const mod = (a: number, b: number) => a - b * Math.floor(a / b);

export const isGregorianLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

export function rdFromGregorian(year: number, month: number, day: number): number {
  const correction = month <= 2 ? 0 : isGregorianLeapYear(year) ? -1 : -2;
  return (
    365 * (year - 1) +
    Math.floor((year - 1) / 4) -
    Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor((367 * month - 362) / 12) +
    correction +
    day
  );
}

export type GregorianDate = { year: number; month: number; day: number };

export function gregorianFromRd(rd: number): GregorianDate {
  const prior = rd - 1;
  const n400 = Math.floor(prior / 146097);
  const r400 = mod(prior, 146097);
  const n100 = Math.floor(r400 / 36524);
  const r100 = mod(r400, 36524);
  const n4 = Math.floor(r100 / 1461);
  const r4 = mod(r100, 1461);
  const n1 = Math.floor(r4 / 365);
  const year = 400 * n400 + 100 * n100 + 4 * n4 + n1 + (n100 === 4 || n1 === 4 ? 0 : 1);
  const dayOfYear = rd - rdFromGregorian(year, 1, 1);
  const correction = rd < rdFromGregorian(year, 3, 1) ? 0 : isGregorianLeapYear(year) ? 1 : 2;
  const month = Math.floor((12 * (dayOfYear + correction) + 373) / 367);
  return { year, month, day: rd - rdFromGregorian(year, month, 1) + 1 };
}

const isJulianLeapYear = (year: number) => mod(year, 4) === (year > 0 ? 0 : 3);

/** RD of a date in the Julian calendar, which several epochs are quoted in. */
export function rdFromJulian(year: number, month: number, day: number): number {
  const y = year < 0 ? year + 1 : year; // Julian numbering has no year zero
  const correction = month <= 2 ? 0 : isJulianLeapYear(year) ? -1 : -2;
  return (
    -2 +
    365 * (y - 1) +
    Math.floor((y - 1) / 4) +
    Math.floor((367 * month - 362) / 12) +
    correction +
    day
  );
}

/** Julian Day Number of the day that begins at the noon of this RD. */
export const jdnFromRd = (rd: number) => rd + 1721425;
export const rdFromJdn = (jdn: number) => jdn - 1721425;

/**
 * RD of a JavaScript Date, read with local-time getters. The app reads dates
 * locally throughout, so a date is whatever day it is on the viewer's clock.
 */
export const rdFromDate = (date: Date) =>
  rdFromGregorian(date.getFullYear(), date.getMonth() + 1, date.getDate());

/** Local noon on the given RD, so a DST transition cannot shift the day. */
export function dateFromRd(rd: number): Date {
  const { year, month, day } = gregorianFromRd(rd);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/** Weekday of an RD as the app numbers it: 0 = Monday ... 6 = Sunday. */
export const weekdayFromRd = (rd: number) => mod(rd - 1, 7);
