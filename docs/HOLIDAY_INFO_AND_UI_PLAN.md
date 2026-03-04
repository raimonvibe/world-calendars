# Plan: Holiday Information, Responsive UI & Calendar-Themed Design

## Goals

1. **Dark/light mode toggle on all pages** — Done: added to CalendarLayout (year view) and MonthViewLayout (month view); homepage and convert already had it.
2. **Display information about each holiday in English** — Expand from name-only to short descriptive text per holiday.
3. **Calm, responsive design on small screens** — Typography, spacing, and layout stay readable and uncluttered on mobile.
4. **Holiday info matches each calendar’s linear gradient theme** — Info panels/cards use the same gradient (or derived colors) as the calendar view.
5. **Written holiday information** — Add and maintain English copy for every holiday entry.

---

## 1. Dark/Light Toggle (Completed)

| Page / Layout        | Toggle |
|----------------------|--------|
| Homepage             | ✅ Header nav |
| Convert              | ✅ Header nav |
| Calendar year view   | ✅ CalendarLayout header (next to year nav) |
| Calendar month view  | ✅ MonthViewLayout header (in month nav) |

No further action for toggle placement.

---

## 2. Holiday Information in English

### 2.1 Data model

- **Current:** `HolidayEntry` has `id`, `nameEn`, `nameOriginal?`, `type`, `description?`.
- **Add:** `infoEn?: string` — one or two short paragraphs of English text (origin, customs, who observes, etc.).
- **Optional:** `infoUrl?: string` for further reading (e.g. Wikipedia).

**Suggested type** (in `lib/holidays/types.ts`):

```ts
export type HolidayEntry = {
  id: string;
  nameEn: string;
  nameOriginal?: string;
  type: HolidayType;
  description?: string;   // one-line tagline (already used in some)
  /** Full English description: 1–3 sentences. */
  infoEn?: string;
  /** Optional link for further reading. */
  infoUrl?: string;
};
```

### 2.2 Where to store copy

- **Option A:** In each calendar’s holiday file (e.g. `lib/holidays/gregorian.ts`): add `infoEn` (and optionally `infoUrl`) to each definition; resolver returns it on the entry.
- **Option B:** Central `lib/holidays/descriptions.ts` (or JSON): map `holidayId` → `{ infoEn, infoUrl }`; merge in `getHolidaysForDay` or in the UI when displaying detail.

Recommendation: **Option A** — keep name, description, and info together per holiday so copy is easy to find and edit.

### 2.3 How to show in UI

- **Month view (day cell):** Keep current behavior: name (and optional `nameOriginal`). No long text in the cell.
- **Holiday detail surface:** When user opens “more” for a day or a holiday:
  - Show **name** (and `nameOriginal` if present).
  - Show **infoEn** (and optionally **infoUrl**).
  - Style this surface with the **calendar’s gradient theme** (see §4).

Interaction options:

- **F1 — Click holiday name in day cell:** Open a small modal/drawer with holiday info.
- **F2 — “Holidays on this day” expandable section below the month grid:** List holidays for the visible month with expand/collapse per holiday to show `infoEn`.
- **F3 — Dedicated “Holidays this month” list page/section:** List all holidays in the month; each item expands or links to a detail that shows `infoEn`.

Recommendation: **F1 or F2** so info is reachable from the month view without leaving the page. Prefer **F2** for calm UX: one section below the grid, each holiday expandable to show `infoEn` and optional link.

---

## 3. Responsive, Calm Design (All Screen Sizes)

### 3.1 Principles

- **Calm:** Plenty of whitespace; avoid dense blocks of text; use clear hierarchy (title → short intro → body).
- **Readable:** Min font size ~14px for body on mobile; line-height ~1.5; max line length ~65ch for long text.
- **Touch-friendly:** Tap targets ≥44px; spacing between interactive elements so they don’t feel cramped.
- **Progressive:** On small screens, show less by default (e.g. holiday names only); “Read more” or expand for full `infoEn`.

### 3.2 Month view (existing)

- Day grid: already responsive (7 columns, flexible cell height).
- Day cells: keep holiday names only; truncate or allow wrap if many (e.g. max 2–3 lines, then “+N more” or scroll).
- **New:** “Holidays this month” section below the grid (see §2.3 F2):
  - **Mobile:** Single column; each holiday is a card/row: name + “Read more” that expands to show `infoEn`.
  - **Tablet/desktop:** Same or 2-column grid; expanded text in a clear block with comfortable padding.

### 3.3 Holiday info block (new)

- Container: `max-w-prose` for text; padding `p-4 sm:p-6`; `rounded-xl`; subtle border or shadow.
- Title: holiday name (and optional `nameOriginal`); font size `text-lg sm:text-xl`.
- Body: `infoEn` with `text-sm sm:text-base`; `leading-relaxed`; `text-zinc-700 dark:text-zinc-300`.
- Optional link: “Learn more” with `infoUrl`; open in new tab; small, low-emphasis styling.

### 3.4 Global

- All pages: ensure header (with dark toggle) stays usable on narrow viewports (wrap, no horizontal scroll).
- Use Tailwind breakpoints consistently: `sm`, `md`, `lg` for padding, font sizes, and layout changes.

---

## 4. Match Linear Gradient Theme per Calendar

### 4.1 Current setup

- Each calendar has `CALENDAR_GRADIENTS[calendarId]` (light) and `CALENDAR_GRADIENTS_DARK[calendarId]` (dark) in `lib/calendarThemes.ts`.
- Year and month views use these as full-page backgrounds.

### 4.2 Applying theme to holiday info

