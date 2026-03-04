/**
 * Conversion logic: given a Gregorian date and target calendar id, return the date string in that calendar.
 * Reuses the same getters as calendars.ts.
 */

import { getCalendarInfo, CALENDAR_IDS } from "./calendars";
import type { CalendarId } from "./types";

/**
 * Convert a Gregorian date to the given calendar system.
 * Returns the display string for that calendar.
 */
export function convertToCalendar(gregorianDate: Date, targetCalendarId: CalendarId): string {
  const info = getCalendarInfo(targetCalendarId, gregorianDate);
  return info.dateString;
}

export { CALENDAR_IDS };
