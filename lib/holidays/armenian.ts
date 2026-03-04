import type { HolidayDefinition, HolidayEntry } from "./types";

/** Armenian: Nawasardi=1, Hoṙi=2, ..., Hrotich=12. Traditional calendar. */
const ARMENIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "navasard", nameEn: "Navasard", nameOriginal: "Նավասարդ", type: "holiday", description: "Armenian New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Navasard is the ancient Armenian New Year, originally tied to the harvest and the god of the new year. It is celebrated with feasts, music, and games. The traditional Armenian calendar (used in some contexts) begins on this day." },
  { id: "vardavar", nameEn: "Vardavar", nameOriginal: "Վարդավառ", type: "tradition", rule: { kind: "fixed", month: 4, day: 28 }, infoEn: "Vardavar is a summer water festival when people douse each other with water. It has pre-Christian roots (linked to Astghik, goddess of water and love) and is now associated with the Transfiguration. Celebrated in Armenia and the diaspora with joy and laughter." },
  { id: "christmas-armenian", nameEn: "Armenian Christmas", nameOriginal: "Սուրբ Ծնունդ", type: "holiday", rule: { kind: "fixed", month: 6, day: 6 }, infoEn: "Armenian Christmas is celebrated on 6 January (Gregorian) by the Armenian Apostolic Church. It combines the Nativity and the Epiphany. Traditions include liturgy, blessing of water, and family meals. Armenians worldwide observe this date." },
  { id: "armenia-independence", nameEn: "Independence Day", nameOriginal: "Անկախության օր", type: "holiday", rule: { kind: "fixed", month: 6, day: 21 }, infoEn: "Armenian Independence Day marks the 1991 referendum that established the Republic of Armenia after the dissolution of the Soviet Union. It is a national holiday with official ceremonies, parades, and cultural events." },
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
