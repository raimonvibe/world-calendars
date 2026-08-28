/**
 * Step 6 of the audit: holidays land on the right real-world day.
 *
 * The holiday definitions were always written in each calendar's own month and
 * day numbering, so while those calendars rendered Gregorian months the
 * definitions pointed at the wrong days. Vaisakhi sat on 2 February because
 * Sikh "month 2" was February rather than Vaisakh. This checks the whole chain
 * - Gregorian date to calendar date to holiday - against dates that are fixed
 * in the real world.
 */
import { describe, it, expect } from "vitest";
import { getHolidaysForDay } from "@/lib/holidays";
import { getCalendarInfo } from "@/lib/calendars";
import type { CalendarId } from "@/lib/types";
import {
  nanakshahiFromRd,
  assyrianFromRd,
  javaneseFromRd,
  bahaiFromRd,
  armenianFromRd,
} from "@/lib/traditionalCalendars";
import { rdFromGregorian } from "@/lib/calendarMath";

const CONVERTERS: Record<string, (rd: number) => { year: number; month: number; day: number }> = {
  sikh: nanakshahiFromRd,
  assyrian: assyrianFromRd,
  javanese: javaneseFromRd,
  bahai: bahaiFromRd,
  armenian: armenianFromRd,
};

function holidaysOn(calendarId: string, y: number, m: number, d: number) {
  const { year, month, day } = CONVERTERS[calendarId](rdFromGregorian(y, m, d));
  return getHolidaysForDay(calendarId as CalendarId, year, month, day).map((h) => h.nameEn);
}

describe("holidays fixed to a real-world date", () => {
  it("Vaisakhi falls on 14 April", () => {
    expect(holidaysOn("sikh", 2026, 4, 14)).toContain("Vaisakhi");
    expect(holidaysOn("sikh", 2027, 4, 14)).toContain("Vaisakhi");
  });

  it("Vaisakhi does not fall in February", () => {
    // It did, while Sikh "month 2" meant February rather than Vaisakh.
    expect(holidaysOn("sikh", 2026, 2, 1)).not.toContain("Vaisakhi");
  });

  it("Kha b-Nisan and Akitu fall on 1 April", () => {
    const names = holidaysOn("assyrian", 2026, 4, 1);
    expect(names).toContain("Kha b-Nisan");
    expect(names).toContain("Akitu (Assyrian New Year)");
  });

  it("Kha b-Nisan does not fall on 1 January", () => {
    expect(holidaysOn("assyrian", 2026, 1, 1)).not.toContain("Kha b-Nisan");
  });

  it("Assumption of Mary falls on 15 August", () => {
    expect(holidaysOn("assyrian", 2026, 8, 15)).toContain("Assumption of Mary");
  });
});

describe("holidays fixed to their own calendar", () => {
  it("1 Suro falls on 1 Sura, the Javanese new year", () => {
    const names = holidaysOn("javanese", 2026, 6, 16);
    const isNewYear = javaneseFromRd(rdFromGregorian(2026, 6, 16));
    // Whatever Gregorian day it lands on, the holiday must sit on Sura 1.
    if (isNewYear.month === 1 && isNewYear.day === 1) {
      expect(names).toContain("1 Suro (Javanese New Year)");
    }
    // And Sura 1 of the current Javanese year must carry it.
    const today = javaneseFromRd(rdFromGregorian(2026, 8, 28));
    expect(
      getHolidaysForDay("javanese", today.year, 1, 1).map((h) => h.nameEn)
    ).toContain("1 Suro (Javanese New Year)");
  });

  it("Naw-Ruz falls on 1 Baha, and the app agrees", () => {
    const bahai = bahaiFromRd(rdFromGregorian(2026, 3, 21));
    expect({ month: bahai.month, day: bahai.day }).toEqual({ month: 1, day: 1 });
    expect(getHolidaysForDay("bahai", bahai.year, 1, 1).map((h) => h.nameEn)).toContain("Naw-Rúz");
    expect(getCalendarInfo("bahai", new Date(2026, 2, 21, 12)).dateString).toContain("Bahá 1");
  });

  it("gives a Feast to all nineteen months but not to Ayyam-i-Ha", () => {
    const feasts: string[] = [];
    for (let m = 1; m <= 20; m++) {
      feasts.push(...getHolidaysForDay("bahai", 183, m, 1).map((h) => h.nameEn).filter((n) => n.startsWith("Feast")));
    }
    expect(feasts.length, "nineteen Feasts, none on Ayyam-i-Ha").toBe(19);
    expect(getHolidaysForDay("bahai", 183, 19, 1).map((h) => h.nameEn)).toEqual([]);
  });

  it("Navasard falls on 1 Nawasardi, which wanders through the Gregorian year", () => {
    const year = armenianFromRd(rdFromGregorian(2026, 8, 28)).year;
    expect(getHolidaysForDay("armenian", year, 1, 1).map((h) => h.nameEn)).toContain("Navasard");
    // The wandering year means Nawasardi 1 is 365 days later next year, not a
    // fixed Gregorian date - which is exactly why it cannot be a Gregorian month.
    const thisYear = rdFromGregorian(2026, 8, 28);
    const a = armenianFromRd(thisYear);
    const b = armenianFromRd(thisYear + 365);
    expect(b.year).toBe(a.year + 1);
    expect({ month: b.month, day: b.day }).toEqual({ month: a.month, day: a.day });
  });
});
