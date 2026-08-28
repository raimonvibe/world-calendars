"use client";

import StructuredYear from "./StructuredYear";

type HinduCalendarProps = {
  year: number;
};

/** Indian National (Saka): India's official civil calendar; the year begins at Chaitra. */
export default function HinduCalendar({ year }: HinduCalendarProps) {
  return <StructuredYear calendarId="hindu" year={year} yearSuffix="Saka" label="Indian National (Saka)" />;
}
