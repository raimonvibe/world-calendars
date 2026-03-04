import type { HolidayEntry } from "./types";

/**
 * Mayan calendar: no standard "month" view (Long Count / Tzolkin / Haab).
 * Month view is not available for Mayan; this stub returns [] for consistency.
 */
export function getMayanHolidaysForDay(
  _year: number,
  _month: number,
  _day: number
): HolidayEntry[] {
  return [];
}
