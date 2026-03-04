# Plan: Clickable Month View with Holidays & Traditions

## Goal

- Each **month** in the existing year view becomes a **clickable element** that opens a dedicated **month view**.
- The **month view** shows that month’s days in a **traditional, responsive, spacious** layout.
- Each **day cell** displays **holidays and other traditions** for that day in that calendar.

---

## 1. Route & Navigation

| Item | Proposal |
|------|----------|
| **Month view URL** | `/calendar/[calendarId]/[year]/[month]` (e.g. `/calendar/gregorian/2026/3`, `/calendar/islamic/1448/9`) |
| **From year view** | Each month block (e.g. `MonthGrid` or Baha’i month card) is wrapped in a `Link` to `/calendar/{calendarId}/{year}/{month}`. Month is 1-based; for 13-month calendars use 1–13; for Baha’i use 1–19. |
| **Back from month view** | “Back to year” (or “Back to [Calendar] [Year]”) linking to `/calendar/[calendarId]?year=[year]`. |
| **Month nav** | In month view header: previous/next month (and wrap year when needed: Dec → Jan next year, etc.). |

**Edge cases**

- **Baha’i**: 19 months; intercalary (Ayyám-i-Há) can be treated as “month” 20 or a separate view (e.g. `month=0` or `month=20`). Plan: use 1–19 for regular months; optional link “Ayyám-i-Há” to same route with `month=20` and a special layout for 4–5 days.
- **Hebrew / Ethiopian**: 13 months; `month` 1–13.
- **Mayan**: No standard “month” in the same sense; Long Count + Tzolkin/Haab. Either skip clickable “month” on year view or link to a “cycle” view (e.g. current Tzolkin trecena or Haab month). Can be Phase 2.

---

## 2. Data: Holidays & Traditions

### 2.1 Structure

- **No backend**: all data is static (TS/JSON) or computed from rules.
- **Per calendar**: define a list of holidays/observances/traditions with a way to know which (year, month, day) they fall on in that calendar.

**Proposed types** (e.g. in `lib/holidays/types.ts`):

```ts
type HolidayEntry = {
  id: string;
  nameEn: string;
  nameOriginal?: string;        // optional native script
  /** Holiday type for styling (e.g. icon or badge) */
  type: 'holiday' | 'observance' | 'tradition' | 'fast' | 'other';
  /** How the date is defined (see below) */
  rule: HolidayDateRule;
  /** Short description or tradition text (optional) */
  description?: string;
};

type HolidayDateRule =
  | { kind: 'fixed'; month: number; day: number; }                    // e.g. Dec 25
  | { kind: 'nthWeekday'; month: number; weekday: number; n: number; } // e.g. 4th Thu Nov (US Thanksgiving)
  | { kind: 'lunar'; month: number; day: number; }                    // lunar calendar: month/day in that calendar
  | { kind: 'easterOffset'; offset: number; }                         // days from Easter (Gregorian)
  | { kind: 'formula'; /** calendar-specific formula */ };
```

- **API**: `getHolidaysForDay(calendarId, year, month, day): HolidayEntry[]` in `lib/holidays/` (or one module per calendar, e.g. `lib/holidays/gregorian.ts`, `lib/holidays/islamic.ts`).
- **Sources**: Static lists per calendar. Start with a small set (e.g. Gregorian: New Year, Christmas, Easter; Islamic: Ramadan start, Eid; Hebrew: Rosh Hashanah, Yom Kippur; etc.). Expand over time.

### 2.2 Where to store

- `lib/holidays/types.ts` – shared types.
- `lib/holidays/index.ts` – exports `getHolidaysForDay(calendarId, year, month, day)` and any shared helpers.
- `lib/holidays/gregorian.ts`, `lib/holidays/islamic.ts`, … – per-calendar data and resolution (or one big file with a switch on `calendarId` if preferred).

### 2.3 Calendar-specific notes

