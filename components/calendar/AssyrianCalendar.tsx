"use client";

import StructuredYear from "./StructuredYear";

type AssyrianCalendarProps = {
  year: number;
};

/** Assyrian/Syriac: Gregorian month lengths, but the year begins on 1 April. */
export default function AssyrianCalendar({ year }: AssyrianCalendarProps) {
  return <StructuredYear calendarId="assyrian" year={year} label="Assyrian" />;
}
