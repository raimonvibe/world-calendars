import type { HolidayDefinition, HolidayEntry } from "./types";

/** Ethiopian calendar: 13 months (1–12 have 30 days, month 13 has 5 or 6). */
const ETHIOPIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "enkutatash", nameEn: "Enkutatash", nameOriginal: "እንቁጣጣሽ", type: "holiday", description: "Ethiopian New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Enkutatash is the Ethiopian and Eritrean New Year, coinciding with the end of the rainy season. It is celebrated with yellow flowers (meskel daisies), family gatherings, and the exchange of gifts. Children sing and give bouquets in exchange for small presents." },
  { id: "meskel", nameEn: "Meskel", nameOriginal: "መስቀል", type: "holiday", description: "Finding of the True Cross", rule: { kind: "fixed", month: 1, day: 17 }, infoEn: "Meskel commemorates the finding of the True Cross by St. Helena. Celebrations include lighting a large bonfire (demera), singing, and dancing. It is a major Orthodox Christian holiday in Ethiopia and Eritrea, marking the start of spring." },
  { id: "genna", nameEn: "Genna", nameOriginal: "ገና", type: "holiday", description: "Ethiopian Christmas", rule: { kind: "fixed", month: 4, day: 29 }, infoEn: "Genna is Ethiopian Christmas, observed on 7 January (Gregorian) by the Ethiopian calendar. It is a day of church services, fasting break, and feasting. The traditional game of genna (hockey-like) is played in many communities." },
  { id: "timkat", nameEn: "Timkat", nameOriginal: "ጥምቀት", type: "holiday", description: "Epiphany", rule: { kind: "fixed", month: 5, day: 11 }, infoEn: "Timkat (Epiphany) celebrates the baptism of Jesus in the Jordan. Priests carry the tabot (replica of the Ark) in processions to a body of water for blessing. It is one of the most colourful and widely attended festivals in Ethiopia." },
  { id: "victory-adwa", nameEn: "Victory of Adwa", nameOriginal: "የዐድዋ ድል", type: "observance", rule: { kind: "fixed", month: 6, day: 23 }, infoEn: "Victory of Adwa commemorates the 1896 Battle of Adwa, when Ethiopia defeated Italy and secured its independence. It is a national holiday and a symbol of African resistance to colonialism." },
  { id: "buhe", nameEn: "Buhe", nameOriginal: "ቡሄ", type: "observance", rule: { kind: "fixed", month: 8, day: 19 }, infoEn: "Buhe (21 Nahase in some reckonings) celebrates the Transfiguration of Jesus on Mount Tabor. Young people sing Buhe songs and carry sticks symbolizing the light of Christ; households give food or treats. An Ethiopian Orthodox observance." },
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
