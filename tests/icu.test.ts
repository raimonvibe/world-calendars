import { describe, it, expect } from "vitest";
import { getIcuYear, getIcuPosition, readIcuDate, getIcuMonthCount } from "@/lib/icu";
import { day, dateSweep } from "./helpers";

const total = (calendar: string, year: number) =>
  (getIcuYear(calendar, year)?.months ?? []).reduce((sum, m) => sum + m.daysCount, 0);

describe("icu engine", () => {
  it("islamic years are 354 or 355 days with varying month lengths", () => {
    for (let year = 1440; year <= 1460; year++) {
      expect([354, 355], `AH ${year}`).toContain(total("islamic-umalqura", year));
      const lengths = new Set(getIcuYear("islamic-umalqura", year)!.months.map((m) => m.daysCount));
      expect(lengths.size, `AH ${year} month lengths`).toBeGreaterThan(1);
      expect([...lengths].every((n) => n === 29 || n === 30)).toBe(true);
    }
  });

  it("coptic and ethiopic years are 12 months of 30 plus a short 13th", () => {
    for (const calendar of ["coptic", "ethiopic"]) {
      for (let year = 1740; year <= 1745; year++) {
        const months = getIcuYear(calendar, year)!.months;
        expect(months.length, `${calendar} ${year}`).toBe(13);
        expect(months.slice(0, 12).every((m) => m.daysCount === 30)).toBe(true);
        expect([5, 6]).toContain(months[12].daysCount);
        expect([365, 366]).toContain(total(calendar, year));
      }
    }
  });

  it("chinese leap years have 13 months", () => {
    // 2025 contains a leap sixth month; 2026 does not.
    expect(getIcuYear("chinese", 2025)!.months.length).toBe(13);
    expect(getIcuYear("chinese", 2026)!.months.length).toBe(12);
    expect(getIcuYear("chinese", 2025)!.months.some((m) => m.token.includes("bis"))).toBe(true);
    expect([383, 384, 385]).toContain(total("chinese", 2025));
    expect([353, 354, 355]).toContain(total("chinese", 2026));
  });

  it("month count accounts for leap months across the window", () => {
    expect(getIcuMonthCount("chinese", 2026)).toBe(13);
    expect(getIcuMonthCount("islamic-umalqura", 1447)).toBe(12);
    expect(getIcuMonthCount("coptic", 1742)).toBe(13);
  });

  it("months are contiguous: each starts the day after the previous ends", () => {
    const months = getIcuYear("islamic-umalqura", 1447)!.months;
    for (let i = 1; i < months.length; i++) {
      const previousEnd = new Date(months[i - 1].firstGregorian);
      previousEnd.setDate(previousEnd.getDate() + months[i - 1].daysCount);
      expect(previousEnd.toDateString(), `month ${i + 1}`).toBe(
        months[i].firstGregorian.toDateString()
      );
    }
  });

  it("first weekday matches the actual Gregorian weekday of day 1", () => {
    for (const calendar of ["islamic-umalqura", "coptic", "chinese"]) {
      for (const month of getIcuYear(calendar, calendar === "chinese" ? 2026 : 1447)?.months ?? []) {
        expect(month.firstWeekday).toBe((month.firstGregorian.getDay() + 6) % 7);
        expect(readIcuDate(calendar, month.firstGregorian).day).toBe(1);
      }
    }
  });

  it("position round-trips against a date sweep", () => {
    for (const calendar of ["islamic-umalqura", "coptic", "ethiopic", "chinese", "indian"]) {
      for (const date of dateSweep(2024, 2028, 17)) {
        const position = getIcuPosition(calendar, date);
        expect(position, `${calendar} ${date.toDateString()}`).not.toBeNull();

        const parts = readIcuDate(calendar, date);
        expect(position!.day).toBe(parts.day);
        expect(position!.year).toBe(parts.year);

        const month = getIcuYear(calendar, position!.year)!.months[position!.monthIndex - 1];
        expect(month.token).toBe(parts.monthToken);
      }
    }
  });

  it("returns null outside the searchable range rather than throwing", () => {
    expect(getIcuYear("islamic-umalqura", 99999)).toBeNull();
    expect(getIcuYear("coptic", -5)).toBeNull();
  });

  it("names months in English", () => {
    const months = getIcuYear("islamic-umalqura", 1447)!.months;
    expect(months[0].nameEn).toBe("Muharram");
    expect(months[8].nameEn).toBe("Ramadan");
    expect(getIcuYear("coptic", 1742)!.months[0].nameEn).toBe("Tout");
    expect(getIcuYear("ethiopic", 2018)!.months[0].nameEn).toBe("Meskerem");
  });

  it("today resolves consistently for every ICU calendar", () => {
    for (const calendar of ["islamic-umalqura", "coptic", "ethiopic", "chinese", "dangi", "indian"]) {
      const position = getIcuPosition(calendar, day(2026, 8, 10));
      expect(position, calendar).not.toBeNull();
      expect(position!.monthIndex).toBeGreaterThanOrEqual(1);
    }
  });
});
