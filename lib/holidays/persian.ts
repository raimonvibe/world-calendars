import type { HolidayDefinition, HolidayEntry } from "./types";

const PERSIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "nowruz", nameEn: "Nowruz", nameOriginal: "نوروز", type: "holiday", description: "Persian New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Nowruz is the Persian New Year and the first day of spring in the Solar Hijri calendar. It is celebrated across Iran, Central Asia, and the diaspora with a ceremonial table (haft-sin), family gatherings, and the renewal of nature. UNESCO recognizes it as Intangible Cultural Heritage." },
  { id: "republic-day", nameEn: "Islamic Republic Day", nameOriginal: "روز جمهوری اسلامی", type: "holiday", rule: { kind: "fixed", month: 1, day: 12 }, infoEn: "Islamic Republic Day marks the 1979 referendum when Iran voted to become an Islamic Republic. It is a national holiday observed on 12 Farvardin in the Solar Hijri calendar." },
  { id: "nowruz-13", nameEn: "Sizdah Bedar", nameOriginal: "سیزدهبهدر", type: "tradition", description: "13th day of Nowruz", rule: { kind: "fixed", month: 1, day: 13 }, infoEn: "Sizdah Bedar is the 13th day of Nowruz, when families go outdoors to picnic and cast away the number 13’s bad luck. It marks the end of the Nowruz holiday period and is a day of joy and nature." },
  { id: "arbaeen", nameEn: "Arbaeen", nameOriginal: "اربعین", type: "observance", rule: { kind: "fixed", month: 2, day: 20 }, infoEn: "Arbaeen is a Shia Muslim observance 40 days after Ashura, commemorating the martyrdom of Imam Hussein at Karbala. Millions make pilgrimage to Karbala (Iraq); others hold processions and mourning gatherings worldwide." },
  { id: "martyrs", nameEn: "Martyrdom of Imam Reza", nameOriginal: "شهادت امام رضا", type: "observance", rule: { kind: "fixed", month: 2, day: 29 }, infoEn: "This day commemorates the martyrdom of Imam Reza, the eighth Shia Imam, buried in Mashhad, Iran. Shia Muslims observe it with mourning, prayers, and visits to his shrine." },
  { id: "khomeini-death", nameEn: "Death of Imam Khomeini", nameOriginal: "رحلت امام خمینی", type: "observance", rule: { kind: "fixed", month: 3, day: 14 }, infoEn: "14 Khordad marks the anniversary of the death of Ayatollah Khomeini (1989), founder of the Islamic Republic. It is a national day of mourning and remembrance in Iran." },
  { id: "khordad-15", nameEn: "15 Khordad uprising", nameOriginal: "قیام ۱۵ خرداد", type: "observance", rule: { kind: "fixed", month: 3, day: 15 }, infoEn: "15 Khordad commemorates the 1963 uprising against the Pahlavi regime, which was suppressed but became a symbol of resistance leading to the 1979 Revolution." },
  { id: "students-day", nameEn: "Students' Day (13 Aban)", nameOriginal: "روز دانش آموز", type: "observance", rule: { kind: "fixed", month: 8, day: 13 }, infoEn: "13 Aban is Students' Day, marking the 1979 takeover of the US embassy in Tehran and the hostage crisis. It is observed as a day of resistance against foreign interference." },
  { id: "yalda", nameEn: "Yalda Night", nameOriginal: "شب یلدا", type: "tradition", rule: { kind: "fixed", month: 9, day: 30 }, infoEn: "Yalda (Shab-e Chelleh) is the longest night of the year, celebrated on the eve of 1 Dey (30 Azar). Families gather to eat pomegranate and watermelon, read poetry, and welcome the winter solstice. UNESCO Intangible Cultural Heritage." },
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
