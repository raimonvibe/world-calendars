import type { HolidayDefinition, HolidayEntry } from "./types";

const ISLAMIC_HOLIDAYS: HolidayDefinition[] = [
  { id: "muharram1", nameEn: "Islamic New Year", nameOriginal: "رأس السنة الهجرية", type: "holiday", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "The Islamic New Year marks the first day of Muharram and the Hijri calendar. It commemorates the emigration of the Prophet Muhammad from Mecca to Medina. Many Muslims use the day for reflection and prayer." },
  { id: "ashura", nameEn: "Ashura", nameOriginal: "عاشوراء", type: "observance", rule: { kind: "fixed", month: 1, day: 10 }, infoEn: "Ashura is observed on the 10th of Muharram. For Sunni Muslims it marks the day Moses and the Israelites were saved from Pharaoh; for many Shia it is a day of mourning for the martyrdom of Imam Hussein at Karbala." },
  { id: "arbaeen-islamic", nameEn: "Arbaeen", nameOriginal: "اربعین", type: "observance", rule: { kind: "fixed", month: 2, day: 20 }, infoEn: "Arbaeen is observed 40 days after Ashura (20 Safar). Shia Muslims commemorate the martyrdom of Imam Hussein at Karbala with pilgrimage, processions, and mourning gatherings worldwide." },
  { id: "mawlid", nameEn: "Mawlid an-Nabi", nameOriginal: "المولد النبوي", type: "holiday", description: "Prophet's birthday", rule: { kind: "fixed", month: 3, day: 12 }, infoEn: "Mawlid an-Nabi celebrates the birthday of the Prophet Muhammad. It is observed with prayers, recitations, and in some regions with processions and charitable acts." },
  { id: "laylat-miraj", nameEn: "Laylat al-Mi'raj", nameOriginal: "لیلة المعراج", type: "observance", rule: { kind: "fixed", month: 7, day: 27 }, infoEn: "Laylat al-Mi'raj (27 Rajab) commemorates the Prophet's night journey from Mecca to Jerusalem and ascension to heaven. Muslims observe it with prayer and reflection on the gift of the five daily prayers." },
  { id: "laylat-baraah", nameEn: "Laylat al-Bara'ah", nameOriginal: "لیلة البراءة", type: "observance", rule: { kind: "fixed", month: 8, day: 15 }, infoEn: "Laylat al-Bara'ah (15 Sha'ban), also called Shab-e-Barat, is a night of forgiveness and prayer. Many Muslims seek mercy, remember the dead, and prepare for Ramadan." },
  { id: "ramadan1", nameEn: "First day of Ramadan", nameOriginal: "رمضان", type: "fast", rule: { kind: "fixed", month: 9, day: 1 }, infoEn: "Ramadan is the ninth month of the Islamic calendar, when Muslims fast from dawn to sunset. The first day begins a month of worship, reflection, and community." },
  { id: "eid-fitr", nameEn: "Eid al-Fitr", nameOriginal: "عيد الفطر", type: "holiday", rule: { kind: "fixed", month: 10, day: 1 }, infoEn: "Eid al-Fitr marks the end of Ramadan. It is a day of celebration, prayer, feasting, and giving. Muslims often wear new clothes, give gifts, and share meals with family and the needy." },
  { id: "eid-adha", nameEn: "Eid al-Adha", nameOriginal: "عيد الأضحى", type: "holiday", rule: { kind: "fixed", month: 12, day: 10 }, infoEn: "Eid al-Adha, the Festival of Sacrifice, commemorates Ibrahim's willingness to sacrifice his son. It is marked by prayer, the sacrifice of an animal, and sharing meat with family and the poor." },
];

export function getIslamicHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of ISLAMIC_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
