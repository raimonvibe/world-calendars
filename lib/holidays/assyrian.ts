import type { HolidayDefinition, HolidayEntry } from "./types";

/** Assyrian: Nisan=1, Iyyar=2, ..., Ilul=12. */
const ASSYRIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "akitu", nameEn: "Akitu (Assyrian New Year)", nameOriginal: "ܐܟܝܬܘ", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "kha-b-nisan", nameEn: "Kha b-Nisan", nameOriginal: "ܚܕ ܒܢܝܣܢ", type: "tradition", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "assumption", nameEn: "Assumption of Mary", nameOriginal: "ܫܘܒܚܐ ܕܝܠܕܗ ܕܡܪܝܡ", type: "observance", rule: { kind: "fixed", month: 8, day: 15 } },
];

export function getAssyrianHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of ASSYRIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
