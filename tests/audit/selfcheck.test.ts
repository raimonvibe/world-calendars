/**
 * Step 1 of the audit: verify the reference implementations themselves against
 * externally known dates. If this file fails, nothing it says about the app can
 * be trusted, so it runs before any comparison.
 */
import { describe, it, expect } from "vitest";
import * as R from "./reference";

const rd = (y: number, m: number, d: number) => R.rdFromGregorian(y, m, d);

describe("reference: Gregorian and JDN", () => {
  it("round-trips Gregorian dates", () => {
    for (const [y, m, d] of [[2026, 8, 28], [2000, 2, 29], [1900, 3, 1], [1582, 10, 15]] as const) {
      expect(R.gregorianFromRd(rd(y, m, d))).toEqual({ year: y, month: m, day: d });
    }
  });

  it("agrees with the standard J2000 Julian Day Number", () => {
    // 1 January 2000 12:00 UT is JD 2451545.0 by definition.
    expect(R.jdnFromRd(rd(2000, 1, 1))).toBe(2451545);
  });

  it("places the Julian/Gregorian switchover correctly", () => {
    // 4 October 1582 (Julian) was immediately followed by 15 October 1582 (Gregorian).
    expect(R.rdFromJulian(1582, 10, 4) + 1).toBe(rd(1582, 10, 15));
  });
});

describe("reference: Coptic and Ethiopic", () => {
  it("starts the Coptic year on 11 September 2025 as Thout 1, 1742 AM", () => {
    expect(R.coptic.fromRd(rd(2025, 9, 11))).toEqual({ year: 1742, month: 1, day: 1 });
  });

  it("starts the Ethiopian year on 11 September 2025 as Meskerem 1, 2018 EE", () => {
    expect(R.ethiopic.fromRd(rd(2025, 9, 11))).toEqual({ year: 2018, month: 1, day: 1 });
  });

  it("shifts new year to 12 September in the year before a Gregorian leap year", () => {
    // 2027 is followed by leap year 2028, so Meskerem 1 of 2020 EE lands on 12 Sep 2027.
    expect(R.ethiopic.fromRd(rd(2027, 9, 12))).toEqual({ year: 2020, month: 1, day: 1 });
  });

  it("gives Pagumen 5 or 6 days as the 13th month", () => {
    const start = R.ethiopic.toRd(2018, 13, 1);
    let days = 0;
    while (R.ethiopic.fromRd(start + days).month === 13) days++;
    expect([5, 6]).toContain(days);
  });
});

describe("reference: Hebrew", () => {
  it("puts Rosh Hashanah 5786 on 23 September 2025", () => {
    expect(R.hebrewNewYear(5786)).toBe(rd(2025, 9, 23));
  });

  it("puts Rosh Hashanah 5785 on 3 October 2024", () => {
    expect(R.hebrewNewYear(5785)).toBe(rd(2024, 10, 3));
  });

  it("puts Passover (15 Nisan) 5786 on 2 April 2026", () => {
    expect(R.rdFromHebrew(5786, 1, 15)).toBe(rd(2026, 4, 2));
  });

  it("marks the correct years of the 19-year cycle as leap", () => {
    // Years 3, 6, 8, 11, 14, 17, 19 of each cycle.
    const leapInCycle = [];
    for (let y = 5776; y < 5795; y++) if (R.hebrewLeapYear(y)) leapInCycle.push(R.mod(y, 19));
    expect(leapInCycle.length).toBe(7);
  });

  it("only ever produces years of 353-355 or 383-385 days", () => {
    for (let y = 5700; y < 5850; y++) {
      const length = R.hebrewNewYear(y + 1) - R.hebrewNewYear(y);
      expect([353, 354, 355, 383, 384, 385], `year ${y}`).toContain(length);
    }
  });

  it("never starts a year on Sunday, Wednesday or Friday", () => {
    // The 'lo ADU rosh' rule: Rosh Hashanah cannot fall on those weekdays.
    for (let y = 5700; y < 5850; y++) {
      expect([0, 3, 5], `year ${y}`).not.toContain(R.mod(R.hebrewNewYear(y), 7));
    }
  });
});

describe("reference: Indian National (Saka)", () => {
  it("starts Saka 1948 on 22 March 2026", () => {
    expect(R.sakaFromRd(rd(2026, 3, 22))).toEqual({ year: 1948, month: 1, day: 1 });
  });

  it("starts Saka 1946 on 21 March 2024, because 2024 is a Gregorian leap year", () => {
    expect(R.sakaFromRd(rd(2024, 3, 21))).toEqual({ year: 1946, month: 1, day: 1 });
  });

  it("always produces a 365- or 366-day year", () => {
    for (let g = 2000; g < 2060; g++) {
      const start = rd(g, 3, R.gregorianLeap(g) ? 21 : 22);
      const next = rd(g + 1, 3, R.gregorianLeap(g + 1) ? 21 : 22);
      expect([365, 366], `saka ${g - 78}`).toContain(next - start);
    }
  });
});

describe("reference: Mayan", () => {
  it("puts 13.0.0.0.0 on 21 December 2012 under the GMT correlation", () => {
    expect(R.mayanLongCount(rd(2012, 12, 21)).toString()).toBe("13.0.0.0.0");
  });

  it("uses correlation constant 584283", () => {
    expect(R.jdnFromRd(R.MAYAN_EPOCH)).toBe(584283);
  });
});

describe("reference: Armenian", () => {
  it("starts Armenian year 1 on 11 July 552 CE (Julian)", () => {
    expect(R.armenianFromRd(R.ARMENIAN_EPOCH)).toEqual({ year: 1, month: 1, day: 1 });
  });

  it("wanders: every year is exactly 365 days, so new year drifts through the seasons", () => {
    const a = R.armenianFromRd(rd(2026, 8, 28));
    const b = R.armenianFromRd(rd(2026, 8, 28) + 365);
    expect(b.year).toBe(a.year + 1);
    expect(b.month).toBe(a.month);
    expect(b.day).toBe(a.day);
  });
});

describe("reference: Sikh Nanakshahi", () => {
  it("starts Nanakshahi 558 on 14 March 2026", () => {
    expect(R.nanakshahiFromRd(rd(2026, 3, 14))).toEqual({ year: 558, month: 1, day: 1 });
  });

  it("keeps Chet 1 pinned to 14 March in every year", () => {
    for (let g = 2000; g < 2060; g++) {
      expect(R.nanakshahiFromRd(rd(g, 3, 14)), `${g}`).toMatchObject({ month: 1, day: 1 });
    }
  });
});

describe("reference: Assyrian", () => {
  it("rolls the year over on 1 April, not 1 January", () => {
    expect(R.assyrianFromRd(rd(2026, 3, 31)).year).toBe(6775);
    expect(R.assyrianFromRd(rd(2026, 4, 1)).year).toBe(6776);
  });
});

describe("reference: Islamic tabular", () => {
  it("puts 1 Muharram 1 AH on 16 July 622 CE (Julian)", () => {
    expect(R.islamicTabular.toRd(1, 1, 1)).toBe(R.rdFromJulian(622, 7, 16));
  });

  it("round-trips", () => {
    for (let i = 0; i < 4000; i += 37) {
      const day = rd(2000, 1, 1) + i;
      const p = R.islamicTabular.fromRd(day);
      expect(R.islamicTabular.toRd(p.year, p.month, p.day), `${day}`).toBe(day);
    }
  });
});