| Calendar | Notes |
|----------|--------|
| **Gregorian** | Many fixed (month, day). Some rule-based (Easter, Advent, Thanksgiving). |
| **Islamic** | Lunar: dates in Hijri (month, day). Eid, Ramadan, etc. – fixed in Hijri, vary in Gregorian. |
| **Hebrew** | Many fixed in Hebrew (month, day). Leap months (Adar I/II) need correct month numbering. |
| **Chinese** | Lunar dates + some solar terms; Lunar New Year, Mid-Autumn, etc. |
| **Persian** | Nowruz, etc. – fixed in Persian calendar. |
| **Others** | Start with a few major ones per calendar; add more later. |

---

## 3. Month View UI

### 3.1 Page

- **Route**: `app/calendar/[calendarId]/[year]/[month]/page.tsx`.
- **Props**: `calendarId`, `year`, `month` (from params; validate and redirect if invalid).
- **Layout**: Reuse `CalendarLayout` (same gradient, back link, icon) but:
  - “Back” goes to year view: `/calendar/[calendarId]?year=[year]`.
  - Header shows: “[Calendar name] – [Month name] [Year]” and prev/next month (and optional month picker).
- **Main**: One full-width month grid (see below).

### 3.2 Month grid (spacious, traditional)

- **Layout**: Classic calendar: 7 columns (weekdays), rows for weeks. First row: weekday names (Mon–Sun or localized); then one cell per day; empty cells before first day (offset by `firstWeekday`).
- **Day cell (large)**:
  - **Day number** clearly visible (and optional original numeral).
  - **Below or inside**: list of **holidays/traditions** for that day (name only, or name + short description). Use a small list or badges; keep readable on mobile.
- **Responsive**:
  - **Desktop**: 7 columns, large cells (e.g. min-height 100–120px), several lines of text per day.
  - **Tablet**: Same 7 columns, slightly smaller cells.
  - **Mobile**: 7 columns kept (so it still looks like a calendar); font and padding reduced; holiday text can truncate with “more” or tooltip, or show as badges.
- **Today**: Highlight current day (border/background) when viewing the current month in the current year.
- **Accessibility**: `aria-label` on month and day cells; holiday names in semantic list or with roles so screen readers get the content.

### 3.3 Components

| Component | Purpose |
|-----------|---------|
| **MonthView** (or **MonthViewCalendar**) | Client or server component that receives `calendarId`, `year`, `month` and renders the single-month grid. Fetches or computes month structure (days in month, first weekday) using existing `calendarViews` helpers where possible. |
| **MonthDayCell** | Single day in month view: day number + list of `HolidayEntry` (names/badges). Replaces the smaller `DayCell` in this context; can accept `isToday`, `holidays`, `day`, `original`. |
| **MonthViewLayout** (optional) | If you want a different header for month vs year view: same gradient/back link, but “Back to year” and month prev/next. Can be a variant of `CalendarLayout` with different nav (e.g. `mode: 'year' | 'month'`). |

---

## 4. Making Months Clickable (Year View)

- In each calendar’s **year view** component (e.g. `GregorianCalendar`, `IslamicCalendar`, …):
  - Wrap each **month block** in `Link` to `/calendar/[calendarId]/[year]/[month]`.
  - For **MonthGrid**: wrap the whole `<article>` in `<Link href={...}>`, or add a visible “View month” link/button inside the card. Prefer wrapping the card so the whole month is clickable.
  - **Baha’i**: each of the 19 month cards links to `month=1..19`; intercalary can link to `month=20` or a separate segment.
  - **Hebrew / Ethiopian**: 13 months; link 1–13.
- **CalendarId and year**: already available in year view (from props or context). Month index: 1-based from the order of months (e.g. first block = 1, …). For Hebrew, month order in the grid might not be 1–13 numeric order (Tishrei first, etc.) – use the same index as in the rendered list (e.g. `index + 1` if you render 13 blocks in order).

---

## 5. Implementation Order

### Phase E1: Route & month view shell

| Step | Action |
|------|--------|
| E1.1 | Add `app/calendar/[calendarId]/[year]/[month]/page.tsx`. Read `calendarId`, `year`, `month` from params; validate (calendar exists; month in range 1–12 or 1–13/1–19 for that calendar). Redirect to year view if invalid. |
| E1.2 | Reuse or extend `CalendarLayout`: “Back to [Calendar] [Year]” → `/calendar/[calendarId]?year=[year]`. Optional: new `MonthViewLayout` that adds month name in header and prev/next month links. |
| E1.3 | Create **MonthView** component (or inline in page): given `calendarId`, `year`, `month`, compute month structure (days in month, first weekday) using existing `get*YearStructure` or equivalent; render a **single month** with a 7-day grid and empty leading cells. Use a simple **MonthDayCell** that only shows day number (no holidays yet). Ensure responsive and “spacious” (larger cells than year view). |

