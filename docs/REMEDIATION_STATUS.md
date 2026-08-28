# Remediation status

Working notes from the August 2026 audit: what has been fixed, what is still
open, and which decisions are already settled so they do not get relitigated.

Companion doc: [CALENDAR_ACCURACY.md](./CALENDAR_ACCURACY.md) records which
calendars are trustworthy and what each one actually computes.

**Current state:** phases 0–3 are complete. Phase 5 is partly done — the
Persian, view-layer and holiday defects it would have caught are fixed; the
accessibility, performance and dependency items are still open.

---

## Done

### Edge-request blowout (merged, PR #1)

The site was a crawler trap. Month and year views rendered prev/next links for
any year with no bound, all returning 200, so a crawler could walk an unbounded
URL space across 18 calendars. This was the likely cause of hitting 75% of the
Vercel free tier's 1,000,000 monthly edge requests.

- Serve a ±100-year window per calendar, centred on that calendar's own current
  year; 404 outside it
- `?year=` is clamped rather than rejected, so hand-typed years still work
- prev/next render as disabled spans at the boundaries, making the link graph
  finite
- Added `app/robots.ts` and `app/sitemap.ts`
- AI Bots set to **Deny** in the Vercel project firewall. Per Vercel's docs,
  WAF-denied traffic incurs no CDN requests, so blocked bots stop counting
  against the quota entirely

### Islamic month pages 404 (merged, PR #2)

A regression from the range check above. `getTodayHijri()` defaulted a missing
year to `0`, so the Islamic year range became −100…100 and every real Hijri year
fell outside it. Root cause was `hijri-date` returning an object with no usable
year under the bundler's CJS interop.

### Phase 0 — test harness and CI (`75226e0`)

The project had no tests at all, which is why a dozen wrong calendars went
unnoticed for five months.

- Vitest + `npm test`, `npm run typecheck`
- `.github/workflows/ci.yml`: lint, typecheck, ICU availability check, test, build
- 76 tests. Correct calendars locked against a 20-year ICU sweep
- Known-broken calendars recorded as `it.fails`, so the bug list is executable
  and CI stays green; when a fix lands the test starts failing, which is the
  signal to promote it to a plain `it`
- Cleared both eslint errors so CI starts clean

### Phase 1 — frozen homepage date (`373c27f`)

`/` was prerendered once at build, so `today()` was evaluated at deploy and
never again. A site whose entire purpose is showing today's date had been
displaying **4 March 2026 for five months**. Now revalidates every 5 minutes,
staying edge-cached so it does not spend an edge request per visit.

### Phase 2 — ICU-backed calendars (`8ef2a44`)

`lib/icu.ts` wraps `Intl`. ICU only converts Gregorian → calendar, so finding
where a calendar year starts is a binary search, and month structure is derived
by walking days and grouping them, memoised per calendar-year.

| Calendar | Before | After |
| --- | --- | --- |
| Islamic | `Muharram 1, 0 AH` on every date | Umm al-Qura, real 29/30-day months |
| Chinese | invented 30/29 alternation, no leap months | real lengths, leap months in place |
| Korean | byte-identical copy of Chinese | Dangi era (+2333) |
| Coptic | Gregorian day passed through | `Mesra 4, 1742 AM` |
| Ethiopian | Gregorian day passed through | `Nehasse 4, 2018 EE` |
| Japanese | era from Gregorian year | correct at every era boundary |
| Hindu | Gregorian + 57 as "Vikram Samvat" | Indian National (Saka) |

Removed `hijri-date` and `chinese-lunar`, both last published in 2017.

### Phase 3 — the six remaining calendars

All six now compute from their own rules in `lib/traditionalCalendars.ts`, on
the day-number arithmetic in `lib/calendarMath.ts`, with the equinox and sunset
work the Persian and Baha'i calendars need in `lib/astronomy.ts`.

| Calendar | Now |
| --- | --- |
| Mayan | Long Count from correlation 584283, plus Tzolkʼin and Haabʼ |
| Armenian | 365-day wandering year, epoch 11 July 552 CE |
| Assyrian | Syriac months, year beginning 1 April |
| Sikh | Nanakshahi fixed solar months, year = Gregorian − 1468 |
| Baha'i | Badíʻ, with the published Naw-Rúz table pinning 2015–2029 |
| Javanese | Anno Javanico on the Asapon kurup, plus the pasaran |

The Armenian contradiction is resolved by deriving `getDefaultYearForCalendar`
from the implementation rather than keeping a second offset beside it.

