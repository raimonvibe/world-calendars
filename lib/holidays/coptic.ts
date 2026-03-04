import type { HolidayDefinition, HolidayEntry } from "./types";

/** Coptic: Thout=1, Phaophi=2, ..., Mesori=12. Era of Martyrs (AM). */
const COPTIC_HOLIDAYS: HolidayDefinition[] = [
  { id: "coptic-ny", nameEn: "Coptic New Year (Nayrouz)", nameOriginal: "النيروز", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Nayrouz is the Coptic New Year, marking the start of the Era of the Martyrs. It is celebrated mainly in Egypt and by Copts worldwide with church services and family gatherings. The date aligns with the ancient Egyptian new year and the start of the flood season." },
  { id: "cross", nameEn: "Feast of the Cross", nameOriginal: "عيد الصليب", type: "observance", rule: { kind: "fixed", month: 1, day: 17 }, infoEn: "The Feast of the Cross commemorates the discovery of the True Cross by St. Helena. Coptic Orthodox Christians attend liturgy and venerate the cross. The feast is shared with other Eastern churches that use the same calendar." },
  { id: "coptic-christmas", nameEn: "Coptic Christmas", nameOriginal: "عيد الميلاد", type: "holiday", rule: { kind: "fixed", month: 4, day: 29 }, infoEn: "Coptic Christmas is celebrated on 7 January (Gregorian), the 29th of Kiahk in the Coptic calendar. It is a day of fasting break, midnight liturgy, and festive meals. A major holiday for Copts in Egypt and the diaspora." },
  { id: "epiphany-coptic", nameEn: "Epiphany (Timkat)", nameOriginal: "الغطاس", type: "holiday", rule: { kind: "fixed", month: 5, day: 11 }, infoEn: "Coptic Epiphany (Theophany) celebrates the baptism of Jesus in the Jordan. The blessing of the waters is central. It is observed on 19 January (Gregorian) and is one of the great feasts of the Coptic Church." },
  { id: "annunciation", nameEn: "Annunciation", nameOriginal: "البشارة", type: "observance", rule: { kind: "fixed", month: 7, day: 29 }, infoEn: "The Feast of the Annunciation marks the angel Gabriel's announcement to the Virgin Mary that she would bear Jesus. Copts observe it with liturgy and hymns. It is fixed on 29 Baramhat (7 April Gregorian)." },
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
