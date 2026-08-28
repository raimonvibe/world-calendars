/**
 * Step 3 of the audit: the year and month *views*, not just the date strings on
 * the home page. A calendar can render the right date today and still lay out
 * its month grids wrongly, because the grids come from a different code path.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getPersianYearStructure,
  getHebrewYearStructure,
  getMonthInfo,
  getTodayDayInMonth,
  getDefaultYearForCalendar,
  MONTH_RANGES,
} from "@/lib/calendarViews";
import { CALENDAR_IDS } from "@/lib/calendars";
import * as R from "./reference";
import { persianAstronomicalFromRd, nowruz } from "./astronomy";

afterEach(() => vi.useRealTimers());

describe("persian year structure", () => {
  it("gives the Solar Hijri month lengths: six of 31, five of 30, then 29 or 30", () => {
    const structure = getPersianYearStructure(1405);
    const lengths = structure.map((m) => m.daysCount);
    console.log("  persian 1405 month lengths:", lengths.join(", "));
    expect(lengths.slice(0, 6), "first six months are 31 days").toEqual([31, 31, 31, 31, 31, 31]);
    expect(lengths.slice(6, 11), "months 7-11 are 30 days").toEqual([30, 30, 30, 30, 30]);
    expect([29, 30], "Esfand is 29 or 30 days").toContain(lengths[11]);
  });

  it("starts Farvardin on the weekday Nowruz actually falls on", () => {
    const nowruzRd = nowruz(2026).rd;
    const g = R.gregorianFromRd(nowruzRd);
    const expectedWeekday = (new Date(g.year, g.month - 1, g.day, 12).getDay() + 6) % 7;
    const structure = getPersianYearStructure(1405);
    console.log(
      `  Nowruz 1405 is ${g.day}/${g.month}/${g.year}, weekday index ${expectedWeekday};` +
        ` view says ${structure[0]?.firstWeekday}`
    );
    expect(structure[0]?.firstWeekday).toBe(expectedWeekday);
  });

  it("gives every month a plausible length", () => {
    for (let y = 1400; y <= 1410; y++) {
      const total = getPersianYearStructure(y).reduce((a, m) => a + m.daysCount, 0);
      expect([365, 366], `persian ${y} total days`).toContain(total);
    }
  });
});

describe("hebrew year structure", () => {
  it("matches independent Hebrew month lengths and totals", () => {
    for (const y of [5784, 5785, 5786, 5787]) {
      const structure = getHebrewYearStructure(y);
      const total = structure.reduce((a, m) => a + m.daysCount, 0);
      const expected = R.hebrewNewYear(y + 1) - R.hebrewNewYear(y);
      expect(total, `hebrew ${y} total days`).toBe(expected);
      expect(structure.length, `hebrew ${y} month count`).toBe(R.hebrewLeapYear(y) ? 13 : 12);
    }
  });
});

describe("month ranges", () => {
  it("covers every calendar the app lists", () => {
    const missing = CALENDAR_IDS.filter((id) => MONTH_RANGES[id] == null);
    expect(missing, "calendars with no MONTH_RANGES entry render no month pages").toEqual([]);
  });

  it("gives the traditional Armenian year its 13th (epagomenal) division", () => {
    // 12 months of 30 days plus the 5 Aveleats days, which have to live somewhere.
    expect(MONTH_RANGES.armenian).toBe(13);
  });
});

describe("getMonthInfo produces real month lengths", () => {
  it("armenian months are 30 days, not Gregorian lengths", () => {
    const lengths = [];
    for (let m = 1; m <= 12; m++) lengths.push(getMonthInfo("armenian", 1475, m)?.daysCount);
    console.log("  armenian month lengths:", lengths.join(", "));
    expect(lengths).toEqual(Array(12).fill(30));
  });

  it("sikh months follow Nanakshahi lengths (five of 31, then 30)", () => {
    const lengths = [];
    for (let m = 1; m <= 12; m++) lengths.push(getMonthInfo("sikh", 558, m)?.daysCount);
    console.log("  sikh month lengths:", lengths.join(", "));
    expect(lengths.slice(0, 5)).toEqual([31, 31, 31, 31, 31]);
  });

  it("bahai months are 19 days and the year accounts for Ayyam-i-Ha", () => {
    const total = [];
    for (let m = 1; m <= MONTH_RANGES.bahai; m++) total.push(getMonthInfo("bahai", 183, m)?.daysCount ?? 0);
    const sum = total.reduce((a, b) => a + b, 0);
    console.log(`  bahai year totals ${sum} days across ${total.length} months`);
    expect(sum, "19x19 is 361 days; the missing 4-5 are Ayyam-i-Ha").toBeGreaterThanOrEqual(365);
  });

  it("bahai months do not all claim to start on the same weekday", () => {
    const weekdays = new Set<number>();
    for (let m = 1; m <= 19; m++) weekdays.add(getMonthInfo("bahai", 183, m)?.firstWeekday ?? -1);
    console.log("  distinct bahai first-weekdays:", [...weekdays].join(", "));
    expect(weekdays.size).toBeGreaterThan(1);
  });
});

describe("getTodayDayInMonth highlights the right cell", () => {
  const today = new Date();
  const rd = R.rdFromGregorian(today.getFullYear(), today.getMonth() + 1, today.getDate());

  it("hindu: highlights today in the Saka month it actually falls in", () => {
    const want = R.sakaFromRd(rd);
    expect(
      getTodayDayInMonth("hindu", want.year, want.month),
      `today is Saka ${want.year}-${want.month}-${want.day}`
    ).toBe(want.day);
  });

  it("coptic: highlights today in the Coptic month it actually falls in", () => {
    const want = R.coptic.fromRd(rd);
    expect(
      getTodayDayInMonth("coptic", want.year, want.month),
      `today is Coptic ${want.year}-${want.month}-${want.day}`
    ).toBe(want.day);
  });

  it("coptic: does not highlight a day in the wrong month", () => {
    const want = R.coptic.fromRd(rd);
    const wrongMonth = (want.month % 12) + 1;
    expect(getTodayDayInMonth("coptic", want.year, wrongMonth)).toBeNull();
  });

  it("persian: highlights today in the Persian month it actually falls in", () => {
    const want = persianAstronomicalFromRd(rd);
    expect(getTodayDayInMonth("persian", want.year, want.month)).toBe(want.day);
  });
});

describe("getDefaultYearForCalendar across the whole Gregorian year", () => {
  // Several offsets are right only between a calendar's new year and 31 December,
  // so checking on today's date alone hides half the bugs.
  const probes = ["2026-02-01", "2026-05-15", "2026-08-28", "2026-11-20"];

  for (const iso of probes) {
    describe(iso, () => {
      const rd = R.rdFromGregorian(+iso.slice(0, 4), +iso.slice(5, 7), +iso.slice(8, 10));
      const expected: Record<string, number> = {
        persian: persianAstronomicalFromRd(rd).year,
        assyrian: R.assyrianFromRd(rd).year,
        sikh: R.nanakshahiFromRd(rd).year,
        armenian: R.armenianFromRd(rd).year,
        hindu: R.sakaFromRd(rd).year,
      };
      for (const [id, want] of Object.entries(expected)) {
        it(id, () => {
          vi.useFakeTimers();
          vi.setSystemTime(new Date(`${iso}T12:00:00`));
          expect(getDefaultYearForCalendar(id)).toBe(want);
        });
      }
    });
  }
});

describe("ICU-backed year structures total the right number of days", () => {
  const cases: [string, (y: number) => number, number][] = [
    ["coptic", (y) => R.coptic.toRd(y + 1, 1, 1) - R.coptic.toRd(y, 1, 1), 1742],
    ["ethiopian", (y) => R.ethiopic.toRd(y + 1, 1, 1) - R.ethiopic.toRd(y, 1, 1), 2018],
    ["hindu", (y) => (R.gregorianLeap(y + 78) ? 366 : 365), 1948],
  ];

  for (const [id, expectedDays, year] of cases) {
    it(id, async () => {
      const { getIcuYear, ICU_CALENDARS } = await import("@/lib/icu");
      const key = id === "hindu" ? ICU_CALENDARS.hindu : id === "coptic" ? ICU_CALENDARS.coptic : ICU_CALENDARS.ethiopian;
      const months = getIcuYear(key, year)?.months ?? [];
      const total = months.reduce((a, m) => a + m.daysCount, 0);
      expect(total, `${id} ${year}`).toBe(expectedDays(year));
    });
  }

  it("islamic year is 354 or 355 days", async () => {
    const { getIcuYear, ICU_CALENDARS } = await import("@/lib/icu");
    for (let y = 1445; y <= 1455; y++) {
      const months = getIcuYear(ICU_CALENDARS.islamic, y)?.months ?? [];
      const total = months.reduce((a, m) => a + m.daysCount, 0);
      expect(months.length, `hijri ${y} months`).toBe(12);
      expect([354, 355], `hijri ${y} days`).toContain(total);
    }
  });

  it("chinese year is 353-355 or 383-385 days", async () => {
    const { getIcuYear, ICU_CALENDARS } = await import("@/lib/icu");
    for (let y = 2020; y <= 2030; y++) {
      const months = getIcuYear(ICU_CALENDARS.chinese, y)?.months ?? [];
      const total = months.reduce((a, m) => a + m.daysCount, 0);
      expect([353, 354, 355, 383, 384, 385], `chinese ${y}`).toContain(total);
    }
  });
});
