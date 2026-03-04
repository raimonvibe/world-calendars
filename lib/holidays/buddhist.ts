import type { HolidayDefinition, HolidayEntry } from "./types";

/** Buddhist / Thai Solar: same 12-month structure as Gregorian. Dates approximate (lunar-based in reality). */
const BUDDHIST_HOLIDAYS: HolidayDefinition[] = [
  { id: "magha-puja", nameEn: "Magha Puja", nameOriginal: "มาฆบูชา", type: "holiday", description: "Full moon of 3rd lunar month", rule: { kind: "fixed", month: 2, day: 15 } },
  { id: "vesak", nameEn: "Vesak", nameOriginal: "วิสาขบูชา", type: "holiday", description: "Buddha's birth, enlightenment, death", rule: { kind: "fixed", month: 5, day: 15 } },
  { id: "asalha-puja", nameEn: "Asalha Puja", nameOriginal: "อาสาฬหบูชา", type: "holiday", rule: { kind: "fixed", month: 7, day: 15 } },
  { id: "buddhist-lent", nameEn: "Buddhist Lent (start)", nameOriginal: "เข้าพรรษา", type: "observance", rule: { kind: "fixed", month: 7, day: 16 } },
  { id: "loy-krathong", nameEn: "Loy Krathong", nameOriginal: "ลอยกระทง", type: "tradition", rule: { kind: "fixed", month: 11, day: 15 } },
];

export function getBuddhistHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of BUDDHIST_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
