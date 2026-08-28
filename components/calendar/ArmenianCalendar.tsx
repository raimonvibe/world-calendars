"use client";

import StructuredYear from "./StructuredYear";

type ArmenianCalendarProps = {
  year: number;
};

/** Armenian: the traditional 365-day wandering year, epoch 11 July 552 CE. */
export default function ArmenianCalendar({ year }: ArmenianCalendarProps) {
  return <StructuredYear calendarId="armenian" year={year} label="Armenian" />;
}