### Phase E2: Holiday data & display

| Step | Action |
|------|--------|
| E2.1 | Add `lib/holidays/types.ts` with `HolidayEntry`, `HolidayDateRule`, and `getHolidaysForDay(calendarId, year, month, day): HolidayEntry[]`. |
| E2.2 | Implement holiday data for 2–3 calendars first (e.g. Gregorian, Islamic, Hebrew): a few fixed or rule-based entries per calendar. Implement resolution in `getHolidaysForDay` for those calendars; for others return `[]` initially. |
| E2.3 | In **MonthDayCell**, accept `holidays: HolidayEntry[]` and render names (and optionally type badge or description). Style so multiple holidays don’t break the layout (wrap, truncate, or scroll). |
| E2.4 | In **MonthView**, for each day call `getHolidaysForDay(calendarId, year, month, day)` and pass result to **MonthDayCell**. |
| E2.5 | Gradually add holiday sets for remaining calendars (Chinese, Persian, Ethiopian, etc.) and any shared helpers (e.g. Easter for Gregorian). |

### Phase E3: Year view → month links

| Step | Action |
|------|--------|
| E3.1 | In **MonthGrid**: add optional prop `calendarId?: CalendarId`, `year?: number`, `monthIndex?: number` (1-based). When all present, wrap the `<article>` in `<Link href={`/calendar/${calendarId}/${year}/${monthIndex}`}>`. |
| E3.2 | In each **\*Calendar.tsx** year view (Gregorian, Islamic, Hebrew, …): pass `calendarId`, `year`, and the correct 1-based month index into each **MonthGrid** (or each month card for Baha’i). |
| E3.3 | Baha’i: make each of the 19 month cards and the Ayyám-i-Há block clickable (month 1–19, and e.g. 20 for intercalary). |
| E3.4 | Optional: add “View month” text or icon on hover/focus for clarity. |

### Phase E4: Polish

| Step | Action |
|------|--------|
| E4.1 | Month view: add **prev/next month** in header (and year wrap: e.g. month 12 → next = year+1, month 1). |
| E4.2 | Responsive and a11y: ensure touch targets, contrast, and aria-labels; test with many holidays in one day. |
| E4.3 | Optional: month picker (dropdown) in month view header for quick jump to another month in the same year. |

---

## 6. File Checklist

**New files**

- [ ] `app/calendar/[calendarId]/[year]/[month]/page.tsx`
- [ ] `lib/holidays/types.ts`
- [ ] `lib/holidays/index.ts` (and per-calendar files or sections)
- [ ] `lib/holidays/gregorian.ts` (or equivalent)
- [ ] `components/calendar/MonthView.tsx` (single-month grid for month view)
- [ ] `components/calendar/MonthDayCell.tsx` (day cell with holidays)

**Modified files**

- [ ] `components/calendar/MonthGrid.tsx` – optional `calendarId`, `year`, `monthIndex`, wrap in `Link` when provided
- [ ] `components/calendar/CalendarLayout.tsx` (or new `MonthViewLayout`) – “Back to year” and month nav when in month view
- [ ] Each `*Calendar.tsx` – pass link props to `MonthGrid` or make month cards clickable (Baha’i, etc.)

---

## 7. Summary

- **Route**: `/calendar/[calendarId]/[year]/[month]` for the month view.
- **Year view**: Each month block is a link to that route; Baha’i 19 + intercalary; Hebrew/Ethiopian 13.
- **Month view**: One spacious, traditional 7-column month grid; each day shows number + holidays/traditions from `getHolidaysForDay`.
- **Holidays**: Static data per calendar in `lib/holidays/` with a small type system and resolution API; start with a few holidays per calendar and expand.
- **Order**: E1 (route + month grid shell) → E2 (holiday data + display in day cells) → E3 (year view links) → E4 (nav + polish).
