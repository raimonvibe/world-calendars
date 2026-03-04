import type { HolidayDefinition, HolidayEntry } from "./types";

/** Chinese lunar calendar holidays (month 1–12, day 1–30 in our simplified structure). */
const CHINESE_HOLIDAYS: HolidayDefinition[] = [
  { id: "lunar-new-year", nameEn: "Lunar New Year", nameOriginal: "春节", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "lantern", nameEn: "Lantern Festival", nameOriginal: "元宵节", type: "holiday", rule: { kind: "fixed", month: 1, day: 15 } },
  { id: "dragon-boat", nameEn: "Dragon Boat Festival", nameOriginal: "端午节", type: "holiday", rule: { kind: "fixed", month: 5, day: 5 } },
  { id: "qixi", nameEn: "Qixi Festival", nameOriginal: "七夕", type: "tradition", rule: { kind: "fixed", month: 7, day: 7 } },
  { id: "mid-autumn", nameEn: "Mid-Autumn Festival", nameOriginal: "中秋节", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 } },
  { id: "chongyang", nameEn: "Chongyang Festival", nameOriginal: "重阳节", type: "observance", rule: { kind: "fixed", month: 9, day: 9 } },
  { id: "winter-solstice", nameEn: "Winter Solstice", nameOriginal: "冬至", type: "observance", rule: { kind: "fixed", month: 11, day: 22 } },
  { id: "laba", nameEn: "Laba Festival", nameOriginal: "腊八节", type: "tradition", rule: { kind: "fixed", month: 12, day: 8 } },
  { id: "small-year", nameEn: "Small New Year", nameOriginal: "小年", type: "tradition", rule: { kind: "fixed", month: 12, day: 23 } },
];

export function getChineseHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of CHINESE_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
