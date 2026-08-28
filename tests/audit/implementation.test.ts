/**
 * Step 4 of the audit: the Phase 3 implementations, checked against the same
 * independent references that condemned the code they replace.
 */
import { describe, it, expect } from "vitest";
import * as T from "@/lib/traditionalCalendars";
import { nowruzRd, nawRuzRd, equinoxMarginHours } from "@/lib/astronomy";
import { rdFromGregorian, gregorianFromRd, weekdayFromRd } from "@/lib/calendarMath";
import * as R from "./reference";
import { nowruz } from "./astronomy";

const rd = (y: number, m: number, d: number) => rdFromGregorian(y, m, d);
const fmt = (r: number) => {
  const g = gregorianFromRd(r);
  return `${g.year}-${String(g.month).padStart(2, "0")}-${String(g.day).padStart(2, "0")}`;
};

const SPAN = { from: rd(2020, 1, 1), to: rd(2030, 12, 31) };

const eachDay = (f: (r: number) => string | null) => {
  const bad: string[] = [];
  for (let r = SPAN.from; r <= SPAN.to; r++) {
    const problem = f(r);
    if (problem) bad.push(`${fmt(r)}: ${problem}`);
  }
  return bad.slice(0, 5);
};

describe("lib/calendarMath agrees with the reference on day numbering", () => {
  it("matches RD for every day of the span", () => {
    expect(
      eachDay((r) => {
        const g = gregorianFromRd(r);
        return R.rdFromGregorian(g.year, g.month, g.day) === r ? null : "RD mismatch";
      })
    ).toEqual([]);
  });

  it("numbers weekdays with Monday = 0", () => {
    // 28 August 2026 is a Friday, index 4.
    expect(weekdayFromRd(rd(2026, 8, 28))).toBe(4);
  });
});

describe("mayan", () => {
  it("matches the reference Long Count every day", () => {
    expect(
      eachDay((r) => {
        const got = T.formatLongCount(T.mayanLongCountFromRd(r));
        const want = R.mayanLongCount(r).toString();
        return got === want ? null : `${got} vs ${want}`;
      })
    ).toEqual([]);
  });

  it("puts 13.0.0.0.0 on 21 December 2012", () => {
    expect(T.formatLongCount(T.mayanLongCountFromRd(rd(2012, 12, 21)))).toBe("13.0.0.0.0");
  });

  it("gives the epoch the Calendar Round 4 Ajaw 8 Kumku", () => {
    const tz = T.tzolkinFromRd(T.MAYAN_EPOCH_RD);
    const hb = T.haabFromRd(T.MAYAN_EPOCH_RD);
    expect(`${tz.number} ${tz.name}`).toBe("4 Ajaw");
    expect(`${hb.day} ${hb.month.normalize("NFD").replace(/[^\x20-\x7e]/g, "")}`).toBe("8 Kumku");
  });

  it("gives 21 December 2012 the Calendar Round 4 Ajaw 3 Kankin", () => {
    const tz = T.tzolkinFromRd(rd(2012, 12, 21));
    const hb = T.haabFromRd(rd(2012, 12, 21));
    const ascii = (s: string) => s.replace(/[^\x20-\x7e]/g, "");
    expect(`${tz.number} ${ascii(tz.name)} ${hb.day} ${ascii(hb.month)}`).toBe("4 Ajaw 3 Kankin");
  });

  it("cycles Tzolkin every 260 days and Haab every 365", () => {
    const base = rd(2026, 8, 28);
    expect(T.tzolkinFromRd(base + 260)).toEqual(T.tzolkinFromRd(base));
    expect(T.haabFromRd(base + 365)).toEqual(T.haabFromRd(base));
  });
});

describe("armenian", () => {
  it("matches the reference every day", () => {
    expect(
      eachDay((r) => {
        const a = T.armenianFromRd(r);
        const b = R.armenianFromRd(r);
        return a.year === b.year && a.month === b.month && a.day === b.day
          ? null
          : `${a.year}-${a.month}-${a.day} vs ${b.year}-${b.month}-${b.day}`;
      })
    ).toEqual([]);
  });

  it("round-trips", () => {
    expect(
      eachDay((r) => {
        const a = T.armenianFromRd(r);
        return T.rdFromArmenian(a.year, a.month, a.day) === r ? null : "round-trip failed";
      })
    ).toEqual([]);
  });

  it("gives the year 12 months of 30 days plus 5 epagomenal days", () => {
    let total = 0;
    for (let m = 1; m <= 13; m++) total += T.armenianMonthLength(m);
    expect(total).toBe(365);
  });
});

describe("sikh nanakshahi", () => {
  it("matches the reference every day", () => {
    expect(
      eachDay((r) => {
        const a = T.nanakshahiFromRd(r);
        const b = R.nanakshahiFromRd(r);
        return a.year === b.year && a.month === b.month && a.day === b.day
          ? null
          : `${a.year}-${a.month}-${a.day} vs ${b.year}-${b.month}-${b.day}`;
      })
    ).toEqual([]);
  });

  it("round-trips", () => {
    expect(
      eachDay((r) => {
        const a = T.nanakshahiFromRd(r);
        return T.rdFromNanakshahi(a.year, a.month, a.day) === r ? null : "round-trip failed";
      })
    ).toEqual([]);
  });

  it("starts Chet 1 on 14 March every year", () => {
    for (let g = 2000; g <= 2060; g++) {
      const a = T.nanakshahiFromRd(rd(g, 3, 14));
      expect({ month: a.month, day: a.day }, `${g}`).toEqual({ month: 1, day: 1 });
      expect(a.year, `${g}`).toBe(g - 1468);
    }
  });

  it("totals 365 or 366 days", () => {
    for (let y = 550; y <= 570; y++) {
      let total = 0;
      for (let m = 1; m <= 12; m++) total += T.nanakshahiMonthLength(y, m);
      expect([365, 366], `NS ${y}`).toContain(total);
    }
  });
});

