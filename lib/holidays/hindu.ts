import type { HolidayDefinition, HolidayEntry } from "./types";

/** Hindu (Vikram Samvat): Chaitra=1, Vaisakha=2, ..., Phalguna=12. Dates approximate (lunar). */
const HINDU_HOLIDAYS: HolidayDefinition[] = [
  { id: "chaitra-1", nameEn: "Chaitra Navaratri start", nameOriginal: "चैत्र नवरात्रि", type: "observance", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Chaitra Navaratri is a nine-night festival at the start of the Hindu lunar year, dedicated to the goddess Durga. Devotees fast, pray, and perform rituals. It culminates in Ram Navami, the birthday of Lord Rama." },
  { id: "vaisakhi-hindu", nameEn: "Vaisakhi", nameOriginal: "वैशाखी", type: "holiday", rule: { kind: "fixed", month: 2, day: 1 }, infoEn: "Vaisakhi (Vaisakha Sankranti) marks the solar New Year in many North Indian calendars and the start of the harvest season. It is celebrated with temple visits, fairs, and bathing in sacred rivers. In Punjab it also coincides with the Sikh Vaisakhi." },
  { id: "budha-purnima", nameEn: "Buddha Purnima", nameOriginal: "बुद्ध पूर्णिमा", type: "observance", rule: { kind: "fixed", month: 2, day: 15 }, infoEn: "Buddha Purnima (Vesak) is the full moon day when Buddhists and many Hindus honour the birth, enlightenment, and passing of the Buddha. Observances include temple visits, meditation, and acts of compassion." },
  { id: "navaratri", nameEn: "Navaratri (start)", nameOriginal: "नवरात्रि", type: "observance", rule: { kind: "fixed", month: 7, day: 1 }, infoEn: "Sharad Navaratri is a nine-night autumn festival honouring the goddess Durga. Each night is associated with a form of the goddess. It is observed with fasting, dance (e.g. garba and dandiya), and devotional music." },
  { id: "dussehra", nameEn: "Dussehra", nameOriginal: "दशहरा", type: "holiday", rule: { kind: "fixed", month: 7, day: 10 }, infoEn: "Dussehra (Vijayadashami) marks the victory of Rama over Ravana and of Durga over the buffalo demon. Effigies of Ravana are burned, and the day is considered auspicious for new ventures. It ends the nine nights of Navaratri." },
  { id: "diwali", nameEn: "Diwali", nameOriginal: "दीपावली", type: "holiday", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "Diwali, the Festival of Lights, celebrates the return of Lord Rama and the victory of light over darkness. Homes are lit with oil lamps (diyas), and families share sweets and gifts. It is one of the major Hindu festivals and is also observed by Jains and Sikhs." },
  { id: "holi", nameEn: "Holi", nameOriginal: "होली", type: "holiday", rule: { kind: "fixed", month: 12, day: 15 }, infoEn: "Holi is the festival of colours and spring. People throw coloured powder and water, sing and dance, and celebrate the triumph of good over evil (e.g. the story of Prahlad and Holika). It is celebrated across India and the diaspora." },
];

export function getHinduHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of HINDU_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
