/**
 * Holiday and observance types for month view.
 * Rules are calendar-specific; resolution is in per-calendar modules.
 */

export type HolidayType = "holiday" | "observance" | "tradition" | "fast" | "other";

export type HolidayEntry = {
  id: string;
  nameEn: string;
  nameOriginal?: string;
  type: HolidayType;
  /** Short description or tradition (optional) */
  description?: string;
  /** Full English description: 1–3 sentences. */
  infoEn?: string;
  /** Optional link for further reading. */
  infoUrl?: string;
};

/** Fixed date in that calendar (month 1–12 or 1–13, day 1–31) */
export type RuleFixed = {
  kind: "fixed";
  month: number;
  day: number;
};

/** Nth weekday of month (e.g. 4th Thursday = US Thanksgiving) */
export type RuleNthWeekday = {
  kind: "nthWeekday";
  month: number;
  weekday: number; // 0 = Monday, 6 = Sunday
  n: number; // 1 = first, 2 = second, -1 = last
};

/** Days from Easter Sunday (Gregorian); e.g. -2 = Good Friday */
export type RuleEasterOffset = {
  kind: "easterOffset";
  offset: number;
};

export type HolidayDateRule = RuleFixed | RuleNthWeekday | RuleEasterOffset;

export type HolidayDefinition = {
  id: string;
  nameEn: string;
  nameOriginal?: string;
  type: HolidayType;
  description?: string;
  /** Full English description: 1–3 sentences. */
  infoEn?: string;
  /** Optional link for further reading. */
  infoUrl?: string;
  rule: HolidayDateRule;
};
