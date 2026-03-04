type DayCellProps = {
  day: number;
  isToday?: boolean;
  original?: string;
};

/**
 * Single day cell: number, optional original script, today highlight.
 * Touch-friendly min size (44px where possible).
 */
export default function DayCell({ day, isToday, original }: DayCellProps) {
  return (
    <span
      className={`flex min-h-10 min-w-10 items-center justify-center rounded-md py-1 text-sm sm:min-h-11 sm:min-w-11 md:min-h-[2.75rem] md:min-w-[2.75rem] ${
        isToday
          ? "bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-700 dark:text-zinc-300"
      }`}
      aria-current={isToday ? "date" : undefined}
      title={original ? `${day} (${original})` : undefined}
    >
      {day}
    </span>
  );
}
