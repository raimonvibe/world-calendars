import type { HolidayDefinition, HolidayEntry } from "./types";

/** Chinese lunar calendar holidays (month 1–12, day 1–30 in our simplified structure). */
const CHINESE_HOLIDAYS: HolidayDefinition[] = [
  { id: "lunar-new-year", nameEn: "Lunar New Year", nameOriginal: "春节", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Lunar New Year (Spring Festival) is the most important holiday in the Chinese calendar. Families reunite, clean homes, give red envelopes (hongbao), and celebrate with feasts and fireworks. Each year is associated with one of twelve zodiac animals." },
  { id: "lantern", nameEn: "Lantern Festival", nameOriginal: "元宵节", type: "holiday", rule: { kind: "fixed", month: 1, day: 15 }, infoEn: "The Lantern Festival marks the end of the Lunar New Year period. People display and carry lanterns, solve riddles, and eat tangyuan (sweet rice balls). It falls on the first full moon of the lunar year." },
  { id: "longtaitou", nameEn: "Longtaitou (Dragon Head)", nameOriginal: "龙抬头", type: "tradition", rule: { kind: "fixed", month: 2, day: 2 }, infoEn: "Longtaitou is the second day of the second lunar month, when the dragon deity is said to raise its head and bring rain. People eat dragon-named foods, get haircuts, and celebrate the start of spring and farming." },
  { id: "qingming", nameEn: "Qingming (Tomb-Sweeping)", nameOriginal: "清明节", type: "observance", rule: { kind: "fixed", month: 3, day: 5 }, infoEn: "Qingming is a solar term and festival (around April 4–5) for ancestor worship and tomb-sweeping. Families visit graves, make offerings, and enjoy spring outings. It emphasizes filial piety and remembrance." },
  { id: "dragon-boat", nameEn: "Dragon Boat Festival", nameOriginal: "端午节", type: "holiday", rule: { kind: "fixed", month: 5, day: 5 }, infoEn: "The Dragon Boat Festival commemorates the poet Qu Yuan. Traditions include dragon boat races, eating zongzi (sticky rice dumplings), and hanging herbs to ward off illness. It is a public holiday in China and other East Asian countries." },
  { id: "qixi", nameEn: "Qixi Festival", nameOriginal: "七夕", type: "tradition", rule: { kind: "fixed", month: 7, day: 7 }, infoEn: "Qixi, the Double Seventh Festival, is often called Chinese Valentine’s Day. It celebrates the annual meeting of the cowherd and weaver girl in legend. Couples exchange gifts and make wishes for love and happiness." },
  { id: "mid-autumn", nameEn: "Mid-Autumn Festival", nameOriginal: "中秋节", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "The Mid-Autumn Festival is a harvest moon festival. Families gather to admire the full moon and eat mooncakes. It symbolizes reunion and thanksgiving and is one of the major holidays in China and the Chinese diaspora." },
  { id: "chongyang", nameEn: "Chongyang Festival", nameOriginal: "重阳节", type: "observance", rule: { kind: "fixed", month: 9, day: 9 }, infoEn: "The Chongyang (Double Ninth) Festival is a day to honour the elderly and enjoy autumn. People climb hills, wear dogwood, and drink chrysanthemum wine. It is also known as Senior Citizens’ Day in China." },
  { id: "winter-solstice", nameEn: "Winter Solstice", nameOriginal: "冬至", type: "observance", rule: { kind: "fixed", month: 11, day: 22 }, infoEn: "Winter Solstice (Dongzhi) is one of the 24 solar terms and the shortest day of the year. In Chinese tradition families gather for a meal; in the north people eat dumplings and in the south tangyuan, symbolizing reunion." },
  { id: "laba", nameEn: "Laba Festival", nameOriginal: "腊八节", type: "tradition", rule: { kind: "fixed", month: 12, day: 8 }, infoEn: "The Laba Festival falls on the eighth day of the twelfth lunar month. People eat laba congee (a mixed grain porridge) and prepare for the coming Lunar New Year. It has Buddhist roots and is widely observed in China." },
  { id: "small-year", nameEn: "Small New Year", nameOriginal: "小年", type: "tradition", rule: { kind: "fixed", month: 12, day: 23 }, infoEn: "Small New Year (Xiaonian) marks the start of New Year preparations. Families clean the house, offer sacrifices to the Kitchen God, and begin stocking up for the Spring Festival. The date varies slightly by region." },
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
