# Plan: Full Calendar View per Calendar Type

## Goal
When a user clicks a calendar card on the homepage, they see a **full calendar view** for that calendar: year view with months, weeks, and days in that system’s format, with original language + English, a unique linear gradient and Lucide icon per calendar, and a responsive layout.

---

## 1. Route & Navigation

| Item | Proposal |
|------|----------|
| **Route** | `/calendar/[calendarId]` (e.g. `/calendar/gregorian`, `/calendar/islamic`) |
| **Entry** | Each homepage `CalendarCard` links to `/calendar/{info.id}`. |
| **Back** | Header “Back to hub” (or Lucide `LayoutGrid`) to homepage. |
| **Same 18 IDs** | Reuse existing: `gregorian`, `islamic`, `chinese`, `hindu`, `hebrew`, `ethiopian`, `persian`, `japanese`, `buddhist`, `coptic`, `thai-solar`, `korean`, `javanese`, `armenian`, `mayan`, `bahai`, `sikh`, `assyrian`. |

---

## 2. Per-Calendar Identity (Gradient, Icon, Language)

| Item | Proposal |
|------|----------|
| **Linear gradient** | One gradient per `calendarId` (e.g. stored in `lib/calendarMeta.ts` or a new `lib/calendarThemes.ts`). Used for page background and/or header. |
| **Lucide icon** | Reuse existing `CALENDAR_ICONS` from `calendarMeta.ts` on the calendar view header. |
| **Languages** | **Primary**: English (month names, day names, numbers). **Secondary**: Original script where we have it (e.g. Hebrew, Arabic, Chinese, Persian numerals). Show both: e.g. “March / Adar” or “15 / ۱۵”. |

---

## 3. Data Model: “Year View” per Calendar

We need a **generic enough** representation that supports:

- Variable **months per year** (12, 13, 19, etc.).
- Variable **days per month** (28–31, 29–30, 19, etc.).
- **Leap months** (e.g. Chinese, Hebrew).
- **Week structure**: 7-day week (most), or other (e.g. Baha’i 19-day “weeks”).
- **Labels**: month names and day-of-week names in English + optional original.

Proposed **lib** shape (to implement later):

- **`lib/calendarViews.ts`** (or split by calendar):
  - `getYearStructure(calendarId, year)` → list of months; each month has: `nameEn`, `nameOriginal?`, `daysCount`, `isLeapMonth?`, `firstWeekday?`, etc.
  - `getDayOfWeekNames(calendarId)` → array of 7 (or N) day names in English and optional original.
  - For some calendars (e.g. Mayan Long Count), “year view” might be a different UI (cycles) — same plan file can note that.

Libraries to use where we already have them:

- **Gregorian**: Luxon (month lengths, week start).
- **Islamic**: hijri-date (month lengths 29/30, Umm al-Qura).
- **Chinese**: chinese-lunar (months, leap month).
- **Hebrew**: @hebcal/core (months, leap year, day names).
- **Persian**: Luxon `outputCalendar: 'persian'` for month lengths.
- **Others**: Extend existing `lib/calendars.ts` logic or add small helpers (e.g. Buddhist = Gregorian structure; Ethiopian 13 months; Baha’i 19×19; etc.).

---

## 4. UI: Full Calendar View Layout

### 4.1 Page structure (responsive)

- **Header**
  - Back to hub (link + icon).
  - Calendar name + icon.
  - Year selector (e.g. “2026” with prev/next; in that calendar’s year number where different, e.g. Buddhist 2569).
- **Main**
  - **Year view**: 12 (or N) months in a grid. Each cell is a “mini month” (e.g. 7 columns of days + month title).
- **Responsive**
  - **Mobile**: 1 month per row (stack vertically); optional “Month” dropdown to jump.
  - **Tablet**: 2 months per row.
  - **Desktop**: 3 or 4 months per row (full year visible with scroll).
  - Touch-friendly tap targets; avoid tiny day cells (e.g. min height 36px).

### 4.2 Month cell content

- Month title: **English + original** (e.g. “March / Adar”).
- Weekday row: **Mon, Tue, …** (and optional original: “א׳ ב׳ …” or “一 二 …”).
- Day grid: **numbers** in that month; empty cells before first day (offset by `firstWeekday`).
- Today highlight: if the current Gregorian date falls in this month in this calendar, highlight that day (e.g. ring or background).

### 4.3 Different month lengths

