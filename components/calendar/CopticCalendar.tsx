"use client";

import StructuredYear from "./StructuredYear";

type CopticCalendarProps = {
  year: number;
};

/** Coptic: twelve 30-day months plus the short 13th, epoch 284 CE (Era of Martyrs). */
export default function CopticCalendar({ year }: CopticCalendarProps) {
  return <StructuredYear calendarId="coptic" year={year} yearSuffix="AM" label="Coptic" />;
}
