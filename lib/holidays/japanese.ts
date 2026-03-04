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
  { id: "ganjitsu", nameEn: "New Year's Day", nameOriginal: "元日", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Japanese New Year (Ganjitsu) is the most important national holiday. Families visit shrines and temples, eat osechi cuisine, and send nengajo (New Year cards). Many businesses close for the first few days of January." },
  { id: "coming-of-age", nameEn: "Coming of Age Day", nameOriginal: "成人の日", type: "holiday", rule: { kind: "nthWeekday", month: 1, weekday: 0, n: 2 }, infoEn: "Coming of Age Day honours those who turn 20 in the current fiscal year. Municipalities hold ceremonies; young adults often wear traditional dress (kimono or hakama) and celebrate with family and friends." },
  { id: "foundation", nameEn: "National Foundation Day", nameOriginal: "建国記念の日", type: "holiday", rule: { kind: "fixed", month: 2, day: 11 }, infoEn: "National Foundation Day commemorates the legendary founding of Japan by Emperor Jimmu. It is a day of national reflection; some fly the flag and visit shrines. The date was chosen for the traditional accession of Jimmu." },
  { id: "emperor-birthday", nameEn: "Emperor's Birthday", nameOriginal: "天皇誕生日", type: "holiday", rule: { kind: "fixed", month: 2, day: 23 }, infoEn: "The Emperor's Birthday is a national holiday. The Imperial Palace opens for public greetings when the imperial family appears on the balcony. The date changes with each reigning emperor." },
  { id: "showa", nameEn: "Showa Day", nameOriginal: "昭和の日", type: "holiday", rule: { kind: "fixed", month: 4, day: 29 }, infoEn: "Showa Day honours Emperor Showa (Hirohito) and reflects on the Showa period (1926–1989). It is the first day of Golden Week, a cluster of spring holidays. Many use it for rest and outdoor activities." },
  { id: "constitution", nameEn: "Constitution Day", nameOriginal: "憲法記念日", type: "holiday", rule: { kind: "fixed", month: 5, day: 3 }, infoEn: "Constitution Day commemorates the 1947 Constitution of Japan. It is a day to reflect on democracy and the rule of law. Part of Golden Week; no official ceremonies are mandated." },
  { id: "greenery", nameEn: "Greenery Day", nameOriginal: "みどりの日", type: "holiday", rule: { kind: "fixed", month: 5, day: 4 }, infoEn: "Greenery Day celebrates nature and the environment. Many people enjoy parks and gardens. It was established in honour of Emperor Showa's love of plants and forms part of Golden Week." },
  { id: "children", nameEn: "Children's Day", nameOriginal: "こどもの日", type: "holiday", rule: { kind: "fixed", month: 5, day: 5 }, infoEn: "Children's Day (formerly Boys' Day) celebrates children's happiness and growth. Families fly koinobori (carp streamers), display samurai dolls, and take baths with iris leaves. The last day of Golden Week." },
  { id: "marine", nameEn: "Marine Day", nameOriginal: "海の日", type: "holiday", rule: { kind: "nthWeekday", month: 7, weekday: 0, n: 3 }, infoEn: "Marine Day gives thanks for the ocean's bounty and Japan's maritime identity. It falls on the third Monday of July. Many head to the coast for beach trips and water activities." },
  { id: "mountain", nameEn: "Mountain Day", nameOriginal: "山の日", type: "holiday", rule: { kind: "fixed", month: 8, day: 11 }, infoEn: "Mountain Day, introduced in 2016, encourages appreciation of mountains. The date 8/11 reads 'mountain' in Japanese (八 = 8, 月 = 11). Hiking and mountain visits are popular." },
  { id: "obon", nameEn: "Obon", nameOriginal: "お盆", type: "observance", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "Obon is a Buddhist-Confucian festival when ancestors' spirits are believed to return home. Families clean graves, make offerings, and dance bon odori. Many return to their hometowns; dates vary by region (mid-July or August)." },
  { id: "respect-aged", nameEn: "Respect for the Aged Day", nameOriginal: "敬老の日", type: "holiday", rule: { kind: "nthWeekday", month: 9, weekday: 0, n: 3 }, infoEn: "Respect for the Aged Day honours elderly citizens. It is observed on the third Monday of September. Communities hold events and families visit grandparents to show gratitude and care." },
  { id: "sports", nameEn: "Sports Day", nameOriginal: "スポーツの日", type: "holiday", rule: { kind: "nthWeekday", month: 10, weekday: 0, n: 2 }, infoEn: "Sports Day promotes physical activity and healthy living. It falls on the second Monday of October (commemorating the 1964 Tokyo Olympics opening). Schools and communities often hold sports festivals." },
  { id: "culture", nameEn: "Culture Day", nameOriginal: "文化の日", type: "holiday", rule: { kind: "fixed", month: 11, day: 3 }, infoEn: "Culture Day promotes culture, the arts, and academic endeavour. Museums and cultural institutions often offer free or discounted entry. The date marks the 1946 Constitution promulgation." },
  { id: "labor-thanks", nameEn: "Labor Thanksgiving Day", nameOriginal: "勤労感謝の日", type: "holiday", rule: { kind: "fixed", month: 11, day: 23 }, infoEn: "Labor Thanksgiving Day honours workers and production. Rooted in the harvest festival Niiname-sai, it is a day to thank others for their labour. Schools often have children create thank-you cards." },
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
