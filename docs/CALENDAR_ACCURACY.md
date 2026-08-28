# Calendar accuracy

Which calendars in this app are correct, what each one is actually computing,
and where the remaining limits are. Kept honest deliberately: several of these
were presented as real conversions for a long time while being Gregorian dates
with an offset added to the year.

## How this was verified

Two suites, and the difference between them matters.

- `tests/` (`npm test`) asserts the app against ICU. Since the app is built on
  ICU, this catches wiring mistakes but **cannot** tell you whether ICU is being
  asked the right question. It is the regression gate and must stay green.
- `tests/audit/` (`npm run audit`) asserts the app against independent
  implementations that share no code with `lib/` and never call ICU:
  - `reference.ts` — RD ("rata die") arithmetic written from Reingold &
    Dershowitz, *Calendrical Calculations*, for the Gregorian, Julian, Coptic,
    Ethiopic, tabular Islamic, Hebrew, Indian Saka, Armenian, Mayan, Nanakshahi
    and Assyrian calendars.
  - `astronomy.ts` — Meeus, *Astronomical Algorithms*: the March equinox and
    December solstice (ch. 27), solar longitude (ch. 25) and new moon (ch. 49),
    which is what the Persian, Baha'i and Chinese calendars are actually
    *defined* by.
  - Externally known dates: published Lunar New Years, Japanese accession days,
    Rosh Hashanah, Nowruz, Naw-Rúz, Coptic and Ethiopian new year.

The references are validated **before** being used to judge anything, in
`selfcheck.test.ts` and `equinox.test.ts`: the equinox matches published times
to under 5 minutes, and the lunisolar code reproduces all 12 published Lunar New
Years from 2019 to 2030 from first principles.

Coverage is every day from 2020 to 2030 — 4018 days per calendar — plus
structural invariants: that each calendar's month grids tile its year exactly,
that consecutive months start on consecutive weekdays, and that holidays land on
the right real-world day.

## Correct

Verified against independent arithmetic or astronomy on all 4018 days, with zero
mismatches.

| Calendar | Source | Verified against |
| --- | --- | --- |
| Gregorian | Luxon | RD arithmetic |
| Hebrew | `@hebcal/core` | Independent Hebrew arithmetic, year and month lengths |
| Islamic (Hijri) | ICU `islamic-umalqura` | Tabular Islamic, within the ±2 days Umm al-Qura is expected to differ by |
| Coptic | ICU `coptic` | Alexandrian arithmetic |
| Ethiopian | ICU `ethiopic` | Alexandrian arithmetic |
| Indian National (Saka) | ICU `indian` | Saka arithmetic (Chaitra 1 = 21/22 March) |
| Japanese | ICU `japanese` | All five modern accession dates, and the day before each |
| Persian (Solar Hijri) | Luxon (ICU), views from `lib/astronomy` | Equinox-based Nowruz, Meeus ch. 27 |
| Mayan | `lib/traditionalCalendars` | Long Count from correlation 584283; 13.0.0.0.0 on 21 Dec 2012 |
| Armenian | `lib/traditionalCalendars` | 365-day wandering year from the 11 July 552 CE epoch |
| Sikh (Nanakshahi) | `lib/traditionalCalendars` | Fixed solar months, Chet 1 = 14 March |
| Assyrian | `lib/traditionalCalendars` | Syriac months, year beginning 1 April |
| Baha'i | `lib/traditionalCalendars` | Published Naw-Rúz table, 2015–2029 |
| Javanese | `lib/traditionalCalendars` | Asapon kurup anchor, 1 Sura 1867 AJ = Tuesday Pon, 24 March 1936 |
| Buddhist / Thai Solar | Gregorian + 543 | Correct from 1941 onward — see caveat below |
| Chinese / Korean (Dangi) | ICU `chinese` / `dangi` | Meeus new moon and solar terms — 2 exceptions below |

## Known limits

These are recorded rather than repaired, because each is a property of a source
this app does not control or of a rule that is genuinely undecidable at this
precision. `npm run audit` marks the first as `it.fails`, so if ICU improves the
test starts passing and should be promoted.

**Chinese and Korean: two days out of 4018.** Month lengths, leap months and
month starts all match an independent computation except:

| | Reference and published calendars | ICU |
| --- | --- | --- |
| Lunar New Year 2027 | 6 February | 7 February |
| Lunar New Year 2030 | 3 February | 2 February |

Both are years where the new moon falls within minutes of midnight in China
(23:56 and 00:07 CST), the known failure mode of an approximate lunar model.
Fixing it would mean shipping an ephemeris.

**Dangi is not a relabelled Chinese calendar.** It is reckoned on Korea Standard
Time (UTC+9) against China's UTC+8, so the two legitimately differ on 26 of
those 4018 days. Both are correct.

**Baha'i beyond 2029.** Naw-Rúz is the day whose sunset in Tehran first falls
after the equinox, and some years turn on a margin of a minute or two — 2026's
equinox falls within a minute of sunset. No approximate ephemeris can resolve
that, so `PUBLISHED_NAW_RUZ` pins the years published by the Universal House of
Justice and computation fills in the rest. The official table runs to 2064;
extending that map from it makes those years exact too. 2030 is currently
computed with a margin under an hour and should be checked against the official
table.

**Javanese outside 1936–2052.** The Sultan Agung calendar drops one day every
120-year kurup. The implementation is anchored on the current kurup, Asapon
(1 Sura 1867 AJ = Tuesday Pon = 24 March 1936, which the kurup's name itself
encodes: *Sa* for Selasa, *pon* for the pasaran day). Outside 1867–1986 AJ it
drifts by a day per kurup. The pawukon, the 210-day wuku cycle, is not
implemented — the pasaran and the weekday, which make up the weton, are.

