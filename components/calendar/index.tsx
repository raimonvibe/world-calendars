import type { CalendarId } from "@/lib/types";
import GregorianCalendar from "./GregorianCalendar";
import IslamicCalendar from "./IslamicCalendar";
import ChineseCalendar from "./ChineseCalendar";
import HinduCalendar from "./HinduCalendar";
import HebrewCalendar from "./HebrewCalendar";
import EthiopianCalendar from "./EthiopianCalendar";
import PersianCalendar from "./PersianCalendar";
import JapaneseCalendar from "./JapaneseCalendar";
import BuddhistCalendar from "./BuddhistCalendar";
import CopticCalendar from "./CopticCalendar";
import ThaiSolarCalendar from "./ThaiSolarCalendar";
import KoreanCalendar from "./KoreanCalendar";
import JavaneseCalendar from "./JavaneseCalendar";
import ArmenianCalendar from "./ArmenianCalendar";
import MayanCalendar from "./MayanCalendar";
import BahaiCalendar from "./BahaiCalendar";
import SikhCalendar from "./SikhCalendar";
import AssyrianCalendar from "./AssyrianCalendar";

export type CalendarComponentProps = {
  year: number;
};

type CalendarComponent = React.ComponentType<CalendarComponentProps>;

const CALENDAR_COMPONENTS: Record<CalendarId, CalendarComponent> = {
  gregorian: GregorianCalendar,
  islamic: IslamicCalendar,
  chinese: ChineseCalendar,
  hindu: HinduCalendar,
  hebrew: HebrewCalendar,
  ethiopian: EthiopianCalendar,
  persian: PersianCalendar,
  japanese: JapaneseCalendar,
  buddhist: BuddhistCalendar,
  coptic: CopticCalendar,
  "thai-solar": ThaiSolarCalendar,
  korean: KoreanCalendar,
  javanese: JavaneseCalendar,
  armenian: ArmenianCalendar,
  mayan: MayanCalendar,
  bahai: BahaiCalendar,
  sikh: SikhCalendar,
  assyrian: AssyrianCalendar,
};

export function getCalendarComponent(
  calendarId: CalendarId
): CalendarComponent {
  return CALENDAR_COMPONENTS[calendarId];
}

export { default as CalendarLayout } from "./CalendarLayout";
export { default as DayCell } from "./DayCell";
export { default as MonthGrid } from "./MonthGrid";
export { default as GregorianCalendar } from "./GregorianCalendar";
export { default as IslamicCalendar } from "./IslamicCalendar";
export { default as ChineseCalendar } from "./ChineseCalendar";
export { default as HinduCalendar } from "./HinduCalendar";
export { default as HebrewCalendar } from "./HebrewCalendar";
export { default as EthiopianCalendar } from "./EthiopianCalendar";
export { default as PersianCalendar } from "./PersianCalendar";
export { default as JapaneseCalendar } from "./JapaneseCalendar";
export { default as BuddhistCalendar } from "./BuddhistCalendar";
export { default as CopticCalendar } from "./CopticCalendar";
export { default as ThaiSolarCalendar } from "./ThaiSolarCalendar";
export { default as KoreanCalendar } from "./KoreanCalendar";
export { default as JavaneseCalendar } from "./JavaneseCalendar";
export { default as ArmenianCalendar } from "./ArmenianCalendar";
export { default as MayanCalendar } from "./MayanCalendar";
export { default as BahaiCalendar } from "./BahaiCalendar";
export { default as SikhCalendar } from "./SikhCalendar";
export { default as AssyrianCalendar } from "./AssyrianCalendar";
