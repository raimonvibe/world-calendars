import { describe, it, expect } from "vitest";
import { lunisolarYear, newMoonJd, rdOfInstant, CST } from "./astronomy";
import { gregorianFromRd } from "./reference";

const fmt = (rd: number) => {
  const g = gregorianFromRd(rd);
  return `${g.year}-${String(g.month).padStart(2, "0")}-${String(g.day).padStart(2, "0")}`;
};

describe("diagnostics for the years where ICU and the reference disagree", () => {
  it("prints new moon instants in China Standard Time around each new year", () => {
    for (const y of [2020, 2025, 2027, 2030]) {
      const ny = lunisolarYear(y).newYear;
      let best = Math.round((ny + 1721425 - 2451550) / 29.530588861);
      for (let i = -2; i <= 2; i++) {
        if (rdOfInstant(newMoonJd(best + i), CST) === ny) { best += i; break; }
      }
      const jd = newMoonJd(best);
      const cstFrac = jd + 0.5 + CST - Math.floor(jd + 0.5 + CST);
      const hh = Math.floor(cstFrac * 24);
      const mm = Math.round((cstFrac * 24 - hh) * 60);
      console.log(
        `  ${y}: new year ${fmt(ny)}, new moon at ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} CST` +
          ` (margin to midnight: ${Math.min(cstFrac, 1 - cstFrac) * 24 > 1 ? "safe" : "TIGHT"})`
      );
      const leaps = lunisolarYear(y).months.filter((m) => m.leap);
      console.log(`      leap months: ${leaps.map((m) => `${m.number} from ${fmt(m.start)}`).join(", ") || "none"}`);
    }
    expect(true).toBe(true);
  });
});