- **Option A — Same gradient, subtle panel:** Holiday info panel uses the same gradient as the page, with a slightly opaque overlay (e.g. `bg-white/90 dark:bg-zinc-900/90`) and border so the gradient shows at the edges and the content stays readable.
- **Option B — Derived colors:** From the gradient, derive a “card” color (e.g. first color of the gradient, or a fixed hue per calendar) and use it for the info panel background (e.g. `bg-[color]` or CSS variable).
- **Option C — Border/accent only:** Keep info panel neutral (white/dark gray); use a left or top border (or icon tint) in the calendar’s main gradient color so the theme is visible without changing the whole panel.

Recommendation: **Option C** for simplicity and readability; optionally combine with **Option A** (very subtle gradient tint) so the panel still “belongs” to the calendar.

### 4.3 Implementation sketch

- Month view (and any holiday detail) receives `calendarId`.
- In `MonthViewLayout` (or a shared wrapper), the main content area already sits on the calendar gradient.
- For the new “Holidays this month” section:
  - Use a card/panel with `border-l-4` (or `border-t-4`) whose color is the calendar’s “accent” (e.g. first color of `CALENDAR_GRADIENTS[calendarId]` parsed, or a pre-defined `CALENDAR_ACCENT` map).
  - Alternatively, set a CSS variable from the gradient (e.g. `--calendar-accent`) and use it for border/icon.

If you prefer panels to feel more “inside” the calendar: use a very light tint of the gradient (e.g. first color at 10% opacity) as panel background, plus Option C for a clear accent.

---

## 5. Writing Holiday Information (infoEn)

### 5.1 Scope

- Every holiday in every calendar file should eventually have **infoEn**: 1–3 sentences in English (origin, meaning, who observes it, main customs).
- Start with the most important holidays per calendar (e.g. Gregorian: Christmas, Easter, New Year; Islamic: Eid, Ramadan; etc.), then fill the rest.

### 5.2 Template per entry

- **Sentence 1:** What the day is (e.g. “Christmas is the Christian feast of the birth of Jesus.”).
- **Sentence 2 (optional):** Who observes it and where (e.g. “It is a public holiday in many countries.”).
- **Sentence 3 (optional):** One custom or note (e.g. “Many people exchange gifts and attend church services.”).

Keep tone neutral and factual; avoid long paragraphs.

### 5.3 Where to add

- In each `lib/holidays/*.ts` file, add `infoEn` (and optionally `infoUrl`) to the definition object.
- In the resolver, pass `infoEn` and `infoUrl` through to the returned `HolidayEntry`.

### 5.4 Order of work

1. Extend `HolidayEntry` and definitions with `infoEn` (and `infoUrl` where useful).
2. Add UI to show holiday info (expandable list or modal) using `infoEn` and optional link.
3. Write and add English copy for all holidays (can be done incrementally by calendar).
4. Apply calendar-themed styling (accent border / subtle gradient) and responsive layout as above.

---

## 6. Implementation Order (Summary)

| Phase | Action |
|-------|--------|
| **1** | Extend `HolidayEntry` with `infoEn?` and `infoUrl?` in `lib/holidays/types.ts`. Update all holiday definition types and resolvers to pass these through. |
| **2** | Add a “Holidays this month” section below the month grid in `MonthView`. For each day that has holidays, list them; each item expandable to show `infoEn` and optional “Learn more” link. Use calm, responsive layout (single column on mobile, comfortable padding, readable font sizes). |
| **3** | Add calendar-themed styling: pass `calendarId` into the section (or use context); apply accent border (or subtle gradient tint) from `lib/calendarThemes.ts` so the block matches the calendar’s gradient theme. |
| **4** | Write and add `infoEn` (and selected `infoUrl`) for all holidays, starting with one calendar (e.g. Gregorian), then the rest. |
| **5** | Responsive and calm pass: check header + toggle on small screens; ensure “Holidays this month” and any modals/drawers are touch-friendly and don’t feel cramped; adjust spacing/typography as needed. |

---

## 7. File Checklist

**To create**

- [ ] Optional: `lib/calendarThemes.ts` — add `CALENDAR_ACCENT` or helper to get a single accent color per calendar for borders/icons (if not using gradient parsing).

**To modify**

- [ ] `lib/holidays/types.ts` — add `infoEn?`, `infoUrl?` to `HolidayEntry` (and to `HolidayDefinition` if definitions hold the copy).
- [ ] Each `lib/holidays/*.ts` — add `infoEn` (and optionally `infoUrl`) to each holiday definition; ensure resolvers include them in the returned entry.
- [ ] `components/calendar/MonthView.tsx` — add “Holidays this month” section below the grid; list holidays with expandable `infoEn`; accept or derive `calendarId` for theme.
- [ ] Optional: `components/calendar/HolidayInfoCard.tsx` — reusable card for one holiday (name, nameOriginal, infoEn, infoUrl) with calendar accent and responsive styles.
- [ ] `components/calendar/CalendarLayout.tsx` — already updated with DarkModeToggle.
- [ ] `components/calendar/MonthViewLayout.tsx` — already updated with DarkModeToggle.

---

## 8. Summary

- **Dark/light toggle:** Present on homepage, convert, year view, and month view.
- **Holiday information:** Add `infoEn` (and optional `infoUrl`) to every holiday; show in an expandable “Holidays this month” section (or modal) with calm, responsive layout.
- **Design:** Responsive and calm on small screens; holiday info panel uses the calendar’s gradient theme (accent border or subtle tint) so it matches the rest of the page.
- **Copy:** Write short English descriptions for all holidays and add them to the holiday definitions in `lib/holidays/*.ts`.
