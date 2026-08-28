import { describe, it, expect } from "vitest";
import { marchEquinoxJd, nowruz } from "./astronomy";
import { gregorianFromRd } from "./reference";

/** Published March equinox instants (UTC), to validate the Meeus implementation. */
const KNOWN_EQUINOX_UTC: Record<number, string> = {
  2020: "2020-03-20T03:50Z",
  2021: "2021-03-20T09:37Z",
  2022: "2022-03-20T15:33Z",
  2023: "2023-03-20T21:24Z",
  2024: "2024-03-20T03:06Z",
  2025: "2025-03-20T09:01Z",
  2026: "2026-03-20T14:46Z",
  2027: "2027-03-20T20:25Z",
  2028: "2028-03-20T02:17Z",
};

describe("astronomy: March equinox", () => {
  it("matches published equinox times to within 5 minutes", () => {
    for (const [year, iso] of Object.entries(KNOWN_EQUINOX_UTC)) {
      const expected = new Date(iso).getTime() / 86400000 + 2440587.5;
      const diffMinutes = Math.abs(marchEquinoxJd(+year) - expected) * 1440;
      expect(diffMinutes, `${year}`).toBeLessThan(5);
    }
  });
});

describe("astronomy: Nowruz", () => {
  it("computes a Nowruz on 20 or 21 March for every modern year", () => {
    for (let y = 1990; y <= 2060; y++) {
      const g = gregorianFromRd(nowruz(y).rd);
      expect(g.month, `${y}`).toBe(3);
      expect([20, 21], `${y}`).toContain(g.day);
    }
  });

  it("reports which years are close enough to the cutoff to be marginal", () => {
    const marginal: string[] = [];
    for (let y = 2000; y <= 2060; y++) {
      const n = nowruz(y);
      if (n.marginHours < 0.5) marginal.push(`${y} (${n.marginHours.toFixed(2)}h)`);
    }
    console.log("  marginal Nowruz years:", marginal.length ? marginal.join(", ") : "none");
    expect(true).toBe(true);
  });

  it("prints the Nowruz table for cross-checking", () => {
    const rows: string[] = [];
    for (let y = 2020; y <= 2030; y++) {
      const g = gregorianFromRd(nowruz(y).rd);
      rows.push(`${y - 621} AP = ${g.day} Mar ${g.year}`);
    }
    console.log("  " + rows.join("\n  "));
    expect(true).toBe(true);
  });
});
