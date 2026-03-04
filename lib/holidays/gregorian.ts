import type { HolidayDefinition, HolidayEntry } from "./types";

/** Easter Sunday (Gregorian) — Anonymous Gregorian algorithm */
function getEasterYear(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/** Day of week for y-m-d (0 = Monday, 6 = Sunday) */
function getWeekday(year: number, month: number, day: number): number {
  const d = new Date(year, month - 1, day);
  return (d.getDay() + 6) % 7;
}

/** Nth weekday in month (n=1 first, n=2 second, n=-1 last) */
function getNthWeekdayDate(
  year: number,
  month: number,
  weekday: number,
  n: number
): number | null {
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

function toEntry(h: HolidayDefinition): HolidayEntry {
  return { id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl };
}

const GREGORIAN_HOLIDAYS: HolidayDefinition[] = [
  { id: "ny", nameEn: "New Year's Day", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "New Year's Day marks the first day of the Gregorian calendar year. It is a public holiday in many countries, often celebrated with fireworks, parties, and resolutions." },
  { id: "epiphany", nameEn: "Epiphany", type: "observance", rule: { kind: "fixed", month: 1, day: 6 }, infoEn: "Epiphany, or Three Kings' Day, is a Christian feast that commemorates the visit of the Magi to the infant Jesus. It is observed in many Christian traditions, especially in Latin America and Europe." },
  { id: "valentine", nameEn: "Valentine's Day", type: "observance", rule: { kind: "fixed", month: 2, day: 14 }, infoEn: "Valentine's Day is a cultural celebration of romance and love. People often exchange cards, flowers, and gifts with partners and loved ones." },
  { id: "stpatrick", nameEn: "St. Patrick's Day", type: "observance", rule: { kind: "fixed", month: 3, day: 17 }, infoEn: "St. Patrick's Day honors the patron saint of Ireland. It is celebrated with parades, green attire, and cultural events in Ireland and by Irish communities worldwide." },
  { id: "goodfriday", nameEn: "Good Friday", type: "holiday", rule: { kind: "easterOffset", offset: -2 }, infoEn: "Good Friday is the Christian observance of the crucifixion of Jesus. It is a day of solemn reflection and worship in many Christian denominations." },
  { id: "easter", nameEn: "Easter Sunday", type: "holiday", rule: { kind: "easterOffset", offset: 0 }, infoEn: "Easter Sunday celebrates the resurrection of Jesus in Christian belief. It is a major religious holiday, often marked by church services, Easter eggs, and family meals." },
  { id: "eastermonday", nameEn: "Easter Monday", type: "observance", rule: { kind: "easterOffset", offset: 1 }, infoEn: "Easter Monday is the day after Easter Sunday. It is a public holiday in many countries and is often a day for family outings and spring activities." },
  { id: "mayday", nameEn: "May Day", type: "observance", rule: { kind: "fixed", month: 5, day: 1 }, infoEn: "May Day can refer to International Workers' Day or to traditional spring festivals. In many places it is associated with labor rights and with celebrations of spring." },
  { id: "ascension", nameEn: "Ascension Day", type: "observance", rule: { kind: "easterOffset", offset: 39 }, infoEn: "Ascension Day commemorates the ascension of Jesus into heaven, 40 days after Easter. It is observed in many Christian churches." },
  { id: "pentecost", nameEn: "Pentecost", type: "observance", rule: { kind: "easterOffset", offset: 49 }, infoEn: "Pentecost, or Whitsunday, celebrates the descent of the Holy Spirit upon the apostles. It is a major feast in the Christian calendar." },
  { id: "usmemorial", nameEn: "Memorial Day (US)", type: "observance", description: "Last Monday of May", rule: { kind: "nthWeekday", month: 5, weekday: 0, n: -1 }, infoEn: "Memorial Day in the United States honors military personnel who died in service. It is observed on the last Monday of May with ceremonies and remembrance." },
  { id: "independence", nameEn: "US Independence Day", type: "holiday", rule: { kind: "fixed", month: 7, day: 4 }, infoEn: "Independence Day marks the adoption of the Declaration of Independence in 1776. Americans celebrate with parades, fireworks, and family gatherings." },
  { id: "thanksgiving", nameEn: "Thanksgiving (US)", type: "holiday", description: "4th Thursday of November", rule: { kind: "nthWeekday", month: 11, weekday: 3, n: 4 }, infoEn: "Thanksgiving is a national holiday in the United States and Canada, focused on gratitude and harvest. Families typically gather for a large meal, often featuring turkey." },
  { id: "halloween", nameEn: "Halloween", type: "tradition", rule: { kind: "fixed", month: 10, day: 31 }, infoEn: "Halloween is celebrated with costumes, trick-or-treating, and decorations. It has roots in ancient harvest and remembrance customs." },
  { id: "allaints", nameEn: "All Saints' Day", type: "observance", rule: { kind: "fixed", month: 11, day: 1 }, infoEn: "All Saints' Day honors all Christian saints. It is observed in many churches, especially in Catholic and Anglican traditions." },
  { id: "christmas", nameEn: "Christmas", type: "holiday", rule: { kind: "fixed", month: 12, day: 25 }, infoEn: "Christmas is the Christian feast of the birth of Jesus. It is a public holiday in many countries and is widely celebrated with gifts, meals, and religious services." },
  { id: "boxing", nameEn: "Boxing Day", type: "observance", rule: { kind: "fixed", month: 12, day: 26 }, infoEn: "Boxing Day is observed in the UK, Canada, and other Commonwealth countries. Traditionally a day for giving to servants and charity, it is now often a shopping and sports day." },
  { id: "newyeareve", nameEn: "New Year's Eve", type: "observance", rule: { kind: "fixed", month: 12, day: 31 }, infoEn: "New Year's Eve is the last night of the year. Many people celebrate with parties, countdowns, and fireworks at midnight." },
];

export function getGregorianHolidaysForDay(
  year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  const easter = getEasterYear(year);

  for (const h of GREGORIAN_HOLIDAYS) {
    if (h.rule.kind === "fixed") {
      if (h.rule.month === month && h.rule.day === day) result.push(toEntry(h));
    } else if (h.rule.kind === "easterOffset") {
      const ed = new Date(year, easter.month - 1, easter.day);
      ed.setDate(ed.getDate() + h.rule.offset);
      if (ed.getFullYear() === year && ed.getMonth() + 1 === month && ed.getDate() === day) result.push(toEntry(h));
    } else if (h.rule.kind === "nthWeekday") {
      const d = getNthWeekdayDate(year, month, h.rule.weekday, h.rule.n);
      if (d === day) result.push(toEntry(h));
    }
  }
  return result;
}
