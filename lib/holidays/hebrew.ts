import type { HolidayDefinition, HolidayEntry } from "./types";

/** Hebrew holidays by Hebrew month and day. Month numbers: 1=Nisan..7=Tishrei (year start) etc. */
const HEBREW_HOLIDAYS: HolidayDefinition[] = [
  { id: "rosh-hashanah", nameEn: "Rosh Hashanah", nameOriginal: "ראש השנה", type: "holiday", rule: { kind: "fixed", month: 7, day: 1 }, infoEn: "Rosh Hashanah is the Jewish New Year, beginning the High Holy Days. It is a time of reflection, prayer, and hearing the shofar. Many observe it with festive meals and symbolic foods such as apples and honey." },
  { id: "rosh-hashanah-2", nameEn: "Rosh Hashanah (Day 2)", nameOriginal: "ראש השנה", type: "holiday", rule: { kind: "fixed", month: 7, day: 2 }, infoEn: "The second day of Rosh Hashanah is observed in the Diaspora and in Israel by many communities. Prayers and customs continue from the first day." },
  { id: "yom-kippur", nameEn: "Yom Kippur", nameOriginal: "יום כיפור", type: "holiday", rule: { kind: "fixed", month: 7, day: 10 }, infoEn: "Yom Kippur, the Day of Atonement, is the holiest day in Judaism. It is observed with fasting, prayer, and repentance. Many Jews spend the day in synagogue." },
  { id: "sukkot", nameEn: "Sukkot", nameOriginal: "סוכות", type: "holiday", rule: { kind: "fixed", month: 7, day: 15 }, infoEn: "Sukkot is a harvest festival when Jews build and dwell in temporary booths (sukkot). It commemorates the Israelites' journey in the wilderness and is a time of joy and gratitude." },
  { id: "simchat-torah", nameEn: "Simchat Torah", nameOriginal: "שמחת תורה", type: "holiday", rule: { kind: "fixed", month: 7, day: 22 }, infoEn: "Simchat Torah celebrates the completion and restart of the annual Torah reading cycle. Synagogues hold festive processions with the Torah scrolls and dancing." },
  { id: "chanukah", nameEn: "Chanukah", nameOriginal: "חנוכה", type: "holiday", rule: { kind: "fixed", month: 9, day: 25 }, infoEn: "Chanukah is an eight-day festival commemorating the rededication of the Temple. Each night a candle is lit on the menorah. Traditions include foods cooked in oil, games, and gifts." },
  { id: "purim", nameEn: "Purim", nameOriginal: "פורים", type: "holiday", rule: { kind: "fixed", month: 12, day: 14 }, infoEn: "Purim celebrates the salvation of the Jews in ancient Persia as told in the Book of Esther. It is observed with readings of the Megillah, costumes, feasts, and giving gifts to the poor." },
  { id: "pesach", nameEn: "Passover (Pesach)", nameOriginal: "פסח", type: "holiday", rule: { kind: "fixed", month: 1, day: 15 }, infoEn: "Passover commemorates the Exodus from Egypt. The Seder meal, matzah, and the retelling of the story are central. Leavened food is avoided for the duration of the holiday." },
  { id: "shavuot", nameEn: "Shavuot", nameOriginal: "שבועות", type: "holiday", rule: { kind: "fixed", month: 3, day: 6 }, infoEn: "Shavuot marks the giving of the Torah at Mount Sinai. It is a harvest festival and a time of study. Many stay up learning and eat dairy foods." },
];

/**
 * Hebrew calendar month in the *display* order (Tishrei=1 in UI for year view).
 * Our getHebrewYearStructure returns months in order: 7,8,9,10,11,12[,13],1,2,3,4,5,6.
 * So display index 0 = month 7 (Tishrei), index 1 = month 8, ... index 6 = month 1 (Nisan) ...
 * When we're in "month view", the month param is 1-based *display* index (first block = 1).
 * So we need to map display month index (1-13) back to Hebrew month number.
 * getMonthInfo(hebrew, year, month) returns the month at position (month-1) in the structure.
 * So the Hebrew month number is in the structure - we don't have it in the URL. So when
 * resolving holidays we need the *Hebrew* month number (1-13), not the display index.
 * getMonthInfo for Hebrew returns monthNameEn but not the Hebrew month number. So we need
 * to pass the Hebrew month number to getHebrewHolidaysForDay. Actually in getMonthInfo
 * we return the structure from getHebrewYearStructure which has monthNum. So in the year
 * structure, structure[i].monthNum is the Hebrew month. So when user is viewing "month" 5
 * (5th block), that might be Kislev (month 9). So getHolidaysForDay(hebrew, year, month, day)
 * - here month is the display index 1-13. We need to map display index -> Hebrew month number.
 * We can add to getMonthInfo a field hebrewMonthNum for Hebrew calendar, and pass that to
 * the month view. Or we can in getHebrewHolidaysForDay accept (year, displayMonthIndex, day)
 * and look up the Hebrew month from the year structure. That would require importing
 * getHebrewYearStructure in holidays/hebrew.ts. So: getHebrewHolidaysForDay(year, displayMonthIndex, day).
 * We get structure = getHebrewYearStructure(year), monthInfo = structure[displayMonthIndex-1],
 * hebrewMonthNum = monthInfo.monthNum. Then we match holidays by hebrewMonthNum and day.
 * So the API getHolidaysForDay(calendarId, year, month, day) - for Hebrew, "month" is the
 * display index (1-13). We need to resolve to Hebrew month number inside the Hebrew resolver.
 * So I'll import getHebrewYearStructure in hebrew.ts and get the monthNum from the structure.
 */
import { getHebrewYearStructure } from "@/lib/calendarViews";

export function getHebrewHolidaysForDay(
  year: number,
  displayMonthIndex: number,
  day: number
): HolidayEntry[] {
  const structure = getHebrewYearStructure(year);
  const block = structure[displayMonthIndex - 1];
  const hebrewMonthNum = block?.monthNum;
  if (hebrewMonthNum == null) return [];

  const result: HolidayEntry[] = [];
  for (const h of HEBREW_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === hebrewMonthNum && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