describe("assyrian", () => {
  it("matches the reference year every day", () => {
    expect(
      eachDay((r) => {
        const a = T.assyrianFromRd(r);
        const b = R.assyrianFromRd(r);
        return a.year === b.year ? null : `${a.year} vs ${b.year}`;
      })
    ).toEqual([]);
  });

  it("round-trips", () => {
    expect(
      eachDay((r) => {
        const a = T.assyrianFromRd(r);
        return T.rdFromAssyrian(a.year, a.month, a.day) === r ? null : "round-trip failed";
      })
    ).toEqual([]);
  });

  it("starts the year on 1 April with Nisan", () => {
    expect(T.assyrianFromRd(rd(2026, 4, 1))).toEqual({ year: 6776, month: 1, day: 1 });
    expect(T.assyrianFromRd(rd(2026, 3, 31))).toEqual({ year: 6775, month: 12, day: 31 });
  });

  it("totals a Gregorian year of days", () => {
    for (const y of [6775, 6776, 6777]) {
      let total = 0;
      for (let m = 1; m <= 12; m++) total += T.assyrianMonthLength(y, m);
      expect([365, 366], `${y}`).toContain(total);
    }
  });
});

describe("bahai", () => {
  it("uses the same equinox as the audit's Nowruz for the noon rule", () => {
    for (let g = 2020; g <= 2030; g++) {
      expect(nowruzRd(g), `nowruz ${g}`).toBe(nowruz(g).rd);
    }
  });

  it("prints the Naw-Ruz table and its margins", () => {
    for (let y = 2015; y <= 2030; y++) {
      console.log(
        `  Naw-Ruz ${y}: ${fmt(nawRuzRd(y))} (margin ${equinoxMarginHours(y, "nawruz").toFixed(2)}h)`
      );
    }
    expect(true).toBe(true);
  });

  it("gives every year 365 or 366 days, with Ayyam-i-Ha absorbing the difference", () => {
    for (let y = 170; y <= 190; y++) {
      expect([4, 5], `BE ${y} Ayyam-i-Ha`).toContain(T.bahaiAyyamIHaLength(y));
      let total = 0;
      for (let m = 1; m <= 20; m++) total += T.bahaiMonthLength(y, m);
      expect([365, 366], `BE ${y}`).toContain(total);
    }
  });

  it("round-trips every day", () => {
    expect(
      eachDay((r) => {
        const a = T.bahaiFromRd(r);
        return T.rdFromBahai(a.year, a.month, a.day) === r
          ? null
          : `round-trip ${a.year}-${a.month}-${a.day}`;
      })
    ).toEqual([]);
  });

  it("puts Ayyam-i-Ha immediately before the month of the fast", () => {
    const start = T.rdFromBahai(182, 19, 1);
    const ala = T.rdFromBahai(182, 20, 1);
    expect(ala - start).toBe(T.bahaiAyyamIHaLength(182));
    console.log(
      `  BE 182: Ayyam-i-Ha ${fmt(start)}, month of the fast ${fmt(ala)}, next Naw-Ruz ${fmt(T.bahaiNewYearRd(183))}`
    );
  });
});

describe("javanese", () => {
  it("anchors on the Asapon kurup: 1 Sura 1867 AJ is Tuesday Pon, 24 March 1936", () => {
    const anchor = rd(1936, 3, 24);
    expect(T.javaneseFromRd(anchor)).toEqual({ year: 1867, month: 1, day: 1 });
    expect(weekdayFromRd(anchor), "Tuesday is index 1").toBe(1);
    expect(T.pasaranFromRd(anchor)).toBe("Pon");
    expect(T.winduYearName(1867)).toBe("Alip");
  });

  it("round-trips every day", () => {
    expect(
      eachDay((r) => {
        const a = T.javaneseFromRd(r);
        return T.rdFromJavanese(a.year, a.month, a.day) === r
          ? null
          : `round-trip ${a.year}-${a.month}-${a.day}`;
      })
    ).toEqual([]);
  });

  it("gives lunar years of 354 or 355 days and months of 29 or 30", () => {
    for (let y = 1950; y <= 1975; y++) {
      let total = 0;
      for (let m = 1; m <= 12; m++) {
        const len = T.javaneseMonthLength(y, m);
        expect([29, 30], `AJ ${y} month ${m}`).toContain(len);
        total += len;
      }
      expect([354, 355], `AJ ${y}`).toContain(total);
    }
  });

  it("cycles the pasaran every five days", () => {
    const base = rd(2026, 8, 28);
    for (let i = 0; i < 5; i++) {
      expect(T.pasaranFromRd(base + i + 5)).toBe(T.pasaranFromRd(base + i));
    }
  });

  it("tracks the Islamic year plus 512, which is what it is derived from", () => {
    expect(
      eachDay((r) => {
        const aj = T.javaneseFromRd(r);
        const ah = R.islamicTabular.fromRd(r);
        return Math.abs(aj.year - (ah.year + 512)) <= 1 ? null : `AJ ${aj.year} vs AH ${ah.year} + 512`;
      })
    ).toEqual([]);
  });
});