- **28–31 days**: Gregorian, Persian, Buddhist/Thai, etc. — classic grid.
- **29–30**: Islamic, Hebrew — same grid, variable length.
- **13 months (30+5)**: Ethiopian — 13 rows or 13 “month” blocks.
- **19×19**: Baha’i — 19 months × 19 days; could be 19 “month” blocks, each a 19-day strip or grid.
- **Long Count / Mayan**: Prefer a **different block** in the same page: explain cycles (baktun, katun, …) and show current position; optional “year” selector by Long Count.

So: one **generic month grid component** that takes “number of days” and “first weekday offset”, plus optional **special layouts** for Baha’i (19×19) and Mayan (explanatory + cycle view).

---

## 5. Responsive & Accessibility

| Aspect | Plan |
|--------|------|
| **Breakpoints** | Reuse Tailwind: `sm`, `md`, `lg`. 1 / 2 / 3–4 month columns. |
| **Touch** | Min day cell size ~36px; padding on month cards. |
| **RTL** | `dir="rtl"` (and `dir="auto"` where we have original script) for Hebrew/Arabic when showing original text. |
| **Labels** | `aria-label` on year control and month blocks; “Calendar: [Calendar name], year [year]”. |
| **Color** | Gradients as enhancement; ensure contrast for text (WCAG). |

---

## 6. File & Component Structure: One File per Calendar Type

**Principle:** Each calendar type has its own component file in `components/calendar/`. The dynamic route page picks the right component by `calendarId`. Shared UI (day cell, month block, layout) can live in shared components or be duplicated per file where layout differs a lot.

### 6.1 Folder layout

```
app/
  calendar/
    [calendarId]/
      page.tsx                    # Renders CalendarLayout + the right *Calendar component

components/
  calendar/
    CalendarLayout.tsx            # Shared: back link, gradient bg, year picker, icon, wrapper
    index.tsx                    # Map calendarId → component (or page does the switch)

    # —— One component file per calendar type (18 files) ——
    GregorianCalendar.tsx
    IslamicCalendar.tsx
    ChineseCalendar.tsx
    HinduCalendar.tsx
    HebrewCalendar.tsx
    EthiopianCalendar.tsx
    PersianCalendar.tsx
    JapaneseCalendar.tsx
    BuddhistCalendar.tsx
    CopticCalendar.tsx
    ThaiSolarCalendar.tsx
    KoreanCalendar.tsx
    JavaneseCalendar.tsx
    ArmenianCalendar.tsx
    MayanCalendar.tsx
    BahaiCalendar.tsx
    SikhCalendar.tsx
    AssyrianCalendar.tsx

    # —— Optional shared building blocks (used by multiple *Calendar.tsx) ——
    MonthGrid.tsx                 # Generic: weekday row + day cells (offset, length)
    DayCell.tsx                  # Single day: number, optional original, today highlight
```

### 6.2 How the page uses them

- **`app/calendar/[calendarId]/page.tsx`**
  - Reads `params.calendarId`.
  - Validates against the 18 known IDs (redirect or 404 if invalid).
  - Renders `<CalendarLayout calendarId={id} year={year}>` and inside it the matching component, e.g. `<GregorianCalendar year={year} />`, `<IslamicCalendar year={year} />`, etc.
  - Year can come from searchParams (e.g. `?year=2026`) or state; default = current year in that calendar.

- **`CalendarLayout`**
  - Receives `calendarId` and `year`.
  - Applies per-calendar linear gradient (from `calendarThemes`).
  - Shows back link, calendar name, Lucide icon, year selector (prev/next).
  - Renders `children` (the specific calendar component).

- **Each `*Calendar.tsx`**
  - Receives `year` (and optionally `calendarId` if needed for labels).
  - Own logic for months/days (can call lib helpers or embed logic).
  - Renders that calendar’s year view: e.g. 12 month blocks, or 13 (Hebrew/Ethiopian), or 19 (Baha’i), or a custom layout (Mayan).
  - Can use shared `MonthGrid` + `DayCell` where the layout is “month with a grid of days,” or implement a custom layout (e.g. Baha’i, Mayan).

### 6.3 Naming convention

- **Component name:** `GregorianCalendar`, `IslamicCalendar`, … (PascalCase, one per file).
- **File name:** `GregorianCalendar.tsx`, `IslamicCalendar.tsx`, … (match component name).
- **Export:** Default export the component (e.g. `export default function GregorianCalendar({ year }: Props) { … }`).

### 6.4 Map: calendarId → component

Keep a single map so the page (or `index`) can switch without a huge if/else:

