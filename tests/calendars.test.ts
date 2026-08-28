import { describe, it, expect } from "vitest";
import { getCalendarInfo, CALENDAR_IDS } from "@/lib/calendars";
import { ICU_CALENDAR, icuParts, day, dateSweep } from "./helpers";

/**
 * The app renders dates as display strings, so these extractors pull the
 * semantic values back out. They are deliberately strict: a format change
 * should fail loudly rather than silently skip the assertion.
 */
type Extracted = { year: number; day: number };

const EXTRACT: Record<string, (s: string) => Extracted> = {
  // "August 10, 2026"
  gregorian: (s) => {
    const m = /^\w+ (\d+), (\d+)$/.exec(s);
    if (!m) throw new Error(`unparseable gregorian: ${s}`);
    return { day: +m[1], year: +m[2] };
  },
  // "27th of Av, 5786"
  hebrew: (s) => {
    const m = /^(\d+)\w* of .+, (\d+)$/.exec(s);
    if (!m) throw new Error(`unparseable hebrew: ${s}`);
    return { day: +m[1], year: +m[2] };
  },
  // "1405/5/19"
  persian: (s) => {
    const m = /^(\d+)\/(\d+)\/(\d+)$/.exec(s);
    if (!m) throw new Error(`unparseable persian: ${s}`);
    return { year: +m[1], day: +m[3] };
  },
  // "August 10, 2569 BE"
  buddhist: (s) => {
    const m = /^\w+ (\d+), (\d+) BE$/.exec(s);
    if (!m) throw new Error(`unparseable buddhist: ${s}`);
    return { day: +m[1], year: +m[2] };
  },
};
EXTRACT["thai-solar"] = EXTRACT.buddhist;

/** Calendars whose display output is already correct. Locked in as regression guards. */
const CORRECT = ["gregorian", "hebrew", "persian", "buddhist", "thai-solar"] as const;

describe("calendars that are already correct", () => {
  for (const id of CORRECT) {
    it(`${id} matches ICU across a 20-year sweep`, () => {
      const icu = ICU_CALENDAR[id];
      const dates = dateSweep(2015, 2035);
      expect(dates.length).toBeGreaterThan(600);

      for (const date of dates) {
        const actual = EXTRACT[id](getCalendarInfo(id, date).dateString);

        if (id === "gregorian") {
          expect(actual, date.toDateString()).toEqual({
            year: date.getFullYear(),
            day: date.getDate(),
          });
          continue;
        }

        const expected = icuParts(icu!, date);
        expect(actual.day, `${id} day on ${date.toDateString()}`).toBe(expected.day);
        expect(actual.year, `${id} year on ${date.toDateString()}`).toBe(expected.year);
      }
    });
  }

  it("hebrew renders the Hebrew-script form too", () => {
    const info = getCalendarInfo("hebrew", day(2026, 8, 10));
    expect(info.dateOriginal).toBeTruthy();
    expect(info.dateOriginal).toMatch(/[֐-׿]/);
  });
});

/**
 * Calendars moved onto ICU in phase 2, and the six computed from their own
 * rules in phase 3. All of these were `it.fails` while the hand-rolled
 * arithmetic was in place; they now assert the fixed behaviour.
 */
describe("calendars fixed in phases 2 and 3", () => {
  const anchors = [day(2026, 8, 10), day(2026, 1, 15), day(2026, 9, 15), day(2026, 4, 5)];

  it("islamic returns a real Hijri year, not 0", () => {
    for (const date of anchors) {
      const expected = icuParts("islamic-umalqura", date);
      const actual = getCalendarInfo("islamic", date).dateString;
      expect(actual).toContain(String(expected.year));
    }
  });

  it("coptic day-of-month matches ICU", () => {
    for (const date of anchors) {
      const expected = icuParts("coptic", date);
      const actual = getCalendarInfo("coptic", date).dateString;
      expect(actual, date.toDateString()).toMatch(new RegExp(`\\b${expected.day}\\b`));
    }
  });

  it("ethiopian day-of-month matches ICU", () => {
    for (const date of anchors) {
      const expected = icuParts("ethiopic", date);
      const actual = getCalendarInfo("ethiopian", date).dateString;
      expect(actual, date.toDateString()).toMatch(new RegExp(`\\b${expected.day}\\b`));
    }
  });

  it("japanese era changes on the correct day, not 1 January", () => {
    // Reiwa began 1 May 2019; 30 April 2019 was still Heisei 31.
    expect(getCalendarInfo("japanese", day(2019, 4, 30)).dateString).toContain("Heisei");
  });

  it("japanese handles dates before the Shōwa era", () => {
    // 1 June 1920 was Taishō 9. The app extrapolates a negative Shōwa year.
    expect(getCalendarInfo("japanese", day(1920, 6, 1)).dateString).not.toMatch(/-\d/);
  });

  it("korean is distinct from chinese", () => {
    const date = day(2026, 8, 10);
    expect(getCalendarInfo("korean", date).dateString).not.toBe(
      getCalendarInfo("chinese", date).dateString
    );
  });

  it("mayan long count is correct at the 13.0.0.0.0 anchor", () => {
    // 21 December 2012 is 13.0.0.0.0 under the GMT (584283) correlation.
    expect(getCalendarInfo("mayan", day(2012, 12, 21)).dateString).toContain("13.0.0.0.0");
  });

  it("bahai shows a Badi' year, not the Gregorian year", () => {
    expect(getCalendarInfo("bahai", day(2026, 8, 10)).dateString).not.toContain("2026");
  });

  it("javanese is not just a Gregorian date", () => {
    expect(getCalendarInfo("javanese", day(2026, 8, 10)).dateString).not.toContain("2026");
  });

  it("hindu new year does not fall on 1 January", () => {
    // A Gregorian +57 offset makes the year roll over on 1 January, which no
    // Indian calendar does.
    const dec = getCalendarInfo("hindu", day(2025, 12, 31)).dateString;
    const jan = getCalendarInfo("hindu", day(2026, 1, 1)).dateString;
    expect(dec.match(/\d{4}/)?.[0]).toBe(jan.match(/\d{4}/)?.[0]);
  });
});

describe("internal consistency", () => {
  it("armenian year agrees between the date string and the year navigation", async () => {
    const { getDefaultYearForCalendar } = await import("@/lib/calendarViews");
    const dateString = getCalendarInfo("armenian", day(2026, 8, 10)).dateString;
    const navYear = getDefaultYearForCalendar("armenian");
    expect(dateString).toContain(String(navYear));
  });

  it("every calendar id produces a non-empty date string", () => {
    for (const id of CALENDAR_IDS) {
      const info = getCalendarInfo(id, day(2026, 8, 10));
      expect(info.dateString, id).toBeTruthy();
      expect(info.dateString, id).not.toBe("—");
    }
  });

  /**
   * A formatting-level guard rather than a calendar-level one. Requesting an
   * era from ICU silently changed the Chinese month token from "6" to "Mo6",
   * which parsed to NaN and rendered as "2026/NaN/28" while every
   * calendar-level test still passed.
   */
  it("no calendar renders NaN, undefined or null on any day of the year", () => {
    for (const date of dateSweep(2025, 2027, 5)) {
      for (const id of CALENDAR_IDS) {
        const info = getCalendarInfo(id, date);
        for (const text of [info.dateString, info.dateOriginal ?? "", ...info.facts]) {
          expect(text, `${id} on ${date.toDateString()}: ${text}`).not.toMatch(
            /NaN|undefined|null/
          );
        }
      }
    }
  });
});
