import { redirect } from "next/navigation";
import { CALENDAR_IDS } from "@/lib/calendars";
import { clampYearToRange, getDefaultYearForCalendar } from "@/lib/calendarViews";
import type { CalendarId } from "@/lib/types";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import { getCalendarComponent } from "@/components/calendar";

type PageProps = {
  params: Promise<{ calendarId: string }>;
  searchParams: Promise<{ year?: string }>;
};

function isValidCalendarId(id: string): id is CalendarId {
  return (CALENDAR_IDS as readonly string[]).includes(id);
}

export default async function CalendarPage({ params, searchParams }: PageProps) {
  const { calendarId } = await params;
  const { year: yearParam } = await searchParams;

  if (!isValidCalendarId(calendarId)) {
    redirect("/");
  }

  const defaultYear = getDefaultYearForCalendar(calendarId);
  const year = yearParam ? parseInt(yearParam, 10) : defaultYear;
  // Clamping rather than 404ing keeps hand-typed ?year= values usable, while
  // still guaranteeing the rendered prev/next links stay inside the window.
  const safeYear = clampYearToRange(calendarId, year);

  const CalendarComponent = getCalendarComponent(calendarId);

  return (
    <CalendarLayout calendarId={calendarId} year={safeYear}>
      <CalendarComponent year={safeYear} />
    </CalendarLayout>
  );
}
