"use client";

import { useRouter } from "next/navigation";

export type MonthOption = {
  value: number;
  label: string;
};

type MonthPickerProps = {
  calendarId: string;
  year: number;
  currentMonth: number;
  options: MonthOption[];
};

export default function MonthPicker({
  calendarId,
  year,
  currentMonth,
  options,
}: MonthPickerProps) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Jump to month</span>
      <select
        className="min-h-[44px] min-w-[44px] rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm font-medium text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
        value={currentMonth}
        onChange={(e) => {
          const m = parseInt(e.target.value, 10);
          if (Number.isFinite(m)) router.push(`/calendar/${calendarId}/${year}/${m}`);
        }}
        aria-label="Jump to month"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
