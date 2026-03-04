import type { HolidayDefinition, HolidayEntry } from "./types";

/** Armenian: Nawasardi=1, Hoṙi=2, ..., Hrotich=12. Traditional calendar. */
const ARMENIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "navasard", nameEn: "Navasard", nameOriginal: "Նավասարդ", type: "holiday", description: "Armenian New Year", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "vardavar", nameEn: "Vardavar", nameOriginal: "Վարդավառ", type: "tradition", rule: { kind: "fixed", month: 4, day: 28 } },
  { id: "armenia-independence", nameEn: "Independence Day", nameOriginal: "Անկախության օր", type: "holiday", rule: { kind: "fixed", month: 6, day: 21 } },
  { id: "christmas-armenian", nameEn: "Armenian Christmas", nameOriginal: "Սուրբ Ծնունդ", type: "holiday", rule: { kind: "fixed", month: 6, day: 6 } },
];

export function getArmenianHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of ARMENIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
