import type { HolidayDefinition, HolidayEntry } from "./types";

/** Assyrian: Nisan=1, Iyyar=2, ..., Ilul=12. */
const ASSYRIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "akitu", nameEn: "Akitu (Assyrian New Year)", nameOriginal: "ܐܟܝܬܘ", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Akitu is the ancient Mesopotamian New Year festival, revived by Assyrians as their national New Year. It celebrates spring, renewal, and Assyrian identity. Parades, music, and traditional dress are common in Assyrian communities worldwide." },
  { id: "kha-b-nisan", nameEn: "Kha b-Nisan", nameOriginal: "ܚܕ ܒܢܝܣܢ", type: "tradition", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Kha b-Nisan (First of Nisan) is the first day of the Assyrian calendar year. It coincides with Akitu and is a day of celebration, family gatherings, and cultural pride for Assyrians and other Syriac Christians." },
  { id: "assumption", nameEn: "Assumption of Mary", nameOriginal: "ܫܘܒܚܐ ܕܝܠܕܗ ܕܡܪܝܡ", type: "observance", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "The Assumption of Mary is celebrated by Assyrian and other Eastern Christians as the falling asleep and glorification of the Virgin Mary. It is observed with liturgy and processions in the Assyrian Church of the East and related traditions." },
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
