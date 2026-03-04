import type { HolidayDefinition, HolidayEntry } from "./types";

/** Ethiopian calendar: 13 months (1–12 have 30 days, month 13 has 5 or 6). */
const ETHIOPIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "enkutatash", nameEn: "Enkutatash", nameOriginal: "እንቁጣጣሽ", type: "holiday", description: "Ethiopian New Year", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "meskel", nameEn: "Meskel", nameOriginal: "መስቀል", type: "holiday", description: "Finding of the True Cross", rule: { kind: "fixed", month: 1, day: 17 } },
  { id: "genna", nameEn: "Genna", nameOriginal: "ገና", type: "holiday", description: "Ethiopian Christmas", rule: { kind: "fixed", month: 4, day: 29 } },
  { id: "timkat", nameEn: "Timkat", nameOriginal: "ጥምቀት", type: "holiday", description: "Epiphany", rule: { kind: "fixed", month: 5, day: 11 } },
  { id: "victory-adwa", nameEn: "Victory of Adwa", nameOriginal: "የዐድዋ ድል", type: "observance", rule: { kind: "fixed", month: 6, day: 23 } },
];

export function getEthiopianHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of ETHIOPIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
