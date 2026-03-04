"use client";

const TZOLKIN_DAY_NAMES = [
  "Imix", "Ik", "Akʼbal", "Kʼan", "Chikchan", "Kimi", "Manikʼ", "Lamat", "Muluk",
  "Ok", "Chuwen", "Eb", "Bʼen", "Ix", "Men", "Kʼibʼ", "Kaban", "Etzʼnabʼ", "Kawak", "Ajaw",
];

const HAAB_MONTH_NAMES = [
  "Pop", "Woʼ", "Sip", "Sotzʼ", "Sek", "Xul", "Yaxkʼin", "Mol", "Chʼen", "Yax",
  "Sakʼ", "Keh", "Mak", "Kʼankʼin", "Muwan", "Pax", "Kʼayabʼ", "Kumkʼu", "Wayebʼ",
];

/** Days since Maya epoch: 0.0.0.0.0 = Aug 11, 3114 BCE (Gregorian) */
function getDaysSinceMayaEpoch(date: Date): number {
  const epoch = new Date(-3114, 7, 11);
  return Math.floor((date.getTime() - epoch.getTime()) / 86400000);
}

type MayanCalendarProps = {
  year: number;
};

/**
 * Mayan: Long Count, Tzolkin, and Haab (Calendar Round) with current position.
 */
export default function MayanCalendar({ year }: MayanCalendarProps) {
  const today = new Date();
  const diff = getDaysSinceMayaEpoch(today);

  const baktun = Math.floor(diff / 144000);
  const katun = Math.floor(diff / 7200) % 20;
  const tun = Math.floor(diff / 360) % 20;
  const uinal = Math.floor(diff / 20) % 18;
  const kin = diff % 20;

  const tzolkinIndex = ((diff % 260) + 260) % 260;
  const tzolkinNumber = (tzolkinIndex % 13) + 1;
  const tzolkinName = TZOLKIN_DAY_NAMES[tzolkinIndex % 20];

  const haabIndex = ((diff % 365) + 365) % 365;
  const haabMonthIndex = Math.floor(haabIndex / 20);
  const haabDay = (haabIndex % 20) + 1;
  const haabMonthName = HAAB_MONTH_NAMES[haabMonthIndex];
  const isWayeb = haabMonthIndex === 18;

  return (
    <section
      className="space-y-6"
      aria-label="Mayan calendar — Long Count, Tzolkin, Haab"
    >
      <article
        className="rounded-xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
        aria-label="Long Count"
      >
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Long Count
        </h2>
        <p className="font-mono text-2xl text-zinc-700 dark:text-zinc-300">
          {baktun}.{katun}.{tun}.{uinal}.{kin}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Baktun.Katun.Tun.Uinal.Kin — cycles of 20 (except Tun: 18 Uinal)
        </p>
      </article>

      <div className="grid gap-6 sm:grid-cols-2">
        <article
          className="rounded-xl border border-white/20 bg-white/70 p-5 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
          aria-label="Tzolkin (260-day sacred count)"
        >
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Tzolkin
          </h2>
          <p className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
            {tzolkinNumber} {tzolkinName}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            260-day cycle — 13 numbers × 20 day names
          </p>
        </article>

        <article
          className="rounded-xl border border-white/20 bg-white/70 p-5 shadow-lg backdrop-blur-sm dark:border-zinc-600/30 dark:bg-zinc-800/70"
          aria-label="Haab (365-day solar count)"
        >
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Haab
          </h2>
          <p className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
            {haabDay} {haabMonthName}
            {isWayeb && " (Wayeb)"}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            365-day year — 18 months × 20 days + 5 Wayeb
          </p>
        </article>
      </div>
    </section>
  );
}
