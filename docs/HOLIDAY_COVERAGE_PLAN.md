# Holiday Coverage Plan — All Calendars

## Overview

This document audits holiday/observance coverage per calendar and identifies gaps. **Issue**: Persian (and some other calendars) had holidays only in early months; months 3–10 had none in Persian.

---

## 1. Persian (Solar Hijri) — FIXED

**Problem**: Only 6 holidays; months 1–2 had several, then nothing until 11–12.

**Root cause**: Only a subset of Iranian Solar Hijri holidays was included. Iran observes many fixed-date holidays in the Solar calendar ([source: Wikipedia – Public holidays in Iran](https://en.wikipedia.org/wiki/Public_holidays_in_Iran), [List of observances set by the Solar Hijri calendar](https://en.wikipedia.org/wiki/List_of_observances_set_by_the_Solar_Hijri_calendar)).

**Added (Solar-fixed)**:
| Month | Day | Holiday |
|-------|-----|---------|
| 1 | 12 | Islamic Republic Day |
| 3 | 14 | Death of Imam Khomeini |
| 3 | 15 | 15 Khordad uprising |
| 8 | 13 | Students' Day (13 Aban) |
| 9 | 30 | Yalda Night (Shab-e Yalda) |

**Note**: Arbaeen (2/20) and Martyrdom of Imam Reza (2/29) are **Islamic lunar** dates; in Iran they are observed by the Hijri calendar, so their Solar date shifts each year. They remain in the list as approximate/common observance dates.

**Coverage after fix**: Months 1, 2, 3, 8, 9, 11, 12 now have at least one holiday. Months 4–7 still have no *national* Solar-fixed holidays (Iran has lunar-based and other observances there).

---

## 2. Calendar-by-calendar coverage (by month) — UPDATED AFTER CARRY-OUT

| Calendar | Months with ≥1 holiday | Months with 0 | Notes |
|----------|------------------------|---------------|--------|
| **Gregorian** | 1,2,3,5,7,10,11,12 (+ Easter-based) | 4,6,8,9 | Good; Easter spreads across 3–4. |
| **Islamic** | 1,2,3,7,8,9,10,12 | 4,5,6,11 | **+3**: Arbaeen 2/20, Mi'raj 7/27, Bara'ah 8/15. |
| **Hebrew** | 1,3,7,9,12 | 2,4,5,6,8,10,11 | Major holidays covered. |
| **Persian** | 1,2,3,8,9,11,12 | 4,5,6,7 | Fixed: +1/12, 3/14, 3/15, 8/13, 9/30. |
| **Chinese** | 1,2,3,5,7,8,9,11,12 | 4,6,10 | **+2**: Longtaitou 2/2, Qingming 3/5. |
| **Ethiopian** | 1,4,5,6,8 | 2,3,7,9–13 | **+1**: Buhe 8/19. |
| **Buddhist** | 2,4,5,7,10,11 | 1,3,6,8,9,12 | **+2**: Songkran 4/13, Kathina 10/15 (approx). |
| **Sikh** | 2,3,8,10 | 1,4,5,6,7,9,11,12 | 4 holidays. |
| **Japanese** | 1,2,4,5,7,8,9,10,11 | 3,6,12 | 15; good coverage. |
| **Baha'i** | 1–19 (Feast day 1 each month) | — | Every month has Feast. |
| **Hindu** | 1,2,7,8,12 | 3,4,5,6,9,10,11 | 7; lunar dates approximate. |
| **Coptic** | 1,4,5,7 | 2,3,6,8–12 | 5 holidays. |
| **Javanese** | 1,3,8,10 | 2,4,5,6,7,9,11,12 | 4; selective. |
| **Armenian** | 1,4,6 | 2,3,5,7–12 | 4 holidays. |
| **Assyrian** | 1,8 | 2–7,9–12 | 3 holidays. |
| **Mayan** | — | — | No month view; stub. |

---

## 3. Plan carried out (implemented)

1. **Persian**: Done earlier — 5 Solar-fixed holidays (1/12, 3/14, 3/15, 8/13, 9/30).
2. **Islamic**: Added Arbaeen (2/20), Laylat al-Mi'raj (7/27), Laylat al-Bara'ah (8/15). All fixed in Hijri (lunar).
3. **Ethiopian**: Added Buhe (8/19), Transfiguration observance.
4. **Buddhist**: Added Songkran (4/13, Thai New Year approx.), Kathina (10/15, approx. end of Vassa).
5. **Chinese**: Added Longtaitou (2/2), Qingming (3/5). Qingming is solar-term–based; 3/5 is approximate.
6. **Approximate vs fixed**: In code, `description` or `infoEn` can note “approx.” where the real date is lunar or movable (e.g. Songkran, Kathina, Qingming). Islamic and Persian fixed dates are per their own calendar.

---

## 4. Data source references

- Iran: [Public holidays in Iran](https://en.wikipedia.org/wiki/Public_holidays_in_Iran), [List of observances set by the Solar Hijri calendar](https://en.wikipedia.org/wiki/List_of_observances_set_by_the_Solar_Hijri_calendar).
- Yalda: [Yalda Night](https://en.wikipedia.org/wiki/Yalda_Night) (30 Azar).