```ts
// components/calendar/index.tsx (or in page.tsx)
import GregorianCalendar from './GregorianCalendar';
import IslamicCalendar from './IslamicCalendar';
// ... all 18

const CALENDAR_COMPONENTS: Record<CalendarId, React.ComponentType<{ year: number }>> = {
  gregorian: GregorianCalendar,
  islamic: IslamicCalendar,
  chinese: ChineseCalendar,
  // ...
};
```

Then: `const Cal = CALENDAR_COMPONENTS[calendarId]; return <Cal year={year} />;`

---

## 7. Edge Cases & Notes

| Calendar | Notes |
|----------|--------|
| **Chinese** | Leap month: show as “Month X (leap)” and give it a distinct row or label. |
| **Hebrew** | Leap year: 13 months (Adar I, Adar II). Same grid approach, 13 blocks. |
| **Ethiopian** | 13 months (12×30 + 5 or 6 days). 13 month blocks. |
| **Baha'i** | 19 months × 19 days + intercalary. Dedicated 19×19 layout or 19 strips. |
| **Mayan** | Long Count + Tzolkin/Haab. “Year” view = explain current position; optional cycle selector. |
| **Japanese** | Gregorian structure; show era (e.g. Reiwa 8) in header. |
| **Korean** | Same as Chinese for lunar; can reuse Chinese year structure. |
| **Javanese** | Complex cycles; start with simplified “year” (e.g. Gregorian-based) and label as such. |

---

## 8. Start Plan: File-by-File Order

Use this order to create files and wire things up without big rewrites.

### Phase A: Foundation (route + layout + one calendar)

| Step | Action |
|------|--------|
| A1 | Add **`lib/calendarThemes.ts`**: export `CALENDAR_GRADIENTS: Record<CalendarId, string>` (e.g. CSS linear-gradient values or Tailwind class names). One gradient per calendar. |
| A2 | Add **`app/calendar/[calendarId]/page.tsx`**: read `calendarId` and `year` (searchParams or default). Validate `calendarId`; if invalid, redirect to `/` or 404. |
| A3 | Add **`components/calendar/CalendarLayout.tsx`**: props `calendarId`, `year`, `children`. Apply gradient from themes, back link, icon from `calendarMeta`, calendar name, year prev/next. Render `children`. |
| A4 | Add **`components/calendar/GregorianCalendar.tsx`**: props `year`. Build 12 months (Luxon); use a simple grid of month blocks. Can use placeholder content first (e.g. “Month 1 … 12”). |
| A5 | In **`app/calendar/[calendarId]/page.tsx`**: import `GregorianCalendar`; if `calendarId === 'gregorian'` render `<CalendarLayout><GregorianCalendar year={year} /></CalendarLayout>`. Confirm route works and gradient shows. |

### Phase B: Shared building blocks + second calendar

| Step | Action |
|------|--------|
| B1 | Add **`components/calendar/DayCell.tsx`**: props `day`, `isToday?`, `original?` (optional numeral in original script). Single cell styling, responsive min height. |
| B2 | Add **`components/calendar/MonthGrid.tsx`**: props `monthNameEn`, `monthNameOriginal?`, `daysCount`, `firstWeekday`, `year`, `monthIndex` (for “today” check). Weekday row (7 days) + grid of `DayCell`. |
| B3 | Refactor **`GregorianCalendar.tsx`** to use `MonthGrid` for each month (Luxon for lengths and first weekday). |
| B4 | Add **`components/calendar/IslamicCalendar.tsx`**: props `year`. Use hijri-date (or lib) for 12 months, 29/30 days. Use `MonthGrid` for each month. |
| B5 | In **`app/calendar/[calendarId]/page.tsx`**: add branch for `islamic` → `<IslamicCalendar year={year} />`. Use **`components/calendar/index.tsx`** with a map `calendarId → component` to avoid a long switch (see 6.4). |

### Phase C: All 18 calendar components + index

