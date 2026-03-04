import type { HolidayDefinition, HolidayEntry } from "./types";

/** Buddhist / Thai Solar: same 12-month structure as Gregorian. Dates approximate (lunar-based in reality). */
const BUDDHIST_HOLIDAYS: HolidayDefinition[] = [
  { id: "magha-puja", nameEn: "Magha Puja", nameOriginal: "มาฆบูชา", type: "holiday", description: "Full moon of 3rd lunar month", rule: { kind: "fixed", month: 2, day: 15 }, infoEn: "Magha Puja marks the day when 1,250 disciples spontaneously gathered to hear the Buddha. It is observed on the full moon of the third lunar month with temple visits, candlelit processions, and merit-making. A major Buddhist holiday in Thailand, Laos, and Cambodia." },
  { id: "songkran", nameEn: "Songkran", nameOriginal: "สงกรานต์", type: "holiday", description: "Thai New Year (approx. April 13)", rule: { kind: "fixed", month: 4, day: 13 }, infoEn: "Songkran is the traditional Thai and Southeast Asian New Year (April 13–15). Water is used to wash away the old year and bless others. UNESCO Intangible Cultural Heritage; celebrated in Thailand, Laos, Cambodia, and Myanmar." },
  { id: "vesak", nameEn: "Vesak", nameOriginal: "วิสาขบูชา", type: "holiday", description: "Buddha's birth, enlightenment, death", rule: { kind: "fixed", month: 5, day: 15 }, infoEn: "Vesak (Vesakha Puja) commemorates the birth, enlightenment, and death of the Buddha. Buddhists visit temples, make offerings, and practise meditation. It is recognized by the UN as a day of global observance." },
  { id: "asalha-puja", nameEn: "Asalha Puja", nameOriginal: "อาสาฬหบูชา", type: "holiday", rule: { kind: "fixed", month: 7, day: 15 }, infoEn: "Asalha Puja celebrates the Buddha’s first sermon (the Dhammacakkappavattana Sutta) and the founding of the Sangha. It falls on the full moon of the eighth lunar month and is observed with chanting, sermons, and candle processions." },
  { id: "buddhist-lent", nameEn: "Buddhist Lent (start)", nameOriginal: "เข้าพรรษา", type: "observance", rule: { kind: "fixed", month: 7, day: 16 }, infoEn: "Buddhist Lent (Vassa) is a three-month rainy-season retreat when monks stay in one monastery. Lay people offer robes and supplies and often take on extra precepts. It begins the day after Asalha Puja." },
  { id: "kathina", nameEn: "Kathina", nameOriginal: "กฐิน", type: "observance", description: "Robe offering after Vassa (approx.)", rule: { kind: "fixed", month: 10, day: 15 }, infoEn: "Kathina marks the end of Vassa when lay people offer new robes and supplies to monks. The one-month period begins after the full moon of the eleventh lunar month (often October). A time of gratitude and merit in Theravada Buddhism." },
  { id: "loy-krathong", nameEn: "Loy Krathong", nameOriginal: "ลอยกระทง", type: "tradition", rule: { kind: "fixed", month: 11, day: 15 }, infoEn: "Loy Krathong is a Thai festival of lights. People float krathong (decorative rafts) on rivers and lakes to honour the water spirits and let go of negativity. It is held on the full moon of the twelfth lunar month and is widely celebrated in Thailand." },
];

export function getBuddhistHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of BUDDHIST_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
