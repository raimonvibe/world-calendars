/**
 * Step 5 of the audit: every calendar's month grids must tile its year exactly.
 *
 * This is the invariant that the year-view components were violating. They did
 * not call getMonthInfo at all - each one mapped January-December onto a
 * Gregorian year with an offset - so a Coptic year rendered twelve months of
 * 28-31 days instead of thirteen, and the audit's per-date checks never saw it
 * because they tested the library rather than the view.
 *
 * Checking that the months sum to the real year length, with contiguous starts
 * and correct weekdays, catches a whole class of bug in one assertion.
 */
import { describe, it, expect } from "vitest";
import { getMonthInfo, MONTH_RANGES, getDefaultYearForCalendar } from "@/lib/calendarViews";
import { CALENDAR_IDS } from "@/lib/calendars";
import { weekdayFromRd, rdFromGregorian } from "@/lib/calendarMath";
import * as R from "./reference";
import { persianAstronomicalFromRd, nowruz } from "./astronomy";

/** True length of one year of each calendar, from the independent references. */
const YEAR_LENGTH: Record<string, (year: number) => number | null> = {
  gregorian: (y) => (R.gregorianLeap(y) ? 366 : 365),
  buddhist: (y) => (R.gregorianLeap(y - 543) ? 366 : 365),
  "thai-solar": (y) => (R.gregorianLeap(y - 543) ? 366 : 365),
  japanese: (y) => (R.gregorianLeap(y) ? 366 : 365),
  coptic: (y) => R.coptic.toRd(y + 1, 1, 1) - R.coptic.toRd(y, 1, 1),
  ethiopian: (y) => R.ethiopic.toRd(y + 1, 1, 1) - R.ethiopic.toRd(y, 1, 1),
  hindu: (y) => (R.gregorianLeap(y + 78) ? 366 : 365),
  hebrew: (y) => R.hebrewNewYear(y + 1) - R.hebrewNewYear(y),
  persian: (y) => nowruz(y + 622).rd - nowruz(y + 621).rd,
  armenian: () => 365,
  // Phagun takes a 31st day when the Gregorian year the Nanakshahi year ends in is leap.
  sikh: (y) => (R.gregorianLeap(y + 1469) ? 366 : 365),
  assyrian: (y) => (R.gregorianLeap(y - 4750 + 1) ? 366 : 365),
  mayan: () => 365,
  // Lunisolar and lunar years vary; asserted by range instead.
  islamic: () => null,
  chinese: () => null,
  korean: () => null,
  bahai: () => null,
  javanese: () => null,
};

const RANGE: Record<string, [number, number]> = {
  islamic: [354, 355],
  chinese: [353, 385],
  korean: [353, 385],
  bahai: [365, 366],
  javanese: [354, 355],
};

describe("month grids tile the year", () => {
  for (const id of CALENDAR_IDS) {
    it(`${id}`, () => {
      const year = getDefaultYearForCalendar(id);
      const count = MONTH_RANGES[id];
      expect(count, `${id} has no MONTH_RANGES entry, so its month pages 404`).toBeDefined();

      const months = [];
      for (let m = 1; m <= count; m++) {
        const info = getMonthInfo(id, year, m);
        if (info) months.push(info);
      }
      expect(months.length, `${id} renders no months`).toBeGreaterThan(0);

      const total = months.reduce((a, m) => a + m.daysCount, 0);
      const expected = YEAR_LENGTH[id]?.(year) ?? null;
      if (expected != null) {
        expect(total, `${id} year ${year} totals ${total} days, should be ${expected}`).toBe(expected);
      } else {
        const [lo, hi] = RANGE[id];
        expect(total, `${id} year ${year} totals ${total} days`).toBeGreaterThanOrEqual(lo);
        expect(total, `${id} year ${year} totals ${total} days`).toBeLessThanOrEqual(hi);
      }
    });
  }
});

describe("month grids start on consecutive weekdays", () => {
  // If month N has L days and starts on weekday W, month N+1 must start on
  // (W + L) mod 7. A grid that fails this is drawing days in the wrong columns.
  for (const id of CALENDAR_IDS) {
    it(`${id}`, () => {
      const year = getDefaultYearForCalendar(id);
      const count = MONTH_RANGES[id];
      const problems: string[] = [];
      for (let m = 1; m < count; m++) {
        const current = getMonthInfo(id, year, m);
        const next = getMonthInfo(id, year, m + 1);
        if (!current || !next) continue;
        const expected = (current.firstWeekday + current.daysCount) % 7;
        if (next.firstWeekday !== expected) {
          problems.push(
            `month ${m + 1} starts on weekday ${next.firstWeekday}, but month ${m} ` +
              `(${current.daysCount} days from weekday ${current.firstWeekday}) implies ${expected}`
          );
        }
      }
      expect(problems, `${id} year ${year}`).toEqual([]);
    });
  }
});

describe("the first month of the year starts on the right weekday", () => {
  const anchors: Record<string, (year: number) => number> = {
    gregorian: (y) => rdFromGregorian(y, 1, 1),
    coptic: (y) => R.coptic.toRd(y, 1, 1),
    ethiopian: (y) => R.ethiopic.toRd(y, 1, 1),
    hebrew: (y) => R.hebrewNewYear(y),
    persian: (y) => nowruz(y + 621).rd,
    armenian: (y) => R.ARMENIAN_EPOCH + 365 * (y - 1),
    sikh: (y) => rdFromGregorian(y + 1468, 3, 14),
    assyrian: (y) => rdFromGregorian(y - 4750, 4, 1),
  };

  for (const [id, anchor] of Object.entries(anchors)) {
    it(`${id}`, () => {
      const year = getDefaultYearForCalendar(id);
      const first = getMonthInfo(id, year, 1);
      expect(first?.firstWeekday, `${id} year ${year}`).toBe(weekdayFromRd(anchor(year)));
    });
  }
});

describe("today falls inside the year the navigation defaults to", () => {
  const todayRd = R.rdFromGregorian(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const currentYear: Record<string, number> = {
    coptic: R.coptic.fromRd(todayRd).year,
    ethiopian: R.ethiopic.fromRd(todayRd).year,
    hindu: R.sakaFromRd(todayRd).year,
    hebrew: R.hebrewFromRd(todayRd).year,
    persian: persianAstronomicalFromRd(todayRd).year,
    armenian: R.armenianFromRd(todayRd).year,
    sikh: R.nanakshahiFromRd(todayRd).year,
    assyrian: R.assyrianFromRd(todayRd).year,
  };

  for (const [id, expected] of Object.entries(currentYear)) {
    it(`${id}`, () => {
      expect(getDefaultYearForCalendar(id)).toBe(expected);
    });
  }
});
