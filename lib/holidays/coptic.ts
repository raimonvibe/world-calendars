import type { HolidayDefinition, HolidayEntry } from "./types";

/** Coptic: Thout=1, Phaophi=2, ..., Mesori=12. Era of Martyrs (AM). */
const COPTIC_HOLIDAYS: HolidayDefinition[] = [
  { id: "coptic-ny", nameEn: "Coptic New Year (Nayrouz)", nameOriginal: "النيروز", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "cross", nameEn: "Feast of the Cross", nameOriginal: "عيد الصليب", type: "observance", rule: { kind: "fixed", month: 1, day: 17 } },
  { id: "coptic-christmas", nameEn: "Coptic Christmas", nameOriginal: "عيد الميلاد", type: "holiday", rule: { kind: "fixed", month: 4, day: 29 } },
  { id: "epiphany-coptic", nameEn: "Epiphany (Timkat)", nameOriginal: "الغطاس", type: "holiday", rule: { kind: "fixed", month: 5, day: 11 } },
  { id: "annunciation", nameEn: "Annunciation", nameOriginal: "البشارة", type: "observance", rule: { kind: "fixed", month: 7, day: 29 } },
];

export function getCopticHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of COPTIC_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