**Buddhist / Thai Solar before 1941.** Gregorian + 543 is correct only from
1941, when Thailand moved new year to 1 January. The app serves a ±100-year
window, so 1926–1940 render January–March one year too high.

## What was fixed, and what it had been

Percentages are days wrong out of the 4018 days from 2020 to 2030, before the
fix.

| Calendar | Was | Now |
| --- | --- | --- |
| Mayan | 100% — Long Count exactly 365 days ahead | Long Count, Tzolkʼin and Haabʼ from correlation 584283 |
| Armenian | 100% — Gregorian day and month, year − 552 | 365-day wandering year, 12 × 30 days + the 5 Aweleacʻ |
| Sikh | 100% — Gregorian day and month, year − 1469 | Nanakshahi solar months, year = Gregorian − 1468 |
| Baha'i | 100% — a plain Gregorian date | Badíʻ: 19 × 19 days + Ayyám-i-Há, equinox-based |
| Javanese | 100% — a plain Gregorian date | Anno Javanico, plus the pasaran and windu |
| Assyrian | 24.7% — year rolled over on 1 January | Syriac months, year rolls over 1 April |

The Mayan error was exactly one year: `new Date(-3114, 7, 11)` is astronomical
year −3114, i.e. 3115 BCE. The same broken epoch existed **twice** — a second
copy lived in `components/calendar/MayanCalendar.tsx`.

The Armenian calendar was also self-inconsistent, and the navigation was the
worse half: `getArmenian` used `year - 552` while `getDefaultYearForCalendar`
and `getMonthInfo` used `year + 552` (2578, which is not any Armenian year).
Today is 1476.

### View-layer defects fixed alongside

- **The year-view components did not use `getMonthInfo` at all.** Each mapped
  January–December onto a Gregorian year with an offset, so a Coptic year showed
  twelve 28-to-31-day months instead of thirteen, and Hindu, Armenian, Sikh,
  Assyrian and Javanese years showed Gregorian month lengths under a renamed
  year. They now share one `StructuredYear` component driven by the calendar's
  own structure. `yearTiling.test.ts` guards the invariant.
- **`getPersianYearStructure` was entirely Gregorian.** It called
  `DateTime.fromObject({ year, month }, { outputCalendar: "persian" })`, but
  Luxon's `outputCalendar` only affects formatting, so it built Gregorian year
  1405 CE and reported February as 28 days. `getTodayPersian` read `.year` /
  `.month` / `.day` off a reconfigured `DateTime` for the same reason, so today
  was never highlighted.
- **`MONTH_RANGES` had no `mayan` entry**, so every Mayan month page 404'd. It
  now renders the Haabʼ round. `armenian` went 12 → 13 for the epagomenal days
  and `bahai` 19 → 20 for Ayyám-i-Há.
- **`getTodayDayInMonth` carried stale offsets.** `hindu` used the Vikram
  Samvat `+ 57` against a calendar that is now Saka, so today was never
  highlighted; `coptic` compared a Gregorian month number to a Coptic one and
  then returned the Gregorian day.
- **`getDefaultYearForCalendar` was wrong for part of every year** wherever a
  calendar's new year is not 1 January. Every branch is now derived from the
  implementation that renders the date.
- **Holiday definitions were landing on the wrong days.** They were always
  written in each calendar's own numbering, so while those calendars rendered
  Gregorian months, Vaisakhi sat on 1 February rather than 14 April and
  Kha b-Nisan on 1 January rather than 1 April. Two needed renumbering for the
  new month layouts: the Baha'i Feasts skip Ayyám-i-Há, and the Assyrian
  Assumption of Mary moved from month 8 to month 5 (Aab), both 15 August.

## Still worth attention

**Some holiday entries are Gregorian civil dates sitting in non-Gregorian
calendars.** Armenian Independence Day and Indonesian Independence Day are fixed
to a Gregorian date, but they are stored as fixed dates in a wandering and a
lunar calendar respectively, so they will drift. The Armenian entries in
particular look garbled — Armenian Christmas is recorded as month 6 day 6 —
and were not touched here, because guessing at intent is worse than reporting
it. These need a rule kind that anchors to a Gregorian date.

## On "Hindu"

This was labelled **Hindu (Vikram Samvat)** but computed as Gregorian + 57 with
Gregorian month and day. That is not Vikram Samvat, which is lunisolar and needs
an ephemeris, and which has regional variants (Purnimanta and Amanta) that
disagree about which month a given day falls in for half of every month.

It now shows the **Indian National (Saka)** calendar, India's official civil
calendar, which ICU implements and which the audit confirms on every day of an
11-year span. Vikram Samvat is not offered.

## Why ICU

`Intl.DateTimeFormat` carries ICU's calendar data in every modern runtime, so
these conversions need no dependency and no maintenance. `lib/icu.ts` wraps it:
ICU only converts Gregorian to a calendar, so finding where a calendar year
starts is a binary search, and month structure is derived by walking days and
grouping them. Results are memoised per calendar-year.

The audit confirms this was the right call — every ICU-backed calendar matches
independent arithmetic exactly, apart from the two lunisolar edge days above.
The six calendars ICU does not implement live in `lib/traditionalCalendars.ts`
and are built on the day-number arithmetic in `lib/calendarMath.ts`, so none of
them carries its own offset.

Two packages were removed along the way, both last published in 2017:

- `hijri-date` — its `Date` constructor returned an object with no usable year
  under the bundler's CJS interop, so every Hijri date rendered as year 0
- `chinese-lunar` — replaced by ICU, which also handles leap months
