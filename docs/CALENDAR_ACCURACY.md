# Calendar accuracy

Which calendars in this app are correct, which are approximations, and what
each one is actually computing. Kept honest deliberately: several of these were
presented as real conversions for a long time while being Gregorian dates with
an offset added to the year.

Verified by `tests/calendars.test.ts` and `tests/monthStructure.test.ts`, which
assert against ICU (`Intl`) where ICU implements the calendar.

## Accurate

These come from a reference implementation, not from hand-written arithmetic.

| Calendar | Source | Notes |
| --- | --- | --- |
| Gregorian | Luxon | — |
| Hebrew | `@hebcal/core` | Correct month lengths and leap years |
| Persian (Solar Hijri) | Luxon (ICU) | — |
| Islamic (Hijri) | ICU `islamic-umalqura` | Umm al-Qura, the Saudi civil reckoning |
| Coptic | ICU `coptic` | 12x30 days + a 5/6-day 13th month |
| Ethiopian | ICU `ethiopic` | Same structure, different epoch |
| Chinese | ICU `chinese` | Real month lengths, leap months included |
| Korean (Dangi) | ICU `dangi` | Same lunisolar reckoning, Dangi era (+2333) |
| Japanese | ICU `japanese` | Era boundaries are mid-year, not 1 January |
| Indian National (Saka) | ICU `indian` | See the note below |
| Buddhist / Thai Solar | Gregorian + 543 | Correct: Thai BE has aligned with the Gregorian year since 1941 |

### On "Hindu"

This was labelled **Hindu (Vikram Samvat)** but computed as Gregorian + 57 with
Gregorian month and day. That is not Vikram Samvat, which is lunisolar and needs
an ephemeris to compute, and which has regional variants (Purnimanta and Amanta)
that disagree about which month a given day falls in for half of every month.

It now shows the **Indian National (Saka)** calendar, India's official civil
calendar, which ICU implements. The label matches what is computed. Vikram
Samvat is not currently offered.

## Still approximate

These render Gregorian month lengths under a different year number. The day and
month are not converted — only the year is offset — so they are wrong for most
of the year.

| Calendar | Currently | Should be |
| --- | --- | --- |
| Mayan | Long Count off by a year and a day | JDN − 584283 (GMT correlation) |
| Baha'i | Gregorian date, Gregorian year | Badí': 19x19 days + Ayyám-i-Há, astronomical Naw-Rúz since 2015 |
| Sikh (Nanakshahi) | Gregorian + year − 1469 | Fixed solar month lengths, year starts 14 March |
| Assyrian | Gregorian + year + 4750 | Year starts 1 April |
| Armenian | Gregorian + year − 552 | 365-day wandering year, epoch 11 July 552 CE |
| Javanese | Plain Gregorian date | Anno Javanico + 5-day pasaran + 210-day pawukon |

The Armenian calendar is additionally **self-inconsistent**: the date string
uses `year - 552` while the year navigation uses `year + 552`, so the same day
is labelled two different years depending on where you look.

## Why ICU

`Intl.DateTimeFormat` carries ICU's calendar data in every modern runtime, so
these conversions need no dependency and no maintenance. `lib/icu.ts` wraps it:
ICU only converts Gregorian to a calendar, so finding where a calendar year
starts is a binary search, and month structure is derived by walking days and
grouping them. Results are memoised per calendar-year.

Two packages were removed in the process, both last published in 2017:

- `hijri-date` — its `Date` constructor returned an object with no usable year
  under the bundler's CJS interop, so every Hijri date rendered as year 0
- `chinese-lunar` — replaced by ICU, which also handles leap months
