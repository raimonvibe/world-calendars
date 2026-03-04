import type { HolidayDefinition, HolidayEntry } from "./types";

const PERSIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "nowruz", nameEn: "Nowruz", nameOriginal: "نوروز", type: "holiday", description: "Persian New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Nowruz is the Persian New Year and the first day of spring in the Solar Hijri calendar. It is celebrated across Iran, Central Asia, and the diaspora with a ceremonial table (haft-sin), family gatherings, and the renewal of nature. UNESCO recognizes it as Intangible Cultural Heritage." },
  { id: "nowruz-13", nameEn: "Sizdah Bedar", nameOriginal: "سیزدهبهدر", type: "tradition", description: "13th day of Nowruz", rule: { kind: "fixed", month: 1, day: 13 }, infoEn: "Sizdah Bedar is the 13th day of Nowruz, when families go outdoors to picnic and cast away the number 13’s bad luck. It marks the end of the Nowruz holiday period and is a day of joy and nature." },
  { id: "arbaeen", nameEn: "Arbaeen", nameOriginal: "اربعین", type: "observance", rule: { kind: "fixed", month: 2, day: 20 }, infoEn: "Arbaeen is a Shia Muslim observance 40 days after Ashura, commemorating the martyrdom of Imam Hussein at Karbala. Millions make pilgrimage to Karbala (Iraq); others hold processions and mourning gatherings worldwide." },
  { id: "martyrs", nameEn: "Martyrdom of Imam Reza", nameOriginal: "شهادت امام رضا", type: "observance", rule: { kind: "fixed", month: 2, day: 29 }, infoEn: "This day commemorates the martyrdom of Imam Reza, the eighth Shia Imam, buried in Mashhad, Iran. Shia Muslims observe it with mourning, prayers, and visits to his shrine." },
  { id: "revolution", nameEn: "Islamic Revolution Day", nameOriginal: "روز انقلاب", type: "holiday", rule: { kind: "fixed", month: 11, day: 22 }, infoEn: "Islamic Revolution Day marks the 1979 revolution in Iran. It is a national holiday with official ceremonies and public observances reflecting the establishment of the Islamic Republic." },
  { id: "oil-national", nameEn: "Oil Nationalization Day", nameOriginal: "ملی شدن صنعت نفت", type: "observance", rule: { kind: "fixed", month: 12, day: 29 }, infoEn: "Oil Nationalization Day commemorates the 1951 nationalization of Iran’s oil industry under Prime Minister Mosaddegh. It is observed as a symbol of national sovereignty and economic independence." },
];

export function getPersianHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of PERSIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
