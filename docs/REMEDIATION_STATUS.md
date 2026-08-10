# Remediation status

Working notes from the August 2026 audit: what has been fixed, what is still
open, and which decisions are already settled so they do not get relitigated.

Companion doc: [CALENDAR_ACCURACY.md](./CALENDAR_ACCURACY.md) records which
calendars are trustworthy and what each one actually computes.

**Current state:** phases 0–2 are complete on branch
`test/calendar-safety-net` (3 commits, not yet merged). Phases 3 and 5 are open.

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

---

## Open

### Phase 3 — the six remaining calendars

All deterministic, all implementable without new dependencies. Each renders
Gregorian month lengths under a different year number today, so only the year is
ever close and the day is essentially always wrong. 5 `it.fails` tests hold
these specs.

| Calendar | Approach |
| --- | --- |
| **Mayan** | Long Count = JDN − 584283 (GMT correlation). Algorithm already validated during the audit. Optionally add Tzolk'in/Haab' |
| **Armenian** | Traditional wandering year: 365 days, no leap, epoch 11 July 552 CE (JDN 1922868) |
| **Assyrian** | Gregorian + 4750, year starts 1 April |
| **Sikh** | Nanakshahi fixed solar month lengths, year starts 14 March, epoch 1469 |
| **Baha'i** | Badí': 19 months × 19 days + Ayyám-i-Há. Astronomical since 2015, so needs the official Naw-Rúz table (published through 2064) |
| **Javanese** | Anno Javanico + 5-day pasaran + 210-day pawukon |

**Armenian is additionally self-contradictory** and should be fixed regardless
of the rest: the date string uses `year - 552` (1474) while the year navigation
uses `year + 552` (2578). The same day is labelled two different years depending
where you look. This exists because the offset is duplicated in two places —
`getDefaultYearForCalendar` should be derived from the implementation, not
hand-maintained alongside it.

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

**Honesty**

- README claims conversion "to any of the 18 calendar systems". Six are still
  approximations — link `CALENDAR_ACCURACY.md` rather than implying all 18 are
  exact

**Low priority**

- URL segments interpolated into `redirect()` targets without encoding
- Dead `getWeekday()` in `lib/holidays/gregorian.ts`
- Next boilerplate `file.svg` / `window.svg` / `next.svg` / `vercel.svg` still
  in `public/`
- The Gregorian holiday set is ~14 Christian/US entries for a "world" calendar hub
- Month picker offers a 13th month for Hebrew common years; the route redirects,
  so it is cosmetic

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
npm run lint && npm run typecheck && npm test && npm run build
```

Tests assert against ICU via `Intl`, so the runtime needs full ICU data. CI
checks this explicitly — a slim build would silently reduce the suite to
English-only formatting and pass anyway.

A passing suite that reports **expected fail** counts is normal: those are the
Phase 3 calendars whose specs are written but not yet implemented.
