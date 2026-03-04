/**
 * Per-calendar linear gradient (and optional accent) for full calendar view.
 */

import type { CalendarId } from "@/lib/types";

/** CSS linear-gradient value for each calendar's full-view background. */
export const CALENDAR_GRADIENTS: Record<CalendarId, string> = {
  gregorian:
    "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #f8fafc 100%)",
  islamic:
    "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)",
  chinese:
    "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #fef2f2 100%)",
  hindu:
    "linear-gradient(135deg, #064e3b 0%, #047857 50%, #a7f3d0 100%)",
  hebrew:
    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #dbeafe 100%)",
  ethiopian:
    "linear-gradient(135deg, #14532d 0%, #22c55e 50%, #dcfce7 100%)",
  persian:
    "linear-gradient(135deg, #1e40af 0%, #60a5fa 50%, #eff6ff 100%)",
  japanese:
    "linear-gradient(135deg, #831843 0%, #ec4899 50%, #fce7f3 100%)",
  buddhist:
    "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #ede9fe 100%)",
  coptic:
    "linear-gradient(135deg, #1e293b 0%, #475569 50%, #f1f5f9 100%)",
  "thai-solar":
    "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #ccfbf1 100%)",
  korean:
    "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 50%, #e0f2fe 100%)",
  javanese:
    "linear-gradient(135deg, #422006 0%, #ca8a04 50%, #fef9c3 100%)",
  armenian:
    "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #ffedd5 100%)",
  mayan:
    "linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #99f6e4 100%)",
  bahai:
    "linear-gradient(135deg, #4a044e 0%, #c026d3 50%, #fae8ff 100%)",
  sikh:
    "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fef3c7 100%)",
  assyrian:
    "linear-gradient(135deg, #1c1917 0%, #78716c 50%, #e7e5e4 100%)",
};

/** Dark-mode variant gradients (optional; layout can switch by theme). */
export const CALENDAR_GRADIENTS_DARK: Record<CalendarId, string> = {
  gregorian:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  islamic:
    "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
  chinese:
    "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #1c1917 100%)",
  hindu:
    "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #134e4a 100%)",
  hebrew:
    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)",
  ethiopian:
    "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
  persian:
    "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #1e293b 100%)",
  japanese:
    "linear-gradient(135deg, #500724 0%, #831843 50%, #1f2937 100%)",
  buddhist:
    "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #1e293b 100%)",
  coptic:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  "thai-solar":
    "linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #164e63 100%)",
  korean:
    "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
  javanese:
    "linear-gradient(135deg, #292524 0%, #422006 50%, #1c1917 100%)",
  armenian:
    "linear-gradient(135deg, #431407 0%, #7c2d12 50%, #1c1917 100%)",
  mayan:
    "linear-gradient(135deg, #042f2e 0%, #134e4a 50%, #164e63 100%)",
  bahai:
    "linear-gradient(135deg, #3b0764 0%, #4a044e 50%, #1e293b 100%)",
  sikh:
    "linear-gradient(135deg, #422006 0%, #78350f 50%, #1c1917 100%)",
  assyrian:
    "linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #292524 100%)",
};

/** Accent color (hex) per calendar for borders and highlights (e.g. holiday info panel). */
export const CALENDAR_ACCENT: Record<CalendarId, string> = {
  gregorian: "#0ea5e9",
  islamic: "#2d5a87",
  chinese: "#b91c1c",
  hindu: "#047857",
  hebrew: "#3b82f6",
  ethiopian: "#22c55e",
  persian: "#60a5fa",
  japanese: "#ec4899",
  buddhist: "#8b5cf6",
  coptic: "#475569",
  "thai-solar": "#14b8a6",
  korean: "#0ea5e9",
  javanese: "#ca8a04",
  armenian: "#ea580c",
  mayan: "#0d9488",
  bahai: "#c026d3",
  sikh: "#f59e0b",
  assyrian: "#78716c",
};
