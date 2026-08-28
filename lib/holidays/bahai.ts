import type { HolidayDefinition, HolidayEntry } from "./types";
import { BAHAI_MONTHS, BAHAI_AYYAM_I_HA_INDEX, BAHAI_MONTHS_IN_YEAR } from "@/lib/traditionalCalendars";

/**
 * Baha'i: the first day of each of the 19 months is a Feast, and Naw-Ruz is
 * 1 Baha. Month numbering follows lib/traditionalCalendars, where Ayyam-i-Ha
 * occupies slot 19 and the month of the fast is slot 20 - so the names come
 * from there rather than from a second list that would silently disagree.
 */
const FEAST_INFO_EN = "Each Baha'i month begins with a Feast: a gathering for prayer, consultation, and fellowship. The nineteen Feasts anchor the Baha'i calendar and strengthen community life.";

function getBahaiHolidayDefinitions(): HolidayDefinition[] {
  const list: HolidayDefinition[] = [
    { id: "naw-ruz", nameEn: "Naw-Rúz", nameOriginal: "نوروز بهائی", type: "holiday", description: "Baha'i New Year", rule: { kind: "fixed", month: 1, day: 1 }, infoEn: "Naw-Rúz is the Baha'i New Year, coinciding with the spring equinox in the Baha'i calendar. It is a day of joy, renewal, and celebration. Baha'is gather for prayer and festivities, and it is one of nine holy days when work is suspended." },
  ];
  for (let m = 1; m <= BAHAI_MONTHS_IN_YEAR; m++) {
    // Ayyam-i-Ha is intercalary, not a month, so it has no Feast.
    if (m === BAHAI_AYYAM_I_HA_INDEX) continue;
    list.push({
      id: `feast-${m}`,
      nameEn: `Feast of ${BAHAI_MONTHS[m - 1]}`,
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
