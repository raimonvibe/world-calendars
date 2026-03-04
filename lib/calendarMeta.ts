/**
 * Metadata per calendar: countries where used, Lucide icon name for visual.
 */

import type { LucideIcon } from "lucide-react";
import {
  Calendar as CalendarIcon,
  Moon,
  Rabbit,
  BookOpen,
  Star,
  Mountain,
  Sun,
  Landmark,
  Flower2,
  Church,
  Palette,
  CalendarDays,
  Sparkles,
  BookMarked,
  ScrollText,
  CalendarRange,
  Globe,
  History,
} from "lucide-react";

export type CalendarId =
  | "gregorian" | "islamic" | "chinese" | "hindu" | "hebrew" | "ethiopian"
  | "persian" | "japanese" | "buddhist" | "coptic" | "thai-solar" | "korean"
  | "javanese" | "armenian" | "mayan" | "bahai" | "sikh" | "assyrian";

/** Display name per calendar (for headers, titles). */
export const CALENDAR_NAMES: Record<CalendarId, string> = {
  gregorian: "Gregorian",
  islamic: "Islamic (Hijri)",
  chinese: "Chinese (Lunar)",
  hindu: "Hindu (Vikram Samvat)",
  hebrew: "Hebrew",
  ethiopian: "Ethiopian",
  persian: "Persian (Solar Hijri)",
  japanese: "Japanese",
  buddhist: "Buddhist",
  coptic: "Coptic",
  "thai-solar": "Thai Solar",
  korean: "Korean (Lunar-Solar)",
  javanese: "Javanese",
  armenian: "Armenian",
  mayan: "Mayan",
  bahai: "Baha'i",
  sikh: "Sikh (Nanakshahi)",
  assyrian: "Assyrian",
};

/** Countries/regions where each calendar is used (English text). */
export const CALENDAR_COUNTRIES: Record<CalendarId, string> = {
  gregorian: "Worldwide (international standard)",
  islamic: "Saudi Arabia, Iran, Pakistan, Indonesia, Malaysia, Egypt, Iraq, Morocco, Algeria, UAE, Turkey",
  chinese: "China, Taiwan, Hong Kong, Singapore, Vietnam, Korea (festivals), overseas Chinese communities",
  hindu: "India (North), Nepal",
  hebrew: "Israel, Jewish communities worldwide",
  ethiopian: "Ethiopia, Eritrea",
  persian: "Iran, Afghanistan",
  japanese: "Japan",
  buddhist: "Thailand, Cambodia, Laos, Myanmar, Sri Lanka",
  coptic: "Egypt (Coptic Church)",
  "thai-solar": "Thailand",
  korean: "Korea (North & South for traditional festivals)",
  javanese: "Indonesia (Java)",
  armenian: "Armenia, Armenian diaspora",
  mayan: "Guatemala, Belize, Mexico, Honduras (indigenous communities)",
  bahai: "Baha'i communities worldwide",
  sikh: "India (Punjab), Sikh communities worldwide",
  assyrian: "Iraq, Syria, Turkey, Iran (Assyrian/Syriac communities)",
};

/** Lucide icon component per calendar (for drawings/visual). */
export const CALENDAR_ICONS: Record<CalendarId, LucideIcon> = {
  gregorian: CalendarIcon,
  islamic: Moon,
  chinese: Rabbit,
  hindu: BookOpen,
  hebrew: Star,
  ethiopian: Mountain,
  persian: Sun,
  japanese: Landmark,
  buddhist: Flower2,
  coptic: Church,
  "thai-solar": Sun,
  korean: CalendarDays,
  javanese: Palette,
  armenian: CalendarRange,
  mayan: Globe,
  bahai: Sparkles,
  sikh: BookMarked,
  assyrian: History,
};
