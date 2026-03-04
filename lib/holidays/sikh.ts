import type { HolidayDefinition, HolidayEntry } from "./types";

/** Sikh (Nanakshahi): 12 months — Chet, Vaisakh, Jeth, Harh, Sawan, Bhadon, Assu, Katak, Maghar, Poh, Magh, Phaggan. */
const SIKH_HOLIDAYS: HolidayDefinition[] = [
  { id: "vaisakhi", nameEn: "Vaisakhi", nameOriginal: "ਵਿਸਾਖੀ", type: "holiday", description: "Sikh New Year, founding of Khalsa", rule: { kind: "fixed", month: 2, day: 1 }, infoEn: "Vaisakhi marks the Sikh New Year and the founding of the Khalsa by Guru Gobind Singh in 1699. It is celebrated with processions (nagar kirtan), visits to gurdwaras, and community meals (langar). A major harvest and religious festival in Punjab and the Sikh diaspora." },
  { id: "martyrdom-arjan", nameEn: "Martyrdom of Guru Arjan", nameOriginal: "ਸ਼ਹੀਦੀ ਦਿਵਸ", type: "observance", rule: { kind: "fixed", month: 3, day: 2 }, infoEn: "This day commemorates the martyrdom of Guru Arjan Dev, the fifth Sikh Guru, in 1606. Sikhs remember his sacrifice, compile and protect the Guru Granth Sahib, and reflect on standing for justice and faith." },
  { id: "guru-nanak", nameEn: "Guru Nanak Jayanti", nameOriginal: "ਗੁਰੂ ਨਾਨਕ ਜਯੰਤੀ", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "Guru Nanak Jayanti celebrates the birth of Guru Nanak, the founder of Sikhism. Gurdwaras hold prayers, kirtan, and langar. Processions and night-long readings of the Guru Granth Sahib are common. It is the most important Sikh religious holiday." },
  { id: "bandi-chhor", nameEn: "Bandi Chhor Divas", nameOriginal: "ਬੰਦੀ ਛੋੜ ਦਿਵਸ", type: "holiday", description: "Diwali in Sikh tradition", rule: { kind: "fixed", month: 10, day: 25 }, infoEn: "Bandi Chhor Divas (Prisoner Release Day) marks Guru Hargobind’s release from Mughal detention and the freeing of 52 princes. Sikhs celebrate with lamps and fireworks, similar to Diwali, and visit gurdwaras to give thanks." },
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
