import type { HolidayDefinition, HolidayEntry } from "./types";

/** Baha'i: 19 months. First day of each month = Feast of [Month]. Naw-Rúz = 1 Bahá. */
const BAHAI_MONTH_NAMES = [
  "Bahá", "Jalál", "Jamál", "ʻAẓamat", "Núr", "Raḥmat", "Kalimát", "Kamál", "Asmáʼ",
  "ʻIzzat", "Mashíyyat", "ʻIlm", "Qudrat", "Qawl", "Masáʼil", "Sharaf", "Sulṭán", "Mulk", "ʻAláʼ",
];

const FEAST_INFO_EN = "Each Baha'i month begins with a Feast: a gathering for prayer, consultation, and fellowship. The nineteen Feasts anchor the Baha'i calendar and strengthen community life.";

function getBahaiHolidayDefinitions(): HolidayDefinition[] {
  const list: HolidayDefinition[] = [
    { id: "naw-ruz", nameEn: "Naw-Rúz", nameOriginal: "نوروز بهائی", type: "holiday", description: "Baha'i New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Naw-Rúz is the Baha'i New Year, coinciding with the spring equinox in the Baha'i calendar. It is a day of joy, renewal, and celebration. Baha'is gather for prayer and festivities, and it is one of nine holy days when work is suspended." },
  ];
  for (let m = 1; m <= 19; m++) {
    list.push({
      id: `feast-${m}`,
      nameEn: `Feast of ${BAHAI_MONTH_NAMES[m - 1]}`,
      type: "observance",
      rule: { kind: "fixed", month: m, day: 1 },
      infoEn: FEAST_INFO_EN,
    });
  }
  return list;
}

const BAHAI_HOLIDAYS = getBahaiHolidayDefinitions();

export function getBahaiHolidaysForDay(
  _year: number,
  month: number,
  day: number
): HolidayEntry[] {
  const result: HolidayEntry[] = [];
  for (const h of BAHAI_HOLIDAYS) {
    if (h.rule.kind === "fixed" && h.rule.month === month && h.rule.day === day) {
      result.push({ id: h.id, nameEn: h.nameEn, nameOriginal: h.nameOriginal, type: h.type, description: h.description, infoEn: h.infoEn, infoUrl: h.infoUrl });
    }
  }
  return result;
}
