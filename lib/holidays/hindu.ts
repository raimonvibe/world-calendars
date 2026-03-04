import type { HolidayDefinition, HolidayEntry } from "./types";

/** Hindu (Vikram Samvat): Chaitra=1, Vaisakha=2, ..., Phalguna=12. Dates approximate (lunar). */
const HINDU_HOLIDAYS: HolidayDefinition[] = [
  { id: "chaitra-1", nameEn: "Chaitra Navaratri start", nameOriginal: "चैत्र नवरात्रि", type: "observance", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "vaisakhi-hindu", nameEn: "Vaisakhi", nameOriginal: "वैशाखी", type: "holiday", rule: { kind: "fixed", month: 2, day: 1 } },
  { id: "budha-purnima", nameEn: "Buddha Purnima", nameOriginal: "बुद्ध पूर्णिमा", type: "observance", rule: { kind: "fixed", month: 2, day: 15 } },
  { id: "navaratri", nameEn: "Navaratri (start)", nameOriginal: "नवरात्रि", type: "observance", rule: { kind: "fixed", month: 7, day: 1 } },
  { id: "dussehra", nameEn: "Dussehra", nameOriginal: "दशहरा", type: "holiday", rule: { kind: "fixed", month: 7, day: 10 } },
  { id: "diwali", nameEn: "Diwali", nameOriginal: "दीपावली", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 } },
  { id: "holi", nameEn: "Holi", nameOriginal: "होली", type: "holiday", rule: { kind: "fixed", month: 12, day: 15 } },
];

export function getHinduHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of HINDU_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
