import type { HolidayDefinition, HolidayEntry } from "./types";

/** Javanese: Sura=1, Sapar=2, ..., Dulkangidah=12. Same 12-month structure; key observances. */
const JAVANESE_HOLIDAYS: HolidayDefinition[] = [
  { id: "suro", nameEn: "1 Suro (Javanese New Year)", nameOriginal: "1 Suro", type: "tradition", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "mulud", nameEn: "Sekaten / Mulud", nameOriginal: "Sekaten", type: "tradition", description: "Prophet Muhammad's birthday", rule: { kind: "fixed", month: 3, day: 12 } },
  { id: "independence-id", nameEn: "Indonesian Independence", nameOriginal: "HUT RI", type: "holiday", rule: { kind: "fixed", month: 8, day: 17 } },
  { id: "wayang", nameEn: "Wayang culture", nameOriginal: "Wayang", type: "tradition", rule: { kind: "fixed", month: 10, day: 1 } },
];

export function getJavaneseHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of JAVANESE_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
