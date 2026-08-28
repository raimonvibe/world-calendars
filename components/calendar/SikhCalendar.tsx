"use client";

import StructuredYear from "./StructuredYear";

type SikhCalendarProps = {
  year: number;
};

/** Sikh (Nanakshahi): fixed solar months; Chet 1 is always 14 March. */
export default function SikhCalendar({ year }: SikhCalendarProps) {
  return <StructuredYear calendarId="sikh" year={year} yearSuffix="NS" label="Sikh (Nanakshahi)" />;
}
