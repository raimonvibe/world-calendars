import type { HolidayDefinition, HolidayEntry } from "./types";

/** Nth weekday in month (n=1 first, n=-1 last). weekday 0=Monday, 6=Sunday */
function getNthWeekdayDate(year: number, month: number, weekday: number, n: number): number | null {
  const first = new Date(year, month - 1, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  let firstOccurrence = 1 + ((weekday - firstWeekday + 7) % 7);
  if (firstOccurrence > 7) firstOccurrence -= 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (n === -1) {
    let d = firstOccurrence + 28;
    while (d > daysInMonth) d -= 7;
    return d;
  }
  const d = firstOccurrence + (n - 1) * 7;
  return d <= daysInMonth ? d : null;
}

const JAPANESE_HOLIDAYS: HolidayDefinition[] = [
  { id: "ganjitsu", nameEn: "New Year's Day", nameOriginal: "元日", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 } },
  { id: "coming-of-age", nameEn: "Coming of Age Day", nameOriginal: "成人の日", type: "holiday", rule: { kind: "nthWeekday", month: 1, weekday: 0, n: 2 } },
  { id: "foundation", nameEn: "National Foundation Day", nameOriginal: "建国記念の日", type: "holiday", rule: { kind: "fixed", month: 2, day: 11 } },
  { id: "showa", nameEn: "Showa Day", nameOriginal: "昭和の日", type: "holiday", rule: { kind: "fixed", month: 4, day: 29 } },
  { id: "constitution", nameEn: "Constitution Day", nameOriginal: "憲法記念日", type: "holiday", rule: { kind: "fixed", month: 5, day: 3 } },
  { id: "greenery", nameEn: "Greenery Day", nameOriginal: "みどりの日", type: "holiday", rule: { kind: "fixed", month: 5, day: 4 } },
  { id: "children", nameEn: "Children's Day", nameOriginal: "こどもの日", type: "holiday", rule: { kind: "fixed", month: 5, day: 5 } },
  { id: "marine", nameEn: "Marine Day", nameOriginal: "海の日", type: "holiday", rule: { kind: "nthWeekday", month: 7, weekday: 0, n: 3 } },
  { id: "mountain", nameEn: "Mountain Day", nameOriginal: "山の日", type: "holiday", rule: { kind: "fixed", month: 8, day: 11 } },
  { id: "obon", nameEn: "Obon", nameOriginal: "お盆", type: "observance", rule: { kind: "fixed", month: 8, day: 15 } },
  { id: "respect-aged", nameEn: "Respect for the Aged Day", nameOriginal: "敬老の日", type: "holiday", rule: { kind: "nthWeekday", month: 9, weekday: 0, n: 3 } },
  { id: "sports", nameEn: "Sports Day", nameOriginal: "スポーツの日", type: "holiday", rule: { kind: "nthWeekday", month: 10, weekday: 0, n: 2 } },
  { id: "culture", nameEn: "Culture Day", nameOriginal: "文化の日", type: "holiday", rule: { kind: "fixed", month: 11, day: 3 } },
  { id: "labor-thanks", nameEn: "Labor Thanksgiving Day", nameOriginal: "勤労感謝の日", type: "holiday", rule: { kind: "fixed", month: 11, day: 23 } },
  { id: "emperor-birthday", nameEn: "Emperor's Birthday", nameOriginal: "天皇誕生日", type: "holiday", rule: { kind: "fixed", month: 2, day: 23 } },
];

export function getJapaneseHolidaysForDay(
  year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of JAPANESE_HOLIDAYS) {
    if (h.rule.kind === "fixed") {
      if (h.rule.month === month && h.rule.day === day) {
        result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
      }
    } else if (h.rule.kind === "nthWeekday") {
      const d = getNthWeekdayDate(year, month, h.rule.weekday, h.rule.n);
      if (d === day) {
        result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
      }
    }
  }
  return result;
}
