import { redirect } from "next/navigation";
import { CALENDAR_IDS } from "@/lib/calendars";
import { getMonthInfo, getTodayDayInMonth, MONTH_RANGES } from "@/lib/calendarViews";
import type { CalendarId } from "@/lib/types";
import MonthViewLayout from "@/components/calendar/MonthViewLayout";
import MonthView from "@/components/calendar/MonthView";

type PageProps = {
  params: Promise<{ calendarId: string; year: string; month: string }>;
};

function isValidCalendarId(id: string): id is CalendarId {
  return (CALENDAR_IDS as readonly string[]).includes(id);
}

export default async function MonthPage({ params }: PageProps) {
  const { calendarId, year: yearParam, month: monthParam } = await params;

  if (!isValidCalendarId(calendarId)) {
    redirect("/");
  }

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    redirect(`/calendar/${calendarId}?year=${yearParam || new Date().getFullYear()}`);
  }

  const monthInfo = getMonthInfo(calendarId, year, month);
  if (!monthInfo) {
    redirect(`/calendar/${calendarId}?year=${year}`);
  }

  const todayDay = getTodayDayInMonth(calendarId, year, month);

  const maxMonth = MONTH_RANGES[calendarId] ?? 12;
  const monthOptions = Array.from({ length: maxMonth }, (_, i) => {
    const m = i + 1;
    const info = getMonthInfo(calendarId, year, m);
    return { value: m, label: info ? info.monthNameEn : `Month ${m}` };
  });

  return (
    <MonthViewLayout
      calendarId={calendarId}
      year={year}
      month={month}
      monthNameEn={monthInfo.monthNameEn}
      monthNameOriginal={monthInfo.monthNameOriginal}
      monthOptions={monthOptions}
    >
      <MonthView
        calendarId={calendarId}
        year={year}
        month={month}
        monthInfo={monthInfo}
        todayDay={todayDay}
      />
    </MonthViewLayout>
  );
}
