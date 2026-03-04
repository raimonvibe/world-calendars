import type { CalendarId } from "@/lib/types";
import type { HolidayEntry } from "./types";
import { getGregorianHolidaysForDay } from "./gregorian";
import { getIslamicHolidaysForDay } from "./islamic";
import { getHebrewHolidaysForDay } from "./hebrew";
import { getPersianHolidaysForDay } from "./persian";
import { getChineseHolidaysForDay } from "./chinese";
import { getEthiopianHolidaysForDay } from "./ethiopian";
import { getBuddhistHolidaysForDay } from "./buddhist";
import { getSikhHolidaysForDay } from "./sikh";
import { getJapaneseHolidaysForDay } from "./japanese";
import { getBahaiHolidaysForDay } from "./bahai";
import { getHinduHolidaysForDay } from "./hindu";
import { getCopticHolidaysForDay } from "./coptic";
import { getJavaneseHolidaysForDay } from "./javanese";
import { getArmenianHolidaysForDay } from "./armenian";
import { getAssyrianHolidaysForDay } from "./assyrian";
import { getMayanHolidaysForDay } from "./mayan";

/**
 * Returns holidays/observances for a given day in the specified calendar.
 * month is 1-based; for Hebrew it is the display order index (1–13), not the Hebrew month number.
 */
export function getHolidaysForDay(
  calendarId: CalendarId,
  year: number,
  month: number,
  day: number
): HolidayEntry[] {
  switch (calendarId) {
    case "gregorian":
      return getGregorianHolidaysForDay(year, month, day);
    case "islamic":
      return getIslamicHolidaysForDay(year, month, day);
    case "hebrew":
      return getHebrewHolidaysForDay(year, month, day);
    case "persian":
      return getPersianHolidaysForDay(year, month, day);
    case "chinese":
    case "korean":
      return getChineseHolidaysForDay(year, month, day);
    case "ethiopian":
      return getEthiopianHolidaysForDay(year, month, day);
    case "buddhist":
    case "thai-solar":
      return getBuddhistHolidaysForDay(year, month, day);
    case "sikh":
      return getSikhHolidaysForDay(year, month, day);
    case "japanese":
      return getJapaneseHolidaysForDay(year, month, day);
    case "bahai":
      return getBahaiHolidaysForDay(year, month, day);
    case "hindu":
      return getHinduHolidaysForDay(year, month, day);
    case "coptic":
      return getCopticHolidaysForDay(year, month, day);
    case "javanese":
      return getJavaneseHolidaysForDay(year, month, day);
    case "armenian":
      return getArmenianHolidaysForDay(year, month, day);
    case "assyrian":
      return getAssyrianHolidaysForDay(year, month, day);
    case "mayan":
      return getMayanHolidaysForDay(year, month, day);
    default:
      return [];
  }
}

export type { HolidayEntry, HolidayType, HolidayDefinition, HolidayDateRule } from "./types";
