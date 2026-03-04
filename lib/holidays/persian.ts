import type { HolidayDefinition, HolidayEntry } from "./types";

const PERSIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "nowruz", nameEn: "Nowruz", nameOriginal: "نوروز", type: "holiday", description: "Persian New Year", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "nowruz-13", nameEn: "Sizdah Bedar", nameOriginal: "سیزدهبهدر", type: "tradition", description: "13th day of Nowruz", rule: { kind: "fixed", month: 1, day: 13 } },
  { id: "arbaeen", nameEn: "Arbaeen", nameOriginal: "اربعین", type: "observance", rule: { kind: "fixed", month: 2, day: 20 } },
  { id: "martyrs", nameEn: "Martyrdom of Imam Reza", nameOriginal: "شهادت امام رضا", type: "observance", rule: { kind: "fixed", month: 2, day: 29 } },
  { id: "revolution", nameEn: "Islamic Revolution Day", nameOriginal: "روز انقلاب", type: "holiday", rule: { kind: "fixed", month: 11, day: 22 } },
  { id: "oil-national", nameEn: "Oil Nationalization Day", nameOriginal: "ملی شدن صنعت نفت", type: "observance", rule: { kind: "fixed", month: 12, day: 29 } },
];

export function getPersianHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of PERSIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
