import { describe, it, expect } from "vitest";
import {
  getMonthInfo,
  getDefaultYearForCalendar,
  getYearRangeForCalendar,
  isYearInRange,
  clampYearToRange,
  MONTH_RANGES,
} from "@/lib/calendarViews";
import { CALENDAR_IDS } from "@/lib/calendars";
import { day, icuYearMonthLengths } from "./helpers";

/** Total days across every month the app renders for a given year. */
function yearLength(calendarId: string, year: number): number {
  const months = MONTH_RANGES[calendarId] ?? 12;
  let total = 0;
  for (let month = 1; month <= months; month++) {
    total += getMonthInfo(calendarId, year, month)?.daysCount ?? 0;
  }
  return total;
}

describe("served year range", () => {
  // Regression guard: a bogus default year once made this range NaN, which
  // 404'd every Islamic month page.
  it.each([...CALENDAR_IDS])("%s has a finite, sane default year and range", (id) => {
    const defaultYear = getDefaultYearForCalendar(id);
    expect(Number.isFinite(defaultYear), `${id} default year`).toBe(true);
    expect(defaultYear, `${id} default year`).toBeGreaterThan(0);

    const { minYear, maxYear } = getYearRangeForCalendar(id);
    expect(Number.isFinite(minYear)).toBe(true);
    expect(Number.isFinite(maxYear)).toBe(true);
    expect(maxYear).toBeGreaterThan(minYear);
  });

  it.each([...CALENDAR_IDS])("%s serves its own default year", (id) => {
    expect(isYearInRange(id, getDefaultYearForCalendar(id))).toBe(true);
  });

  it("rejects years outside the window", () => {
    const { minYear, maxYear } = getYearRangeForCalendar("gregorian");
    expect(isYearInRange("gregorian", minYear - 1)).toBe(false);
    expect(isYearInRange("gregorian", maxYear + 1)).toBe(false);
    expect(isYearInRange("gregorian", NaN)).toBe(false);
  });

  it("clamps out-of-range years to the window", () => {
    const { minYear, maxYear } = getYearRangeForCalendar("gregorian");
    expect(clampYearToRange("gregorian", 99999)).toBe(maxYear);
    expect(clampYearToRange("gregorian", -99999)).toBe(minYear);
    expect(clampYearToRange("gregorian", NaN)).toBe(getDefaultYearForCalendar("gregorian"));
  });
});

describe("month grids", () => {
  it("gregorian month lengths are exact", () => {
    expect(yearLength("gregorian", 2026)).toBe(365);
    expect(yearLength("gregorian", 2028)).toBe(366);
    expect(getMonthInfo("gregorian", 2026, 2)?.daysCount).toBe(28);
    expect(getMonthInfo("gregorian", 2028, 2)?.daysCount).toBe(29);
  });

  it("hebrew year length is one of the six valid lengths", () => {
    // A Hebrew year is 353, 354, 355 (common) or 383, 384, 385 (leap) days.
    for (let year = 5780; year <= 5800; year++) {
      expect([353, 354, 355, 383, 384, 385], `year ${year}`).toContain(
        yearLength("hebrew", year)
      );
    }
  });

  it("every calendar renders each of its months without throwing", () => {
    for (const id of CALENDAR_IDS) {
      const year = getDefaultYearForCalendar(id);
      const months = MONTH_RANGES[id];
      if (months == null) continue; // mayan has no month view

      let rendered = 0;
      for (let month = 1; month <= months; month++) {
        const info = getMonthInfo(id, year, month);
        // MONTH_RANGES is the maximum; a Hebrew common year genuinely has only
        // 12 months, and the month route redirects for the absent 13th.
        if (info == null) continue;
        rendered++;
        expect(info.daysCount, `${id} month ${month} days`).toBeGreaterThan(0);
        expect(info.firstWeekday, `${id} month ${month} weekday`).toBeGreaterThanOrEqual(0);
        expect(info.firstWeekday, `${id} month ${month} weekday`).toBeLessThanOrEqual(6);
      }
      expect(rendered, `${id} rendered months`).toBeGreaterThanOrEqual(Math.min(months, 12));
    }
  });
});

describe("month grids — known broken, fixed in phase 2", () => {
  // A plausible-looking year total is not evidence of a correct grid: the
  // invented Chinese formula alternates 30/29 to exactly 354, which is a valid
  // common-year length. Compare the actual month lengths against ICU instead.
  it.fails("islamic month lengths match the real Hijri calendar", () => {
    const lengths = icuYearMonthLengths("islamic-umalqura", day(2026, 8, 10)).slice(0, 12);
    const year = getDefaultYearForCalendar("islamic");
    const actual = Array.from(
      { length: 12 },
      (_, i) => getMonthInfo("islamic", year, i + 1)?.daysCount
    );
    expect(actual).toEqual(lengths);
  });

  it.fails("chinese month lengths match the real lunisolar calendar", () => {
    const lengths = icuYearMonthLengths("chinese", day(2026, 8, 10)).slice(0, 12);
    const year = getDefaultYearForCalendar("chinese");
    const actual = Array.from(
      { length: 12 },
      (_, i) => getMonthInfo("chinese", year, i + 1)?.daysCount
    );
    expect(actual).toEqual(lengths);
  });

  it.fails("bahai year accounts for the intercalary Ayyam-i-Ha days", () => {
    // 19 months x 19 days is 361; the year needs 4 or 5 intercalary days.
    const year = getDefaultYearForCalendar("bahai");
    expect(yearLength("bahai", year)).toBeGreaterThan(361);
  });
});