### The audit suite

`tests/audit/` (`npm run audit`) checks the app against implementations that
share no code with `lib/` and never call ICU — RD arithmetic from *Calendrical
Calculations*, astronomy from Meeus, and externally known dates. It found what
the ICU-based tests structurally could not:

- the Persian year view was entirely Gregorian, though its date string was right
- the year-view components never called `getMonthInfo`, so Coptic and Hindu year
  views were wrong too
- `MONTH_RANGES` had no `mayan` entry, so every Mayan month page 404'd
- `getTodayDayInMonth` still used the Vikram Samvat `+ 57` offset for Hindu
- holidays landed on the wrong days, because the definitions were written in
  each calendar's own numbering

See [CALENDAR_ACCURACY.md](./CALENDAR_ACCURACY.md) for the full result and the
remaining known limits.

---

## Open

### Phase 5 — quality sweep

**Accessibility**

- `MonthView.tsx:51` sets `role="grid"` and `MonthDayCell.tsx:30` sets
  `role="gridcell"` with **no `role="row"` between them**. Invalid ARIA; screen
  reader grid navigation does not work
- `MonthGrid.tsx:90` wraps an `<article>` containing an `<h2>` and ~30 day cells
  in a single `<Link>`. The accessible name becomes every day number concatenated
- `MonthDayCell.tsx:58` guesses language:
  `/[֐-׿]/.test(x) ? "he" : "ar"`, so Chinese, Persian and Amharic
  holiday names are tagged as Arabic. The Islamic card tags Arabic text `lang="he"`

**Performance**

- Font Awesome loaded from cdnjs as a render-blocking stylesheet in `<head>` on
  every page, for 9 footer icons. Inline SVGs would remove a third-party
  dependency and a round trip
- `layout.tsx` points `icon` and `apple-touch-icon` at the 111 KB
  `social_preview_image.png`. A real 33 KB `favicon.ico` sits unused in `public/`

**Dependencies**

- `npm audit`: 3 high-severity CVEs in `libvips` via `sharp`, transitive from
  Next. Fix requires upgrading to `next@16.3.0`

**Low priority**

- URL segments interpolated into `redirect()` targets without encoding
- Dead `getWeekday()` in `lib/holidays/gregorian.ts`, and the unused
  `ETHIOPIAN_MONTH_NAMES` in `lib/calendarViews.ts`
- Next boilerplate `file.svg` / `window.svg` / `next.svg` / `vercel.svg` still
  in `public/`
- The Gregorian holiday set is ~14 Christian/US entries for a "world" calendar hub
- Month picker offers a 13th month for Hebrew common years; the route redirects,
  so it is cosmetic
- Some holiday entries are Gregorian civil dates stored as fixed dates in
  wandering or lunar calendars, so they drift. The Armenian entries look garbled
  (Armenian Christmas is recorded as month 6 day 6). Needs a rule kind that
  anchors to a Gregorian date

---

## Settled decisions

Do not relitigate without a reason.

- **Hindu → Indian National (Saka).** Vikram Samvat is lunisolar, needs an
  ephemeris, and has Purnimanta/Amanta variants that disagree about the month
  for half of each month. Saka is India's official civil calendar and ICU
  implements it. The label now matches what is computed
- **Armenian → traditional wandering year**, not the modern fixed variant
- **Sikh → original 2003 Nanakshahi.** The 2010 amendment reintroduces lunar
  reckoning
- **Baha'i → astronomical**, per the Universal House of Justice tables
- **Homepage uses ISR, not client rendering.** Client rendering would be more
  correct (today is inherently per-user-timezone) but would ship the calendar
  libraries to the browser. The tradeoff is that visitors far from UTC can see
  the adjacent day for part of their own day
- **Chinese/Korean URLs changed** from `4724` (Yellow Emperor) to `2026`/`4359`.
  Old links 404. Accepted: low traffic, and crawlers are bounded now

---

## Verifying

```
npm run lint && npm run typecheck && npm test && npm run audit && npm run build
```

Tests assert against ICU via `Intl`, so the runtime needs full ICU data. CI
checks this explicitly — a slim build would silently reduce the suite to
English-only formatting and pass anyway.

`npm test` should report no expected failures. `npm run audit` reports **4
expected fails**: the two Lunar New Years where ICU's lunar model puts the new
moon on the wrong side of midnight. If those start passing, ICU has improved and
they should be promoted to plain `it`.
