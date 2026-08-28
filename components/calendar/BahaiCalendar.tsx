"use client";

import StructuredYear from "./StructuredYear";

type BahaiCalendarProps = {
  year: number;
};

/** Baha'i (Badi'): 19 months of 19 days, with Ayyam-i-Ha before the month of the fast. */
export default function BahaiCalendar({ year }: BahaiCalendarProps) {
  return <StructuredYear calendarId="bahai" year={year} yearSuffix="BE" label="Baha'i" />;
}
