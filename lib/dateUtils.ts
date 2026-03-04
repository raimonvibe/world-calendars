/**
 * Date utilities: today's date (real-time via new Date()), formatting helpers.
 * No backend—pure client-side date handling.
 */

/**
 * Returns "today" as a JavaScript Date (real-time).
 * In the app we use this so the UI always shows current date in each calendar.
 */
export function today(): Date {
  return new Date();
}

/**
 * Format a Gregorian date as YYYY-MM-DD for input[type="date"] and conversions.
 */
export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date (local midnight).
 */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Format for display: e.g. "March 04, 2026"
 */
export function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
