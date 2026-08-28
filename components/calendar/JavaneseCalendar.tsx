"use client";

import StructuredYear from "./StructuredYear";

type JavaneseCalendarProps = {
  year: number;
};

/** Javanese: Anno Javanico, a tabular lunar calendar of 354 or 355 days. */
export default function JavaneseCalendar({ year }: JavaneseCalendarProps) {
  return <StructuredYear calendarId="javanese" year={year} yearSuffix="AJ" label="Javanese" />;
}
