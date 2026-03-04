import type { HolidayDefinition, HolidayEntry } from "./types";

/** Javanese: Sura=1, Sapar=2, ..., Dulkangidah=12. Same 12-month structure; key observances. */
const JAVANESE_HOLIDAYS: HolidayDefinition[] = [
  { id: "suro", nameEn: "1 Suro (Javanese New Year)", nameOriginal: "1 Suro", type: "tradition", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "1 Suro is the first day of the Javanese lunar year (Sura). It is marked by reflection, meditation, and visits to sacred places such as the royal courts of Yogyakarta and Surakarta. Many avoid travel and hold all-night vigils (tirakatan)." },
  { id: "mulud", nameEn: "Sekaten / Mulud", nameOriginal: "Sekaten", type: "tradition", description: "Prophet Muhammad's birthday", rule: { kind: "fixed", month: 3, day: 12 }, infoEn: "Sekaten is a week-long Javanese celebration of the Prophet Muhammad's birthday (Mawlid). The royal gamelan is played at the mosque, and fairs and wayang performances are held. It blends Islamic tradition with Javanese court culture." },
  { id: "independence-id", nameEn: "Indonesian Independence", nameOriginal: "HUT RI", type: "holiday", rule: { kind: "fixed", month: 8, day: 17 }, infoEn: "Indonesian Independence Day (HUT RI) marks the proclamation of independence on 17 August 1945. It is a national holiday with flag ceremonies, games (e.g. panjat pinang), and cultural events across Indonesia." },
  { id: "wayang", nameEn: "Wayang culture", nameOriginal: "Wayang", type: "tradition", rule: { kind: "fixed", month: 10, day: 1 }, infoEn: "Wayang (shadow puppet theatre) is a central part of Javanese culture, often performed at rituals and festivals. This date is used to honour wayang as UNESCO Intangible Cultural Heritage and the role of dalang (puppeteers) in preserving stories and values." },
];

export function getJavaneseHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of JAVANESE_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
