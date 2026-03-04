import type { HolidayDefinition, HolidayEntry } from "./types";

/** Sikh (Nanakshahi): 12 months — Chet, Vaisakh, Jeth, Harh, Sawan, Bhadon, Assu, Katak, Maghar, Poh, Magh, Phaggan. */
const SIKH_HOLIDAYS: HolidayDefinition[] = [
  { id: "vaisakhi", nameEn: "Vaisakhi", nameOriginal: "ਵਿਸਾਖੀ", type: "holiday", description: "Sikh New Year, founding of Khalsa", rule: { kind: "fixed", month: 2, day: 1 } },
  { id: "martyrdom-arjan", nameEn: "Martyrdom of Guru Arjan", nameOriginal: "ਸ਼ਹੀਦੀ ਦਿਵਸ", type: "observance", rule: { kind: "fixed", month: 3, day: 2 } },
  { id: "guru-nanak", nameEn: "Guru Nanak Jayanti", nameOriginal: "ਗੁਰੂ ਨਾਨਕ ਜਯੰਤੀ", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 } },
  { id: "bandi-chhor", nameEn: "Bandi Chhor Divas", nameOriginal: "ਬੰਦੀ ਛੋੜ ਦਿਵਸ", type: "holiday", description: "Diwali in Sikh tradition", rule: { kind: "fixed", month: 10, day: 25 } },
];

export function getSikhHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of SIKH_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