| Step | Action |
|------|--------|
| C1 | Add **`components/calendar/index.tsx`**: export `CALENDAR_COMPONENTS` (or `getCalendarComponent(calendarId)`) and re-export shared pieces. Implement one new `*Calendar.tsx` at a time and register it. |
| C2 | Create the remaining 16 component files: **ChineseCalendar**, **HinduCalendar**, **HebrewCalendar**, **EthiopianCalendar**, **PersianCalendar**, **JapaneseCalendar**, **BuddhistCalendar**, **CopticCalendar**, **ThaiSolarCalendar**, **KoreanCalendar**, **JavaneseCalendar**, **ArmenianCalendar**, **MayanCalendar**, **BahaiCalendar**, **SikhCalendar**, **AssyrianCalendar**. Each can start as a copy of `GregorianCalendar` or `IslamicCalendar` and then adapt (month count, day count, labels, original script). |
| C3 | Add **lib/calendarViews.ts** (or per-calendar helpers) only where needed: e.g. `getYearStructure(calendarId, year)`, `getDayOfWeekNames(calendarId)` if you want to share data logic across components. Optional: some calendars can keep logic inside their own file. |
| C4 | Wire each new component into **`components/calendar/index.tsx`** and ensure **`app/calendar/[calendarId]/page.tsx`** uses the map so every valid `calendarId` renders the right component. |

### Phase D: Special layouts and polish

| Step | Action |
|------|--------|
| D1 | **Baha’i**: In **`BahaiCalendar.tsx`**, implement 19 months × 19 days (custom layout; may not use `MonthGrid` as-is). |
| D2 | **Mayan**: In **`MayanCalendar.tsx`**, implement Long Count / cycle view (explanatory + current position; optional cycle selector). |
| D3 | Responsive: ensure 1 / 2 / 3–4 month columns (Tailwind), touch-friendly day cells. |
| D4 | Original language: add `monthNameOriginal`, `dayNameOriginal`, and original numerals in each `*Calendar.tsx` where data is available (reuse or extend `lib/calendars.ts` / `calendarViews.ts`). |
| D5 | Link homepage cards to `/calendar/[id]`: in **`CalendarCard.tsx`** or **`app/page.tsx`**, make each card a link (e.g. `<Link href={`/calendar/${info.id}`}>`) or wrap the card in a link. |

### File creation checklist (components/calendar/)

- [ ] `CalendarLayout.tsx`
- [ ] `DayCell.tsx`
- [ ] `MonthGrid.tsx`
- [ ] `index.tsx` (map + exports)
- [ ] `GregorianCalendar.tsx`
- [ ] `IslamicCalendar.tsx`
- [ ] `ChineseCalendar.tsx`
- [ ] `HinduCalendar.tsx`
- [ ] `HebrewCalendar.tsx`
- [ ] `EthiopianCalendar.tsx`
- [ ] `PersianCalendar.tsx`
- [ ] `JapaneseCalendar.tsx`
- [ ] `BuddhistCalendar.tsx`
- [ ] `CopticCalendar.tsx`
- [ ] `ThaiSolarCalendar.tsx`
- [ ] `KoreanCalendar.tsx`
- [ ] `JavaneseCalendar.tsx`
- [ ] `ArmenianCalendar.tsx`
- [ ] `MayanCalendar.tsx`
- [ ] `BahaiCalendar.tsx`
- [ ] `SikhCalendar.tsx`
- [ ] `AssyrianCalendar.tsx`

Plus **lib/calendarThemes.ts** and **app/calendar/[calendarId]/page.tsx**.

---

## 9. Implementation Order (summary)

Follow **§8 Start Plan** (Phase A → B → C → D). In short:

1. **Phase A:** Route, `CalendarLayout`, `calendarThemes`, one component (`GregorianCalendar`).
2. **Phase B:** `DayCell`, `MonthGrid`, refactor Gregorian, add Islamic, introduce index/map.
3. **Phase C:** Add all 18 `*Calendar.tsx` files and register them in the index; add lib helpers as needed.
4. **Phase D:** Baha’i and Mayan custom layouts, responsive + original language, link cards to `/calendar/[id]`.

---

## 10. Summary

- **One file per calendar type:** 18 components in `components/calendar/`: `GregorianCalendar.tsx` … `AssyrianCalendar.tsx`, each with its own layout and labels (English + original where available).
- **Single route:** `app/calendar/[calendarId]/page.tsx` renders `CalendarLayout` + the component from `components/calendar/index.tsx` map.
- **Shared pieces:** `CalendarLayout` (gradient, back, icon, year picker), optional `MonthGrid` + `DayCell` for classic month grids; Baha’i and Mayan can use custom layouts inside their own file.
- **Per calendar:** Own **linear gradient** (`lib/calendarThemes.ts`), **Lucide icon** (existing `calendarMeta`), **English + original** in each `*Calendar.tsx`.
- **Start plan:** Phase A (route + layout + Gregorian) → B (shared blocks + Islamic) → C (all 18 files + index) → D (special layouts, responsive, links from homepage).
